import { initDB } from "./db/database.js";
import { botInmo } from "./bot_inmo.js";

async function bootstrap() {
  console.log("==========================================");
  console.log("🏠 Iniciando Agente Inmobiliario...");
  console.log("==========================================");

  try {
    // 1. Inicializar base de datos SQLite (asegura que las tablas existan)
    initDB();
    console.log("✅ Base de datos (Inmobiliaria) inicializada y lista.");
    
    if (!botInmo) {
      console.error("❌ Token no encontrado. Revisa la variable TELEGRAM_BOT_TOKEN_INMO");
      process.exit(1);
    }

    // 2. Conectar a Telegram
    botInmo.start({
      onStart: (botInfo) => {
        console.log(`✅ Conectado exitosamente a Telegram como @${botInfo.username}`);
        console.log("📡 Escuchando mensajes... (Presiona Ctrl+C para detener)");
      }
    });

  } catch (error) {
    console.error("❌ Error grave iniciando el Agente Inmobiliario:", error);
    process.exit(1);
  }
}

// Manejar cierres limpios
process.once("SIGINT", () => { if (botInmo) botInmo.stop(); });
process.once("SIGTERM", () => { if (botInmo) botInmo.stop(); });

bootstrap();
