import { initDB } from "./db/database.js";
import { bot } from "./bot_mark.js";

async function bootstrap() {
  console.log("==========================================");
  console.log("📈 Iniciando Agente de Marketing y 3D...");
  console.log("==========================================");

  try {
    // 1. Inicializar base de datos SQLite (asegura que las tablas existan)
    initDB();
    console.log("✅ Base de datos (Marketing) inicializada y lista.");
    
    // 2. Conectar a Telegram
    bot.start({
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
process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());

bootstrap();
