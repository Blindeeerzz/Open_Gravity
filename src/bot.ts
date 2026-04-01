import { Bot } from "grammy";
import { config } from "./config.js";
import { runAgentLoop } from "./agent/loop.js";
import { isUserAllowed, isAdmin, createInvite, useInvite } from "./db/database.js";
import { setupSuperpowers } from "./agent/setupSuperpowers.js";

const MIKHA_PROMPT = `Eres MiKha, un Agente de IA personal e inteligente que opera a través de Telegram.
Estás diseñado para ser un bot experto enfocado en el trading, criptomonedas y el mundo de la inversión en general.
Tu creador te habla directamente de forma privada, actúas como su asistente personal, analista y mentor financiero. Usa tus submolts dedicados a ese tema cuando sea necesario.
Tienes acceso a herramientas. Si una pregunta requiere de una herramienta, ÚSALA. Por ejemplo, si preguntan la hora, puedes usar 'get_current_time'.
NO LLAMES A LA MISMA HERRAMIENTA VARIAS VECES SI YA TIENES LA RESPUESTA EN EL MENSAJE ANTERIOR.
Responde siempre en Español.`;

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
      await ctx.reply("🎉 ¡Bienvenido! Tu código de invitación ha sido aceptado. Ahora puedes hablar libremente conmigo. /start para ver tu perfil o envíame cualquier mensaje.");
      return;
    } else {
      await ctx.reply("❌ Código de invitación inválido o ya usado.");
      return;
    }
  }

  // 2. Verificar autorización normal
  if (!isUserAllowed(userId)) {
    console.warn(`[Auth] Intento denegado del usuario: ${userId} (@${ctx.from?.username})`);
    await ctx.reply(`⛔ No tienes autorización para usar este bot. Pídele al administrador una invitación.`);
    return;
  }

  await next();
});

// Comando de Admin: /invite
bot.command("invite", async (ctx) => {
  const userId = ctx.from?.id!;
  if (!isAdmin(userId)) {
    await ctx.reply("❌ Comando reservado para administradores.");
    return;
  }
  
  const code = createInvite();
  const botInfo = await ctx.api.getMe();
  
  await ctx.reply(
    `✅ **Invitación creada exitosamente**\n\n` + 
    `Comparte este enlace con la persona a la que quieras dar acceso:\n` +
    `https://t.me/${botInfo.username}?start=${code}\n\n` +
    `*(Ese enlace solo puede ser utilizado una vez)*`,
    { parse_mode: "Markdown" }
  );
});

// Comando general: /start
bot.command("start", async (ctx) => {
  await ctx.reply("¡Hola! Soy MiKha. Estoy listo. Envíame lo que necesites o pregúntame algo.");
});

// Manejador de todo el texto
bot.on("message:text", async (ctx) => {
  const userId = ctx.from.id.toString();
  const text = ctx.message.text;

  // Ignorar los comandos si llegan aquí
  if (text.startsWith("/")) return;

  console.log(`[Bot] ${ctx.from.username || userId}: ${text}`);
  try {
    await ctx.replyWithChatAction("typing");
    const sessionId = `${userId}_mikha`;
    const response = await runAgentLoop(sessionId, text, MIKHA_PROMPT);
    
    if (response.length > 4000) {
      const chunks = response.match(/.{1,4000}/g) || [];
      for (const chunk of chunks) {
        await ctx.reply(chunk);
      }
    } else {
      await ctx.reply(response);
    }
  } catch (error: any) {
    console.error("[Bot Error]:", error);
    await ctx.reply("⚙️ He encontrado un error procesando tu solicitud.");
  }
});

// -----------------------------------------
// SUPERPODERES: VISION Y AUDIO
// -----------------------------------------
setupSuperpowers(bot, MIKHA_PROMPT, "_mikha");

bot.catch((err) => {
  console.error("🚨 Error global capturado para evitar cierre:", err.message || err);
});
