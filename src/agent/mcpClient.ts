import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { config } from "../config.js";

export interface McpServerConfig {
  name: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
}

// Client Registry
const mcpClients = new Map<string, Client>();
let mcpToolsRegistry: { serverName: string, tool: any }[] = [];

// Lista de servidores MCP a despertar. 
// De momento solo instalaremos el de Brave Search para la fase piloto.
export const BRAVE_SEARCH_SERVER: McpServerConfig = {
  name: "brave-search",
  command: "npx",
  args: ["-y", "@modelcontextprotocol/server-brave-search"],
  env: {
    BRAVE_API_KEY: process.env.BRAVE_API_KEY || "",
    PATH: process.env.PATH || "" // Necesario para que npx funcione en subprocesos
  }
};

export const FETCH_SERVER: McpServerConfig = {
  name: "fetch",
  command: "npx",
  args: ["-y", "@modelcontextprotocol/server-fetch"],
  env: {
    PATH: process.env.PATH || ""
  }
};

export const GITHUB_SERVER: McpServerConfig = {
  name: "github",
  command: "npx",
  args: ["-y", "@modelcontextprotocol/server-github"],
  env: {
    GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN || "",
    PATH: process.env.PATH || ""
  }
};

export async function initMCPClient(servers: McpServerConfig[] = []) {
  if (!servers || servers.length === 0) return;

  const initPromises = servers.map(async (serverConf) => {
    if (mcpClients.has(serverConf.name)) return; // Evitar reconexión si ya existe

    console.log(`[MCP] Iniciando transporte hacia el servidor ${serverConf.name}...`);
    
    if (serverConf.name === "brave-search" && (!serverConf.env || !serverConf.env.BRAVE_API_KEY)) {
      console.warn("⚠️ [MCP] BRAVE_API_KEY no detectada. El servidor MCP de Brave Search no funcionará correctamente.");
    }

    const transport = new StdioClientTransport({
      command: serverConf.command,
      args: serverConf.args,
      env: serverConf.env
    });

    const client = new Client({ name: "hecate-serveis-client", version: "1.0.0" }, { capabilities: {}});

    try {
      await client.connect(transport);
      
      // Guardar el cliente
      mcpClients.set(serverConf.name, client);
      console.log(`✅ [MCP] Conectado exitosamente al servidor: ${serverConf.name}`);
      
      // Consultar y registrar sus herramientas asincrónicamente
      const { tools } = await client.listTools();
      tools.forEach(t => mcpToolsRegistry.push({ serverName: serverConf.name, tool: t }));
      
      console.log(`✅ [MCP] ${tools.length} Herramientas detectadas en ${serverConf.name}.`);
      
    } catch (error) {
      console.error(`❌ [MCP] Error conectando al servidor ${serverConf.name}:`, error);
    }
  });

  await Promise.all(initPromises);
}

export function getMCPTools() {
  if (mcpToolsRegistry.length === 0) return [];
  
  // Mapeamos el esquema de JSON de MCP al formato "function" de OpenAI/Gemini
  return mcpToolsRegistry.map(reg => ({
    type: "function" as const,
    function: {
      name: reg.tool.name,
      description: reg.tool.description || `Execute ${reg.tool.name} via MCP [Server: ${reg.serverName}]`,
      parameters: reg.tool.inputSchema
    }
  }));
}

export async function executeMCPTool(toolName: string, args: any): Promise<string> {
  const toolEntry = mcpToolsRegistry.find(reg => reg.tool.name === toolName);
  
  if (!toolEntry) {
    return `Error: Herramienta MCP no registrada en el ecosistema.`;
  }

  const client = mcpClients.get(toolEntry.serverName);
  if (!client) {
    return `Error: Servidor MCP asociado (${toolEntry.serverName}) inactivo u offline.`;
  }

  try {
    console.log(`[MCP] Ejecutando herramienta remota [${toolEntry.serverName}]: ${toolName}`);
    const result = await client.callTool({
      name: toolName,
      arguments: args
    });
    
    if (result.isError) {
      return `Error interno de la herramienta MCP (${toolName}): ${JSON.stringify(result.content)}`;
    }
    
    const content = result.content as any[];
    if (content && content.length > 0) {
      if (content[0].type === "text") {
        return content[0].text;
      }
      return JSON.stringify(content);
    }
    
    return "La herramienta se ejecutó pero no devolvió ninguna salida textual.";
    
  } catch (error: any) {
    console.error(`[MCP] Error ejecutando ${toolName}:`, error);
    return `Excepción ejecutando herramienta MCP: ${error.message}`;
  }
}
