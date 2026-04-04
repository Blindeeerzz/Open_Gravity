import express from "express";
import cors from "cors";
import { bot } from "./bot.js";
import { config, adminUserIds } from "./config.js";
import { runAgentLoop } from "./agent/loop.js";

// Necesitaremos extraer MIKHA_PROMPT, pero como no está exportado, crearemos una referencia rápida aquí a su rol
const MIKHA_SYSTEM_PROMPT = `Eres MiKha, un Agente de IA experto en trading y criptomonedas.
Tu creador acaba de recibir una ALERTA AUTOMÁTICA DE TRADINGVIEW. 
Analiza los datos técnicos de esa alerta, elabora un resumen rápido de lo que significa (ej. "El RSI indica sobrecompra, cuidado con largos") y recomiéndale qué hacer basándote en un análisis técnico sensato.`;

export function setupServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware para parsear JSON y texto
  app.use(cors());
  app.use(express.json());
  app.use(express.text()); // Por si TradingView manda texto plano

  // Endpoint para que TradingView envíe las alertas (Webhooks)
  app.post("/api/webhook", async (req, res) => {
    try {
      const payload = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
      console.log("[Webhook] Alerta de TradingView recibida:", payload);

      // Respondemos rápido a TradingView para que no de Timeout
      res.status(200).send("Webhook recibido por Lilith.");

      // Si no hay administradores, no podemos avisar a nadie
      if (!adminUserIds || adminUserIds.length === 0) return;

      const mainAdminId = adminUserIds[0];
      const sessionId = `${mainAdminId}_mikha`;

      // Simular que el bot está escribiendo
      await bot.api.sendChatAction(mainAdminId, "typing");

      // Mandar la alerta cruda al cerebro de Lilith para que la analice
      const promptToLLM = `Alerta de sistema (TradingView): \n${payload}\n\nAnaliza esta señal brevemente para el inversor.`;
      const aiResponse = await runAgentLoop(sessionId, promptToLLM, MIKHA_SYSTEM_PROMPT);

      // Enviar la alerta procesada por Telegram al administrador
      await bot.api.sendMessage(
        mainAdminId, 
        `🚨 *ALERTA DE MERCADO (TradingView)* 🚨\n\n${aiResponse}`, 
        { parse_mode: "Markdown" }
      );

    } catch (error) {
      console.error("[Webhook Error]:", error);
      res.status(500).send("Error interno procesando webhook.");
    }
  });

  // Healthcheck endpoint (bueno para que Railway sepa que el puerto está vivo)
  app.get("/", (req, res) => {
    res.send("Open_Gravity AI Servers are purely operational.");
  });

  app.listen(PORT, () => {
    console.log(`[Express] Servidor Webhook escuchando en el puerto ${PORT}`);
  });
}
