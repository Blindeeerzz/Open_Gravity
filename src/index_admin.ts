import { initDB } from "./db/database.js";
import { botAdmin } from "./bot_admin.js";

async function bootstrap() {
  console.log("==========================================");
  console.log("💼 Iniciando Agente Chloe (Secretaría/Finanzas)...");
  console.log("==========================================");

  try {
    initDB();
    console.log("✅ Base de datos (Admin) inicializada y lista.");
    
    if (!botAdmin) {
      console.error("❌ Token no encontrado. Revisa la variable TELEGRAM_BOT_TOKEN_ADMIN");
      process.exit(1);
    }

    botAdmin.start({
      onStart: (botInfo) => {
        console.log(`✅ Conectada exitosamente a Telegram como @${botInfo.username}`);
        console.log("📡 Escuchando mensajes de administración... (Presiona Ctrl+C para detener)");
      }
    });

  } catch (error) {
    console.error("❌ Error grave iniciando la Agente Chloe:", error);
    process.exit(1);
  }
}

process.once("SIGINT", () => { if (botAdmin) botAdmin.stop(); });
process.once("SIGTERM", () => { if (botAdmin) botAdmin.stop(); });

bootstrap();
