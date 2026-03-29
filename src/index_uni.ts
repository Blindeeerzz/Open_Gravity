import { initDB } from "./db/database.js";
import { bot } from "./bot_uni.js";

async function bootstrap() {
  console.log("==========================================");
  console.log("🎓 Iniciando Agente Universitario...");
  console.log("==========================================");

  try {
    initDB();
    console.log("✅ Base de datos (Universidad) lista.");
    
    bot.start({
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

process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());
bootstrap();
