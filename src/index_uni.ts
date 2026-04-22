import { initDB } from "./db/database.js";
import { botUni } from "./bot_uni.js";

async function bootstrap() {
  console.log("==========================================");
  console.log("🎓 Iniciando Agente Universitario...");
  console.log("==========================================");

  try {
    initDB();
    console.log("✅ Base de datos (Universidad) lista.");
    
    if (!botUni) {
      console.error("❌ Token no encontrado. Revisa la variable TELEGRAM_BOT_TOKEN_UNI");
      process.exit(1);
    }

    botUni.start({
      onStart: (botInfo) => {
        console.log(`✅ Conectado exitosamente como @${botInfo.username}`);
        console.log("📡 Escuchando... (Ctrl+C para detener)");
      }
    });
  } catch (error) {
    console.error("❌ Error grave:", error);
    process.exit(1);
  }
}

process.once("SIGINT", () => { if (botUni) botUni.stop(); });
process.once("SIGTERM", () => { if (botUni) botUni.stop(); });
bootstrap();
