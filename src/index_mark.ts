import { initDB } from "./db/database.js";
import { botMark } from "./bot_mark.js";
import { initMCPClient, BRAVE_SEARCH_SERVER } from "./agent/mcpClient.js";

async function bootstrap() {
  console.log("==========================================");
  console.log("📈 Iniciando Agente de Marketing y 3D...");
  console.log("==========================================");

  try {
    // 1. Inicializar base de datos SQLite (asegura que las tablas existan)
    initDB();
    console.log("✅ Base de datos (Marketing) inicializada y lista.");
    
    if (!botMark) {
      console.error("❌ Token no encontrado. Revisa la variable TELEGRAM_BOT_TOKEN_MARK");
      process.exit(1);
    }

    // Conectar el Model Context Protocol para que Jasmin tenga herramientas (ej. Brave Search)
    await initMCPClient([BRAVE_SEARCH_SERVER]);
    
    // 2. Conectar a Telegram
    botMark.start({
      onStart: (botInfo) => {
        console.log(`✅ Conectado exitosamente a Telegram como @${botInfo.username}`);
        console.log("📡 Escuchando mensajes... (Presiona Ctrl+C para detener)");
      }
    });

  } catch (error) {
    console.error("❌ Error grave iniciando el Agente de Marketing:", error);
    process.exit(1);
  }
}

// Manejar cierres limpios
process.once("SIGINT", () => { if (botMark) botMark.stop(); });
process.once("SIGTERM", () => { if (botMark) botMark.stop(); });

bootstrap();
