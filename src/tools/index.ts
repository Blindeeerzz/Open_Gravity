import { getCurrentTimeToolDef, executeGetCurrentTime } from "./get_current_time.js";
import { postToMoltbookToolDef, executePostToMoltbook } from "./moltbook.js";
import { navegarWebTool, executeNavegarWeb } from "./web_scraper.js";

// Lista de definiciones para enviarle al LLM
export const availableToolsDefinitions = [
  getCurrentTimeToolDef,
  postToMoltbookToolDef,
  navegarWebTool
];

// Ejecutor unificado
export async function executeToolWrapper(name: string, args: any): Promise<string> {
  console.log(`[ToolExecution] Executing ${name} with args: ${JSON.stringify(args)}`);
  try {
    switch (name) {
      case "get_current_time":
        return await executeGetCurrentTime();
      case "post_to_moltbook":
        return await executePostToMoltbook(args.submolt, args.content);
      case "navegar_web":
        return await executeNavegarWeb(args.url);
      default:
        return `Error: Tool "${name}" is not implemented.`;
    }
  } catch (error: any) {
    console.error(`[ToolExecution Error]: ${error?.message}`);
    return `Error executing tool: ${error?.message || "Unknown error"}`;
  }
}
