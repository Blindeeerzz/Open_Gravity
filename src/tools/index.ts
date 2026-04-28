import { getCurrentTimeToolDef, executeGetCurrentTime } from "./get_current_time.js";
import { postToMoltbookToolDef, executePostToMoltbook } from "./moltbook.js";
import { navegarWebTool, executeNavegarWeb } from "./web_scraper.js";
import { scheduleAppointmentToolDef, executeScheduleAppointment } from "./schedule_appointment.js";
import { sendEmailToolDef, executeSendEmail } from "./send_email.js";
import { crmSheetsToolDef, executeCrmSheets } from "./crm_sheets.js";
import { getCryptoPriceToolDef, executeGetCryptoPrice } from "./get_crypto_price.js";
import { shodanToolDef, executeShodanSearch } from "./shodan.js";
import { 
  whoisLookupToolDef, executeWhoisLookup,
  dnsLookupToolDef, executeDnsLookup,
  portScannerToolDef, executePortScanner,
  httpHeadersScannerToolDef, executeHttpHeadersScanner,
  subdomainSearchToolDef, executeSubdomainSearch,
  nmapToolDef, executeNmap
} from "./cyber_tools.js";
import { getMCPTools, executeMCPTool } from "../agent/mcpClient.js";
// Lista de definiciones para enviarle al LLM
export const availableToolsDefinitions = [
  getCurrentTimeToolDef,
  postToMoltbookToolDef,
  navegarWebTool,
  scheduleAppointmentToolDef,
  sendEmailToolDef,
  crmSheetsToolDef,
  getCryptoPriceToolDef,
  shodanToolDef,
  whoisLookupToolDef,
  dnsLookupToolDef,
  portScannerToolDef,
  httpHeadersScannerToolDef,
  subdomainSearchToolDef,
  nmapToolDef
];

export function getCombinedTools() {
  const mcpTools = getMCPTools();
  return [...availableToolsDefinitions, ...mcpTools];
}

// Ejecutor unificado
export async function executeToolWrapper(name: string, args: any): Promise<string> {
  console.log(`[ToolExecution] Executing ${name} with args: ${JSON.stringify(args)}`);
  
  // Verificar si es una herramienta MCP remota
  const mcpTools = getMCPTools();
  if (mcpTools.find(tool => tool.function.name === name)) {
    return await executeMCPTool(name, args);
  }

  try {
    switch (name) {
      case "get_current_time":
        return await executeGetCurrentTime();
      case "post_to_moltbook":
        return await executePostToMoltbook(args.submolt, args.content);
      case "navegar_web":
        return await executeNavegarWeb(args.url);
      case "agendar_reunion":
        return await executeScheduleAppointment(args.fecha_hora, args.asunto, args.nombre_cliente, args.email_cliente);
      case "enviar_correo":
        return await executeSendEmail(args);
      case "registrar_cliente_crm":
        return await executeCrmSheets(args.nombre, args.contacto, args.interes, args.agente_responsable, args.notas);
      case "get_crypto_price":
        return await executeGetCryptoPrice(args.symbol);
      case "shodan_search":
        return await executeShodanSearch(args.query, args.type);
      case "whois_lookup":
        return await executeWhoisLookup(args.domain);
      case "dns_lookup":
        return await executeDnsLookup(args.domain);
      case "port_scanner":
        return await executePortScanner(args.target);
      case "http_headers_scanner":
        return await executeHttpHeadersScanner(args.url);
      case "subdomain_search":
        return await executeSubdomainSearch(args.domain);
      case "nmap_scan":
        return await executeNmap(args.target, args.flags);
      default:
        return `Error: Tool "${name}" is not implemented.`;
    }
  } catch (error: any) {
    console.error(`[ToolExecution Error]: ${error?.message}`);
    return `Error executing tool: ${error?.message || "Unknown error"}`;
  }
}
