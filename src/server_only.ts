import { initDB } from "./db/database.js";
import { setupServer } from "./server.js";
import { initMCPClient } from "./agent/mcpClient.js";

async function bootstrapAPI() {
  console.log("==========================================");
  console.log("🚀 Iniciando Hecate Serveis (API Mode)...");
  console.log("==========================================");

  try {
    console.log("⚙️  Verificando base de datos SQLite...");
    initDB();
    console.log("✅ Base de datos lista.");

    console.log("🌐 Arrancando Servidor API para Interfaz Gráfica (Sin Telegram Polling)...");
    setupServer();

    console.log("🛠️ Conectando Cliente Universal MCP...");
    await initMCPClient();

  } catch (error) {
    console.error("❌ Error grave en la API:", error);
    process.exit(1);
  }
}

bootstrapAPI();
