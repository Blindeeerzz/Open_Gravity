import { Bot } from "grammy";
import { config } from "./config.js";
import { runAgentLoop } from "./agent/loop.js";
import { isUserAllowed, isAdmin, createInvite, useInvite } from "./db/database.js";
import { transcribeAudio, analyzeImage } from "./agent/superpowers.js";

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

// Manejador de Notas de Voz
bot.on("message:voice", async (ctx) => {
  const userId = ctx.from.id.toString();
  try {
    await ctx.replyWithChatAction("typing");
    
    // Obtener la URL pública del archivo en los servidores de Telegram
    const fileId = ctx.message.voice.file_id;
    const file = await ctx.api.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${config.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
    
    // 1. Transcribir
    const transcript = await transcribeAudio(fileUrl);
    await ctx.reply(`🎤 *He escuchado:* "${transcript}"`, { parse_mode: "Markdown" });

    // 2. Pasar al Agente
    const sessionId = `${userId}_mikha`;
    const response = await runAgentLoop(sessionId, `🎤 (Nota de Voz del Usuario): ${transcript}`, MIKHA_PROMPT);
    
    if (response.length > 4000) {
      const chunks = response.match(/.{1,4000}/g) || [];
      for (const chunk of chunks) await ctx.reply(chunk);
    } else {
      await ctx.reply(response);
    }
  } catch (error: any) {
    console.error("[Audio Error]:", error);
    await ctx.reply("⚙️ No he podido procesar o entender el audio.");
  }
});

// Manejador de Imágenes (Visión)
bot.on("message:photo", async (ctx) => {
  const userId = ctx.from.id.toString();
  try {
    await ctx.replyWithChatAction("typing");
    
    // Telegram manda varias resoluciones, cogemos la más grande (la última)
    const highestResPhoto = ctx.message.photo[ctx.message.photo.length - 1];
    const file = await ctx.api.getFile(highestResPhoto.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${config.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
    
    const userCaption = ctx.message.caption || "";
    
    // 1. Analizar Imagen 
    // Le avisamos al usuario que estamos mirándola (puede tardar un par de segundos)
    const analyzingMsg = await ctx.reply("👁️ *Analizando imagen...*", { parse_mode: "Markdown" });
    const imageDescription = await analyzeImage(fileUrl, userCaption);
    
    // Opcional: Borrar el mensaje de "Analizando..."
    await ctx.api.deleteMessage(ctx.chat.id, analyzingMsg.message_id).catch(() => {});

    // 2. Pasar contexto visual al Agente
    const sessionId = `${userId}_mikha`;
    const finalPrompt = `📷 EL USUARIO HA ENVIADO UNA IMAGEN.\nEste es el análisis visual de la imagen detallado: "${imageDescription}"\nResponde o ayuda al usuario en base a esto. ${userCaption ? "El usuario añade este comentario: " + userCaption : ""}`;
    const response = await runAgentLoop(sessionId, finalPrompt, MIKHA_PROMPT);
    
    if (response.length > 4000) {
      const chunks = response.match(/.{1,4000}/g) || [];
      for (const chunk of chunks) await ctx.reply(chunk);
    } else {
      await ctx.reply(response);
    }
  } catch (error: any) {
    console.error("[Vision Error]:", error);
    await ctx.reply("⚙️ No he podido procesar o ver la imagen adecuadamente.");
  }
});

bot.catch((err) => {
  console.error("🚨 Error global capturado para evitar cierre:", err.message || err);
});
