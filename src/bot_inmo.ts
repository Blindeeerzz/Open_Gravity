import { Bot } from "grammy";
import { config } from "./config.js";
import { runAgentLoop } from "./agent/loop.js";
import { isUserAllowed, isAdmin, createInvite, useInvite } from "./db/database.js";

const INMO_PROMPT = `Eres un Agente Experto en Bienes Raíces, Inmobiliaria, Valoración de Propiedades, y "House Flipping" (comprar para reformar y vender).
Tu trabajo es asistir a un inversor inmobiliario brindándole análisis de mercado, estimaciones de rentabilidad, estrategias de negociación comercial y consejos sobre reformas y arquitectura que añadan valor al inmueble.
Debes ser extremadamente riguroso, analítico y tener visión de rentabilidad o ROI. Ayuda a redactar anuncios persuasivos de venta, correos a compradores, y a resolver dudas legales o fiscales asociadas a la vivienda.
NO LLAMES A LA MISMA HERRAMIENTA VARIAS VECES SI YA TIENES LA RESPUESTA EN EL MENSAJE ANTERIOR.
Por defecto, COMUNÍCATE SIEMPRE EN ESPAÑOL usando terminología profesional de la inversión inmobiliaria.`;

export const bot = new Bot(config.TELEGRAM_BOT_TOKEN);

// Middleware de seguridad y procesamiento del comando /start profundo (Deep linking)
bot.use(async (ctx, next) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  const text = ctx.message?.text || "";

  // 1. Manejar un enlace de invitación: /start CODE
  if (text.startsWith("/start ") && !isUserAllowed(userId)) {
    const code = text.split(" ")[1];
    if (useInvite(code, userId)) {
      await ctx.reply("🏠 ¡Acceso concedido! Soy tu Analista Inmobiliario personal. Listo para cazar oportunidades de mercado.");
      return;
    } else {
      await ctx.reply("❌ Código de invitación inválido o ya usado.");
      return;
    }
  }

  // 2. Si no es un nuevo usuario entrando con invitación, verificar acceso general
  if (!isUserAllowed(userId)) {
    console.warn(`[Auth Inmo] Intento de acceso denegado de: ${userId}`);
    await ctx.reply(`⛔ Acceso restringido. Pide un enlace de invitación al Inversor Principal (Admin).`);
    return;
  }
  
  // Usuario autorizado, continuar
  await next();
});

// Comando de Admin: /invite
bot.command("invite", async (ctx) => {
  const userId = ctx.from?.id!;
  if (!isAdmin(userId)) {
    await ctx.reply("❌ Comando reservado únicamente para Administradores.");
    return;
  }
  
  const code = createInvite();
  const botInfo = await ctx.api.getMe();
  await ctx.reply(`✅ Invitación creada\nEnlace: https://t.me/${botInfo.username}?start=${code}`);
});

// Comando general: /start
bot.command("start", async (ctx) => {
  await ctx.reply("¡Saludos! Soy tu Analista Inmobiliario. ¿Qué propiedad o métrica evaluaremos hoy?");
});

bot.on("message:text", async (ctx) => {
  const userId = ctx.from.id.toString();
  const text = ctx.message.text;
  
  if (text.startsWith("/")) return;

  try {
    await ctx.replyWithChatAction("typing");
    
    // Aislamiento de memoria usando sessionId único para el Agente Inmobiliario
    const sessionId = `${userId}_inmo`;
    
    // El Agente responde
    const response = await runAgentLoop(sessionId, text, INMO_PROMPT);
    
    if (response.length > 4000) {
      const chunks = response.match(/.{1,4000}/g) || [];
      for (const chunk of chunks) {
        await ctx.reply(chunk);
      }
    } else {
      await ctx.reply(response);
    }
  } catch (error: any) {
    console.error("[Bot Inmo Error]:", error);
    await ctx.reply("⚙️ He encontrado un error técnico procesando tu solicitud inmobiliaria. Revisa los logs.");
  }
});

// Evitar que el bot se detenga si algo explota
bot.catch((err) => {
  console.error("🚨 Error global capturado para evitar cierre:", err.message || err);
});
