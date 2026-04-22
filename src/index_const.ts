import { initDB } from "./db/database.js";
import { botConst } from "./bot_const.js";

async function bootstrap() {
  console.log("==========================================");
  console.log("🏗️ Iniciando Agente de Construcción...");
  console.log("==========================================");

  try {
    initDB();
    console.log("✅ Base de datos (Construcción) lista.");
    
    if (!botConst) {
      console.error("❌ Token no encontrado. Revisa la variable TELEGRAM_BOT_TOKEN_CONST");
      process.exit(1);
    }

    botConst.start({
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

process.once("SIGINT", () => { if (botConst) botConst.stop(); });
process.once("SIGTERM", () => { if (botConst) botConst.stop(); });
bootstrap();
