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

    // 3. Iniciar el bot Marketer (Jasmin) si el token está definido
    if (botMark) {
      botMark.start({
        onStart: (botInfo) => console.log(`✅ Agente Marketer (Jasmin) conectada: @${botInfo.username}`)
      });
    } else {
      console.warn("⚠️ [Skip] Token de Jasmin (MARK) ausente. Agente en suspensión.");
    }

    // 4. Iniciar el bot Estratega de Ventas (Edu) si el token está definido
    if (botUni) {
      botUni.start({
        onStart: (botInfo) => console.log(`✅ Agente Ventas B2B (Edu) conectado: @${botInfo.username}`)
      });
    } else {
      console.warn("⚠️ [Skip] Token de Edu (UNI) ausente. Agente en suspensión.");
    }

    // 5. Iniciar el bot de Ingeniería Civil (Pere) si el token está definido
    if (botConst) {
      botConst.start({
        onStart: (botInfo) => console.log(`✅ Agente Ing. Construcción (Pere) conectado: @${botInfo.username}`)
      });
    } else {
      console.warn("⚠️ [Skip] Token de Pere (CONST) ausente. Agente en suspensión.");
    }

    console.log("📡 Escuchando red WillMax AI Systems... (Ctrl+C para detener)");

  } catch (error) {
    console.error("❌ Error grave iniciando el Hub:", error);
    process.exit(1);
  }
}

// Interceptar señales de cierre para limpiar procesos
process.once("SIGINT", () => { bot.stop(); if(botMark) botMark.stop(); if(botUni) botUni.stop(); if(botConst) botConst.stop(); });
process.once("SIGTERM", () => { bot.stop(); if(botMark) botMark.stop(); if(botUni) botUni.stop(); if(botConst) botConst.stop(); });

bootstrap();
