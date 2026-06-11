import { initDB } from "./db/database.js";
import { bot } from "./bot.js";
import { botMark } from "./bot_mark.js";
import { botUni } from "./bot_uni.js";
import { botConst } from "./bot_const.js";
import { setupServer } from "./server.js";
import { initMCPClient } from "./agent/mcpClient.js";

async function bootstrap() {
  console.log("==========================================");
  console.log("🚀 Iniciando Hecate Serveis Monolithic Hub...");
  console.log("==========================================");

  try {
    // 1. Inicializar la base de datos SQLite
    console.log("⚙️  Verificando base de datos SQLite...");
    initDB();
    console.log("✅ Base de datos lista.");

    // 1.5. Iniciar Servidor Express para escuchar Webhooks (TradingView / etc)
    setupServer();

    // 1.8. Iniciar el Puente Universal de Model Context Protocol (MCP) compartiendo RAM
    await initMCPClient();

    // 2. Iniciar el bot de Telegram Principal (MiKha)
    console.log("🤖 Conectando agentes a Telegram...");
    
    bot.start({
      onStart: (botInfo) => {
        console.log(`✅ Agente Principal conectado exitosamente como @${botInfo.username}`);
      }
    });

    console.log("📡 Escuchando red WillMax AI Systems... (Ctrl+C para detener)");

  } catch (error) {
    console.error("❌ Error grave iniciando el Hub:", error);
    process.exit(1);
  }
}

// Interceptar señales de cierre para limpiar procesos
process.once("SIGINT", () => { bot.stop(); });
process.once("SIGTERM", () => { bot.stop(); });

bootstrap();
