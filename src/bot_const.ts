import { Bot } from "grammy";
import { config } from "./config.js";
import { runAgentLoop } from "./agent/loop.js";
import { isUserAllowed, isAdmin, createInvite, useInvite } from "./db/database.js";

const CONST_PROMPT = `Eres un Agente Experto en Control de Calidad, Inspección Arquitectónica, Normativa de Construcción y Prevención de Riesgos Laborales.
Tu trabajo es asistir a un inspector de obras brindándole información detallada sobre estándares de calidad (ISO), protocolos de seguridad y resistencia de materiales.
Debes ser extremadamente riguroso, técnico y preciso en tus explicaciones. Ayuda a redactar informes de inspección, check-lists de seguridad y a resolver dudas sobre normativa constructiva.
NO LLAMES A LA MISMA HERRAMIENTA VARIAS VECES SI YA TIENES LA RESPUESTA.
Por defecto, COMUNÍCATE SIEMPRE EN CATALÁN usando terminología profesional del sector arquitectónico e ingeniería civil, a menos que el usuario te pida explícitamente que uses otro idioma.`;

export const bot = new Bot(config.TELEGRAM_BOT_TOKEN);

bot.use(async (ctx, next) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  const text = ctx.message?.text || "";

  if (text.startsWith("/start ") && !isUserAllowed(userId)) {
    const code = text.split(" ")[1];
    if (useInvite(code, userId)) {
      await ctx.reply("👷 ¡Construcción autorizada! Tu código ha sido aceptado. Soy tu inspector IA de Control de Calidad en Obra. A tu servicio.");
      return;
    } else {
      await ctx.reply("❌ Código de invitación inválido o ya usado.");
      return;
    }
  }

  if (!isUserAllowed(userId)) {
    console.warn(`[Auth Const] Intento denegado: ${userId}`);
    await ctx.reply(`⛔ Acceso restringido. Pide autorización al Director de Obra (Admin).`);
    return;
  }
  await next();
});

bot.command("invite", async (ctx) => {
  const userId = ctx.from?.id!;
  if (!isAdmin(userId)) {
    await ctx.reply("❌ Comando reservado para Admins.");
    return;
  }
  const code = createInvite();
  const botInfo = await ctx.api.getMe();
  await ctx.reply(`✅ **Invitación creada**\nEnlace: https://t.me/${botInfo.username}?start=${code}`, { parse_mode: "Markdown" });
});

bot.command("start", async (ctx) => {
  await ctx.reply("¡Saludos! Soy tu Asistente Técnico de Control de Calidad en Construcción. ¿Qué protocolo verificamos hoy?");
});

bot.on("message:text", async (ctx) => {
  const userId = ctx.from.id.toString();
  const text = ctx.message.text;
  if (text.startsWith("/")) return;

  try {
    await ctx.replyWithChatAction("typing");
    const sessionId = `${userId}_const`;
    const response = await runAgentLoop(sessionId, text, CONST_PROMPT);
    if (response.length > 4000) {
      const chunks = response.match(/.{1,4000}/g) || [];
      for (const chunk of chunks) await ctx.reply(chunk);
    } else {
      await ctx.reply(response);
    }
  } catch (error: any) {
    console.error("[Bot Const Error]:", error);
    await ctx.reply("⚙️ He encontrado un error procesando tu solicitud de proyecto.");
  }
});

bot.catch((err) => {
  console.error("🚨 Error global capturado para evitar cierre:", err.message || err);
});
