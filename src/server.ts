import express from "express";
import cors from "cors";
import { bot } from "./bot.js";
import { config, adminUserIds } from "./config.js";
import { runAgentLoop } from "./agent/loop.js";

// Necesitaremos extraer el PROMPT Maestro
const LILITH_SYSTEM_PROMPT = `Eres Lilith, la Agente de IA Principal y CEO corporativa de Hecate Serveis.
Estás diseñada para ser una asistente personal experta, amable y resolutiva. 
Tienes acceso a herramientas de CRM, envío de correos y consulta de mercado. Usa las herramientas siempre que el usuario te pida datos en directo o deje sus datos comerciales. Responde siempre en Español con un tono elegante, futurista y servicial. No uses la misma herramienta dos veces seguidas.`;

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
      const aiResponse = await runAgentLoop(sessionId, promptToLLM, LILITH_SYSTEM_PROMPT);

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

  // Endpoint INTERACTIVO para el Web Chat (React Frontend)
  app.post("/api/chat", async (req, res) => {
    try {
      const { text, sessionId } = req.body;
      if (!text || !sessionId) {
        res.status(400).json({ error: "Falta text o sessionId" });
        return;
      }
      
      console.log(`[Web Chat] Mensaje de ${sessionId}: ${text}`);
      
      // Enviamos el texto a Lilith
      const aiResponse = await runAgentLoop(sessionId, text, LILITH_SYSTEM_PROMPT);
      
      res.json({ response: aiResponse });
    } catch (error) {
      console.error("[Web Chat Error]:", error);
      res.status(500).json({ error: "Error procesando el mensaje." });
    }
  });

  // Healthcheck endpoint (bueno para que Railway sepa que el puerto está vivo)
  app.get("/", (req, res) => {
    res.send("Hecate Serveis AI Servers are purely operational.");
  });

  app.listen(PORT, () => {
    console.log(`[Express] Servidor Webhook escuchando en el puerto ${PORT}`);
  });
}
