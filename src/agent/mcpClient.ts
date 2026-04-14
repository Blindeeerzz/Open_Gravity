import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { config } from "../config.js";

interface McpServerConfig {
  name: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
}

// Cliente Singleton
let mcpClient: Client | null = null;
let mcpToolsCache: any[] = [];

// Lista de servidores MCP a despertar. 
// De momento solo instalaremos el de Brave Search para la fase piloto.
const BRAVE_SEARCH_SERVER: McpServerConfig = {
  name: "brave-search",
  command: "npx",
  args: ["-y", "@modelcontextprotocol/server-brave-search"],
  env: {
    BRAVE_API_KEY: process.env.BRAVE_API_KEY || "",
    PATH: process.env.PATH || "" // Necesario para que npx funcione en subprocesos
  }
};

export async function initMCPClient() {
  if (mcpClient) return;
  
  if (!process.env.BRAVE_API_KEY) {
    console.warn("⚠️ [MCP] BRAVE_API_KEY no detectada. El servidor MCP de Brave Search no funcionará correctamente.");
  }

  console.log(`[MCP] Iniciando transporte hacia el servidor ${BRAVE_SEARCH_SERVER.name}...`);
  
  const transport = new StdioClientTransport({
    command: BRAVE_SEARCH_SERVER.command,
    args: BRAVE_SEARCH_SERVER.args,
    env: BRAVE_SEARCH_SERVER.env
  });

  mcpClient = new Client({ name: "hecate-serveis-client", version: "1.0.0" }, { capabilities: {}});

  try {
    await mcpClient.connect(transport);
    console.log(`✅ [MCP] Conectado exitosamente al servidor: ${BRAVE_SEARCH_SERVER.name}`);
    
    // Cachear herramientas
    const { tools } = await mcpClient.listTools();
    mcpToolsCache = tools;
    console.log(`✅ [MCP] Herramientas detectadas: ${tools.map(t => t.name).join(", ")}`);
    
  } catch (error) {
    console.error("❌ [MCP] Error conectando al servidor MCP:", error);
    mcpClient = null;
  }
}

export function getMCPTools() {
  if (!mcpClient || mcpToolsCache.length === 0) return [];
  
  // Mapeamos el esquema de JSON de MCP al formato "function" de OpenAI/Gemini
  return mcpToolsCache.map(tool => ({
    type: "function" as const,
    function: {
      name: tool.name,
      description: tool.description || `Execute ${tool.name} via MCP`,
      parameters: tool.inputSchema
    }
  }));
}

export async function executeMCPTool(toolName: string, args: any): Promise<string> {
  if (!mcpClient) {
    return "Error: Cliente MCP no está conectado o disponible.";
  }

  try {
    console.log(`[MCP] Ejecutando herramienta remota: ${toolName}`);
    const result = await mcpClient.callTool({
      name: toolName,
      arguments: args
    });
    
    if (result.isError) {
      return `Error interno de la herramienta MCP (${toolName}): ${JSON.stringify(result.content)}`;
    }
    
    // Las herramientas MCP devuelven un arreglo "content" donde el primer item suele ser texto
    if (result.content && result.content.length > 0) {
      if (result.content[0].type === "text") {
        return result.content[0].text;
      }
      return JSON.stringify(result.content);
    }
    
    return "La herramienta se ejecutó pero no devolvió ninguna salida textual.";
    
  } catch (error: any) {
    console.error(`[MCP] Error ejecutando ${toolName}:`, error);
    return `Excepción ejecutando herramienta MCP: ${error.message}`;
  }
}
