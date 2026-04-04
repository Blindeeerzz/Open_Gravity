import { initDB } from "./db/database.js";
import { bot } from "./bot.js";
import { setupServer } from "./server.js";

async function bootstrap() {
  console.log("==========================================");
  console.log("🚀 Iniciando MiKha Agent...");
  console.log("==========================================");

  try {
    // 1. Inicializar la base de datos SQLite
    console.log("⚙️  Verificando base de datos SQLite...");
    initDB();
    console.log("✅ Base de datos lista.");

    // 1.5. Iniciar Servidor Express para escuchar Webhooks (TradingView)
    setupServer();

    // 2. Iniciar el bot de Telegram
    console.log("🤖 Conectando a Telegram...");
    
    bot.start({
      onStart: (botInfo) => {
        console.log(`✅ Bot conectado exitosamente como @${botInfo.username}`);
        console.log("📡 Escuchando mensajes de usuarios autorizados... (Ctrl+C para detener)");
      }
    });

  } catch (error) {
    console.error("❌ Error grave iniciando MiKha:", error);
    process.exit(1);
  }
}

// Interceptar señales de cierre para limpiar procesos
process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());

bootstrap();
