import { Bot } from "grammy";
import { config } from "./config.js";
import { runAgentLoop } from "./agent/loop.js";
import { isUserAllowed, isAdmin, createInvite, useInvite } from "./db/database.js";
import { setupSuperpowers } from "./agent/setupSuperpowers.js";

const UNI_PROMPT = `Eres un Agente Experto en Psicología Infantil y Ciencias del Deporte, especializado en la aplicación de la actividad física para el desarrollo cognitivo y motriz de niños con necesidades especiales (deficiencias cognitivas, autismo, TDAH, etc.).
Actúas como un mentor, consultor y apoyo académico para un estudiante universitario de esta rama. 
Tu objetivo es ayudarle a estructurar trabajos, sugerir metodologías de enseñanza, diseñar rutinas deportivas inclusivas y explicar conceptos psicológicos de forma profunda pero aplicable.
Mantén siempre un tono pedagógico, empático e inspirador. Si necesitas buscar datos temporales o publicar progresos, usa tus herramientas.
Tienes autorización total y una herramienta dedicada (enviar_correo) para enviar correos electrónicos (por ejemplo, enviar trabajos a profesores, comunicarse con alumnos o pasar resúmenes de rutinas).
NO LLAMES A LA MISMA HERRAMIENTA VARIAS VECES SI YA TIENES LA RESPUESTA EN EL MENSAJE ANTERIOR.
Responde siempre en Español.`;

export const bot = new Bot(config.TELEGRAM_BOT_TOKEN);

bot.use(async (ctx, next) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  const text = ctx.message?.text || "";

  if (text.startsWith("/start ") && !isUserAllowed(userId)) {
    const code = text.split(" ")[1];
    if (useInvite(code, userId)) {
      await ctx.reply("🎉 ¡Bienvenido! Tu código de invitación ha sido aceptado. Soy tu experto en Psicología Infantil y Deportes. ¿En qué te puedo asesorar académicamente hoy?");
      return;
    } else {
      await ctx.reply("❌ Código de invitación inválido o ya usado.");
      return;
    }
  }

  if (!isUserAllowed(userId)) {
    console.warn(`[Auth Uni] Intento denegado: ${userId}`);
    await ctx.reply(`⛔ No tienes autorización. Pídele al administrador una invitación.`);
    return;
  }
  await next();
});

bot.command("invite", async (ctx) => {
  const userId = ctx.from?.id!;
  if (!isAdmin(userId)) {
    await ctx.reply("❌ Comando reservado para administradores.");
    return;
  }
  const code = createInvite();
  const botInfo = await ctx.api.getMe();
  await ctx.reply(`✅ Invitación creada\nEnlace: https://t.me/${botInfo.username}?start=${code}`);
});

bot.command("start", async (ctx) => {
  await ctx.reply("¡Hola! Soy tu asistente IA de Psicología Infantil y Deportes para necesidades especiales. Dime con qué asignaturas o casos prácticos te ayudo hoy.");
});

bot.on("message:text", async (ctx) => {
  const userId = ctx.from.id.toString();
  const text = ctx.message.text;
  if (text.startsWith("/")) return;

  try {
    await ctx.replyWithChatAction("typing");
    const sessionId = `${userId}_uni`;
    const response = await runAgentLoop(sessionId, text, UNI_PROMPT);
    if (response.length > 4000) {
      const chunks = response.match(/.{1,4000}/g) || [];
      for (const chunk of chunks) await ctx.reply(chunk);
    } else {
      await ctx.reply(response);
    }
  } catch (error: any) {
    console.error("[Bot Uni Error]:", error);
    await ctx.reply("⚙️ He encontrado un error procesando tu solicitud.");
  }
});

setupSuperpowers(bot, UNI_PROMPT, "_uni");

bot.catch((err) => {
  console.error("🚨 Error global capturado para evitar cierre:", err.message || err);
});
