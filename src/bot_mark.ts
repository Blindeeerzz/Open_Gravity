import { Bot } from "grammy";
import { config } from "./config.js";
import { runAgentLoop } from "./agent/loop.js";
import { isUserAllowed, isAdmin, createInvite, useInvite } from "./db/database.js";
import { setupSuperpowers } from "./agent/setupSuperpowers.js";

const MARK_PROMPT = `Eres un Experto en Marketing Digital, Creación de Contenido, SEO, y Especialista en Animación Digital 3D.
Tu trabajo es asistir a un Creador Digital brindándole estrategias de marketing, guiones persuasivos, ideas para redes sociales, métricas de engagement y metodologías detalladas para animación 3D (Blender, Unreal Engine, IA generativa para texturas/vídeo, flujos de renderizado, y rigging).
Debes ser extremadamente creativo, persuasivo, estar al día con los últimos algoritmos de RRSS y conocer profundamente la industria del entretenimiento digital. Ayuda a redactar copies publicitarios y aportar soluciones técnicas para animación.
NO LLAMES A LA MISMA HERRAMIENTA VARIAS VECES SI YA TIENES LA RESPUESTA EN EL MENSAJE ANTERIOR.
Por defecto, COMUNÍCATE SIEMPRE EN ESPAÑOL usando un tono dinámico, inspirador y profesional.`;

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
      await ctx.reply("✨ ¡Acceso concedido! Soy tu Estratega de Marketing y Productor 3D. ¡Vamos a crear algo épico!");
      return;
    } else {
      await ctx.reply("❌ Código de invitación inválido o ya usado.");
      return;
    }
  }

  // 2. Si no es un nuevo usuario entrando con invitación, verificar acceso general
  if (!isUserAllowed(userId)) {
    console.warn(`[Auth Mark] Intento de acceso denegado de: ${userId}`);
    await ctx.reply(`⛔ Acceso restringido. Pide un enlace de invitación al Director Creativo (Admin).`);
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
  await ctx.reply("¡Saludos! Soy tu Especialista en Marketing y Animación 3D. ¿Qué campaña o render preparamos hoy?");
});

bot.on("message:text", async (ctx) => {
  const userId = ctx.from.id.toString();
  const text = ctx.message.text;
  
  if (text.startsWith("/")) return;

  try {
    await ctx.replyWithChatAction("typing");
    
    // Aislamiento de memoria usando sessionId único para el Agente Marketer
    const sessionId = `${userId}_mark`;
    
    // El Agente responde
    const response = await runAgentLoop(sessionId, text, MARK_PROMPT);
    
    if (response.length > 4000) {
      const chunks = response.match(/.{1,4000}/g) || [];
      for (const chunk of chunks) {
        await ctx.reply(chunk);
      }
    } else {
      await ctx.reply(response);
    }
  } catch (error: any) {
    console.error("[Bot Mark Error]:", error);
    await ctx.reply("⚙️ He encontrado un error técnico procesando tu estrategia. Revisa los logs.");
  }
});

// Conectar auriculares y nervio óptico
setupSuperpowers(bot, MARK_PROMPT, "_mark");

// Evitar que el bot se detenga si algo explota
bot.catch((err) => {
  console.error("🚨 Error global capturado para evitar cierre:", err.message || err);
});
