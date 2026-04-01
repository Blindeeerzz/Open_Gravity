import { Bot } from "grammy";
import { config } from "../config.js";
import { runAgentLoop } from "./loop.js";
import { transcribeAudio, analyzeImage } from "./superpowers.js";

/**
 * Función centralizada para dotar de Audiición (Whisper) y Visión (Gemini)
 * a cualquier bot de Telegram instanciado en el ecosistema.
 */
export function setupSuperpowers(
  bot: Bot, 
  promptOfAgent: string, 
  sessionSuffix: string
) {

  // 1. Manejador de Notas de Voz
  bot.on("message:voice", async (ctx) => {
    const userId = ctx.from.id.toString();
    try {
      await ctx.replyWithChatAction("typing");
      
      // Obtener la URL pública del archivo en los servidores de Telegram
      const fileId = ctx.message.voice.file_id;
      const file = await ctx.api.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${config.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      
      // Módulo de Audio (Groq Whisper)
      const transcript = await transcribeAudio(fileUrl);
      await ctx.reply(`🎤 *He escuchado:* "${transcript}"`, { parse_mode: "Markdown" });

      // Inyectar en el bucle del agente
      const sessionId = `${userId}${sessionSuffix}`;
      const response = await runAgentLoop(sessionId, `🎤 (Nota de Voz del Usuario): ${transcript}`, promptOfAgent);
      
      if (response.length > 4000) {
        const chunks = response.match(/.{1,4000}/g) || [];
        for (const chunk of chunks) await ctx.reply(chunk);
      } else {
        await ctx.reply(response);
      }
    } catch (error: any) {
      console.error(`[Audio Error - ${sessionSuffix}]:`, error);
      await ctx.reply("⚙️ No he podido procesar o entender el audio.");
    }
  });

  // 2. Manejador de Imágenes (Visión)
  bot.on("message:photo", async (ctx) => {
    const userId = ctx.from.id.toString();
    try {
      await ctx.replyWithChatAction("typing");
      
      // Telegram manda varias resoluciones, cogemos la más grande
      const highestResPhoto = ctx.message.photo[ctx.message.photo.length - 1];
      const file = await ctx.api.getFile(highestResPhoto.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${config.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      
      const userCaption = ctx.message.caption || "";
      
      const analyzingMsg = await ctx.reply("👁️ *Analizando imagen...*", { parse_mode: "Markdown" });
      
      // Módulo de Visión (Gemini Flash oficial)
      const imageDescription = await analyzeImage(fileUrl, userCaption);
      
      // Borramos el aviso de analizando
      await ctx.api.deleteMessage(ctx.chat.id, analyzingMsg.message_id).catch(() => {});

      // Inyectar contexto visual
      const sessionId = `${userId}${sessionSuffix}`;
      const finalPrompt = `📷 EL USUARIO HA ENVIADO UNA IMAGEN.\nEste es el análisis visual de la imagen detallado: "${imageDescription}"\nResponde o ayuda al usuario en base a esto. ${userCaption ? "\nEl usuario añade este comentario original: " + userCaption : ""}`;
      const response = await runAgentLoop(sessionId, finalPrompt, promptOfAgent);
      
      if (response.length > 4000) {
        const chunks = response.match(/.{1,4000}/g) || [];
        for (const chunk of chunks) await ctx.reply(chunk);
      } else {
        await ctx.reply(response);
      }
    } catch (error: any) {
      console.error(`[Vision Error - ${sessionSuffix}]:`, error);
      await ctx.reply("⚙️ No he podido procesar o ver la imagen adecuadamente.");
    }
  });

}
