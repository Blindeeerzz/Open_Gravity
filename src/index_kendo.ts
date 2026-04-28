import { initDB } from "./db/database.js";
import { botKendo } from "./bot_kendo.js";
import { initMCPClient, FETCH_SERVER, GITHUB_SERVER } from "./agent/mcpClient.js";

async function bootstrap() {
  console.log("==========================================");
  console.log("⛩️ Iniciando Agente Kendo Asist...");
  console.log("==========================================");

  try {
    initDB();
    console.log("✅ Base de datos lista.");
    
    if (!botKendo) {
      console.error("❌ Token no encontrado. Revisa la variable TELEGRAM_BOT_TOKEN_KENDO");
      process.exit(1);
    }

    // Opcional: iniciar herramientas MCP si requiere extraer algo
    await initMCPClient([FETCH_SERVER, GITHUB_SERVER]);

    botKendo.start({
      onStart: (botInfo) => {
        console.log(`✅ Conectado exitosamente como @${botInfo.username}`);
        console.log("📡 Esperando instrucciones del Maestro... (Ctrl+C para detener)");
      }
    });
  } catch (error) {
    console.error("❌ Error grave en Kensei:", error);
    process.exit(1);
  }
}

process.once("SIGINT", () => { if (botKendo) botKendo.stop(); });
process.once("SIGTERM", () => { if (botKendo) botKendo.stop(); });
bootstrap();
