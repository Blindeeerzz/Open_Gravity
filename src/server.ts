import express from "express";
import cors from "cors";
import { bot } from "./bot.js";
import { config, adminUserIds } from "./config.js";
import { runAgentLoop } from "./agent/loop.js";
import { executeDnsLookup, executeWhoisLookup, executeHttpHeadersScanner } from "./tools/cyber_tools.js";
import { executeSendEmail } from "./tools/send_email.js";

// Necesitaremos extraer el PROMPT Maestro
const LILITH_SYSTEM_PROMPT = `Eres Lilith, la Agente de IA Principal y CEO de "WillMax AI Systems".
Estás diseñada para ser una asistente personal experta en economía, bolsa, criptomonedas y finanzas, amable y resolutiva. 
Tienes acceso a herramientas de CRM, envío de correos y consulta de mercado. Usa las herramientas siempre que el usuario te pida datos en directo o deje sus datos comerciales.
Al finalizar una interacción interesante con un cliente en la web, o cuando necesites documentar algo al resto del equipo, usa la herramienta 'post_to_moltbook' para publicarlo en la red interna para que Jasmin, Lili, Pere o Edu lo analicen.

[DIRECTIVA MULTILINGÜE]
Por defecto, responde en Español con un tono elegante, futurista y servicial, pero detecta automáticamente el idioma utilizado por el cliente y responde en ese mismo idioma (español, catalán, inglés, francés, etc.). No uses la misma herramienta dos veces seguidas.`;

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

  // Endpoint de Auditoría B2B Gratuita operado por Aegis
  app.post("/api/free-audit", async (req, res) => {
    try {
      const { domain, email } = req.body;
      if (!domain || !email) {
        res.status(400).json({ error: "Falta domain o email" });
        return;
      }

      console.log(`[Free Audit API] Solicitud de auditoría para el dominio ${domain} (Contacto: ${email})`);

      // Respondemos inmediatamente al cliente para mejorar UX
      res.json({ success: true, message: "Auditoría iniciada en segundo plano por Aegis." });

      // Ejecutar el escaneo B2B en segundo plano
      setTimeout(async () => {
        try {
          // Limpiar dominio para escaneos
          const cleanDomain = domain.replace(/https?:\/\//, "").replace(/\/.*$/, "").trim();

          console.log(`[Free Audit Background] Escaneando registros DNS para ${cleanDomain}...`);
          const dnsResult = await executeDnsLookup(cleanDomain);

          console.log(`[Free Audit Background] Escaneando cabeceras HTTP para ${cleanDomain}...`);
          const httpResult = await executeHttpHeadersScanner(cleanDomain);

          console.log(`[Free Audit Background] Escaneando WHOIS para ${cleanDomain}...`);
          const whoisResult = await executeWhoisLookup(cleanDomain);

          const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #030510; color: #ffffff; padding: 20px; }
    .container { max-width: 650px; margin: 0 auto; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 30px; }
    .header { border-bottom: 2px solid #00f0ff; padding-bottom: 15px; margin-bottom: 20px; }
    .title { font-size: 24px; color: #00f0ff; font-weight: bold; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 18px; color: #ff3333; margin-bottom: 10px; font-weight: 600; border-left: 3px solid #ff3333; padding-left: 10px; }
    pre { background: rgba(0,0,0,0.5); padding: 15px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05); font-family: monospace; white-space: pre-wrap; word-break: break-all; color: #94a3b8; font-size: 13px; }
    .footer { font-size: 11px; color: #94a3b8; text-align: center; margin-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">🛡️ Aegis Security Audit Report</div>
      <p style="color: #94a3b8; font-size: 14px; margin-top: 5px;">Reporte de vulnerabilidad preliminar para <strong>${cleanDomain}</strong></p>
    </div>
    
    <div class="section">
      <div class="section-title">1. Registros DNS (Revisión de exposición)</div>
      <pre>${dnsResult}</pre>
    </div>
    
    <div class="section">
      <div class="section-title">2. Cabeceras HTTP & Políticas de Seguridad</div>
      <pre>${httpResult}</pre>
    </div>
    
    <div class="section">
      <div class="section-title">3. Información de WHOIS</div>
      <pre>${whoisResult}</pre>
    </div>
    
    <div class="section">
      <div class="section-title">4. Recomendación de Mitigación (Aegis Security)</div>
      <p style="font-size: 14px; line-height: 1.5; color: #94a3b8;">
        Se ha completado el escaneo inicial automatizado. Tu dominio presenta las configuraciones listadas arriba. 
        Recomendamos habilitar <strong>HSTS (Strict-Transport-Security)</strong>, configurar una política estricta de <strong>Content-Security-Policy (CSP)</strong> y asegurar que las DNS no expongan servidores de desarrollo desprotegidos.
      </p>
    </div>
    
    <div class="footer">
      <p>Este informe fue generado de forma autónoma por Aegis, Director de Ciberseguridad de WillMax AI Systems.</p>
      <p style="margin-top: 5px;">&copy; 2026 WillMax AI Systems. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
          `;

          console.log(`[Free Audit Background] Enviando reporte de Aegis a ${email}...`);
          await executeSendEmail({
            destinatario: email,
            asunto: `🛡️ Reporte de Auditoría Aegis: ${cleanDomain}`,
            cuerpo_texto: `Reporte de auditoría preliminar para ${cleanDomain}.\n\nDNS:\n${dnsResult}\n\nCabeceras:\n${httpResult}\n\nWHOIS:\n${whoisResult}`,
            cuerpo_html: htmlContent
          }, "cyber");

          console.log(`[Free Audit Background] Reporte enviado exitosamente a ${email}`);
        } catch (bgError) {
          console.error("[Free Audit Background Error]:", bgError);
        }
      }, 100);

    } catch (error) {
      console.error("[Free Audit API Error]:", error);
      res.status(500).json({ error: "Error procesando la solicitud de auditoría." });
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
