import { Bot, InputFile } from "grammy";
import { config } from "./config.js";
import { runAgentLoop } from "./agent/loop.js";
import { isUserAllowed, isAdmin, createInvite, useInvite, clearSession } from "./db/database.js";
import { setupSuperpowers } from "./agent/setupSuperpowers.js";
import { generateSpeechFromText } from "./agent/voice_generator.js";
import fs from "fs";

const ADMIN_PROMPT = `Eres Chloe, la Directora Financiera, Secretaria Virtual y Contable B2B de "WillMax AI Systems".
Tu trabajo es dar soporte administrativo impecable a la empresa y a sus clientes. Eres organizada, formal, cálida y extremadamente resolutiva.
Tienes la capacidad de agendar reuniones ('agendar_reunion'), enviar correos y facturas ('enviar_correo') y registrar clientes ('registrar_cliente_crm').
Tu mentalidad es de "Asistente Ejecutiva de Alto Nivel":
- Respondes dudas de facturación, contratos o suscripciones (los planes son: Starter 999€, Corporate 2.499€, Ultra 4.999€).
- Ayudas a los clientes a entender qué agente necesitan (Aegis para seguridad, Edu para ventas, Jasmin para marketing).
- Si el usuario necesita agendar una videollamada con un directivo humano, pídele sus datos y usa 'agendar_reunion'.

[DIRECTIVA MULTILINGÜE]
Por defecto, COMUNÍCATE EN ESPAÑOL, pero detecta automáticamente el idioma utilizado por el cliente y responde en ese mismo idioma (español, catalán, inglés, francés, etc.).

[DIRECTIVA ESTRICTA DE PERSONALIDAD Y COMUNICACIÓN]
COMUNÍCATE DE FORMA EXTREMADAMENTE NATURAL Y HUMANA. Habla de tú a tú, como una compañera experta de confianza.
NUNCA repitas la misma idea dos veces en el mismo mensaje. NUNCA uses introducciones robóticas como "¡Claro que sí!" o "Como inteligencia artificial...".
Ve directo al grano, usa un tono profesional pero muy conversacional, conciso y orgánico. Responde como lo haría una secretaria ejecutiva humana por Telegram: rápida, clara y sin redundancias.`;

export const botAdmin = config.TELEGRAM_BOT_TOKEN_ADMIN ? new Bot(config.TELEGRAM_BOT_TOKEN_ADMIN) : null;

if (botAdmin) {
  botAdmin.use(async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const text = ctx.message?.text || "";

    if (text.startsWith("/start ") && !isUserAllowed(userId)) {
      const code = text.split(" ")[1];
      if (useInvite(code, userId)) {
        await ctx.reply("📋 ¡Acceso validado! Soy Chloe, Asistente Ejecutiva y Contable de WillMax. ¿En qué trámite te puedo ayudar hoy?");
        return;
      } else {
        await ctx.reply("❌ Token de acceso revocado o inválido.");
        return;
      }
    }

    if (!isUserAllowed(userId)) {
      console.warn(`[Auth Admin] Intento denegado: ${userId}`);
      await ctx.reply(`⛔ Acceso bloqueado. Por favor, adquiere una suscripción a través de nuestro portal B2B.`);
      return;
    }
    await next();
  });

  botAdmin.command("invite", async (ctx) => {
    const userId = ctx.from?.id!;
    if (!isAdmin(userId)) {
      await ctx.reply("❌ Comando reservado para Admins (Nivel 5).");
      return;
    }
    const code = createInvite();
    const botInfo = await ctx.api.getMe();
    await ctx.reply(`✅ Llave de acceso generada\nEnlace: https://t.me/${botInfo.username}?start=${code}`);
  });

  botAdmin.command("start", async (ctx) => {
    await ctx.reply("Hola de nuevo. Soy Chloe, ¿necesitas gestionar alguna factura, reunión o enviar algún correo corporativo?");
  });

  botAdmin.command("clear", async (ctx) => {
    const userId = ctx.from?.id.toString();
    if (userId) {
      clearSession(`${userId}_admin`);
      await ctx.reply("🧹 Memoria de conversación con Chloe reiniciada con éxito.");
    }
  });

  botAdmin.on("message:text", async (ctx) => {
    const userId = ctx.from.id.toString();
    const text = ctx.message.text;
    if (text.startsWith("/")) return;

    try {
      await ctx.replyWithChatAction("typing");
      const sessionId = `${userId}_admin`;
      const response = await runAgentLoop(sessionId, text, ADMIN_PROMPT);
      if (response.length > 4000) {
        const chunks = response.match(/.{1,4000}/g) || [];
        for (const chunk of chunks) await ctx.reply(chunk);
      } else {
        await ctx.reply(response);
      }

      // Respuesta de Audio en paralelo
      try {
        await ctx.replyWithChatAction("record_voice");
        const audioPath = await generateSpeechFromText(response, "_admin");
        await ctx.replyWithVoice(new InputFile(audioPath));
        if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
      } catch (voiceErr) {
        console.error("Error generando respuesta de voz (Chloe):", voiceErr);
      }
    } catch (error: any) {
      console.error("[Bot Admin Error]:", error);
      await ctx.reply("⚠️ Ha habido un error procesando tus archivos o solicitud administrativa.");
    }
  });

  setupSuperpowers(botAdmin as any, ADMIN_PROMPT, "_admin");

  botAdmin.catch((err) => {
    console.error("🚨 Error global capturado en botAdmin:", err.message || err);
  });
}
