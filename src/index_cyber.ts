import { initDB } from "./db/database.js";
import { botCyber } from "./bot_cyber.js";
import { initMCPClient, FETCH_SERVER, GITHUB_SERVER } from "./agent/mcpClient.js";

async function bootstrap() {
  console.log("==========================================");
  console.log("🔒 Iniciando Agente de Ciberseguridad (Aegis)...");
  console.log("==========================================");

  try {
    initDB();
    console.log("✅ Base de datos (Cyber) lista.");
    
    if (!botCyber) {
      console.error("❌ Token no encontrado. Revisa la variable TELEGRAM_BOT_TOKEN_CYBER");
      process.exit(1);
    }

    // Conectar el Model Context Protocol para que Zero tenga herramientas de auditoría
    await initMCPClient([FETCH_SERVER, GITHUB_SERVER]);

    botCyber.start({
      onStart: (botInfo) => {
        console.log(`✅ Conectado exitosamente de forma cifrada como @${botInfo.username}`);
        console.log("📡 Interceptando señales... (Ctrl+C para detener)");
      }
    });
  } catch (error) {
    console.error("❌ Error grave en Ciberseguridad:", error);
    process.exit(1);
  }
}

process.once("SIGINT", () => { if (botCyber) botCyber.stop(); });
process.once("SIGTERM", () => { if (botCyber) botCyber.stop(); });
bootstrap();
