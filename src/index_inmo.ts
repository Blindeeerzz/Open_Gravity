import { initDB } from "./db/database.js";
import { bot } from "./bot_inmo.js";

async function bootstrap() {
  console.log("==========================================");
  console.log("🏠 Iniciando Agente Inmobiliario...");
  console.log("==========================================");

  try {
    // 1. Inicializar base de datos SQLite (asegura que las tablas existan)
    initDB();
    console.log("✅ Base de datos (Inmobiliaria) inicializada y lista.");
    
    // 2. Conectar a Telegram
    bot.start({
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
process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());

bootstrap();
