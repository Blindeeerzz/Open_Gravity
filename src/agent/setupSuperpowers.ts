import { Bot, InputFile } from "grammy";
import fs from "fs";
import { exec } from "child_process";
import util from "util";
import path from "path";

const execPromise = util.promisify(exec);
import { config } from "../config.js";
import { runAgentLoop } from "./loop.js";
import { transcribeMedia, analyzeImage, readPdf } from "./superpowers.js";
import { generateSpeechFromText } from "./voice_generator.js";

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
      const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
      
      // Módulo de Audio (Groq Whisper)
      const transcript = await transcribeMedia(fileUrl, "audio.ogg");
      await ctx.reply(`🎤 *He escuchado:* "${transcript}"`, { parse_mode: "Markdown" });

      // Inyectar en el bucle del agente
      const sessionId = `${userId}${sessionSuffix}`;
      const response = await runAgentLoop(sessionId, `🎤 (Nota de Voz del Usuario): ${transcript}`, promptOfAgent);
      
      try {
        // Enviar aviso de que está "grabando nota de voz"
        await ctx.replyWithChatAction("record_voice");
        
        // Generar el audio
        const audioPath = await generateSpeechFromText(response);
        
        // Enviar el Audio (Voz) a Telegram
        await ctx.replyWithVoice(new InputFile(audioPath));
        
        // Borrar el archivo local para no llenar el servidor
        if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
        
      } catch (voiceErr: any) {
        console.error("Error generando respuesta de voz:", voiceErr);
        await ctx.reply(`⚠️ Fallo de Síntesis de Voz: ${voiceErr.message || voiceErr}`);
      }

      // Además, como respaldo y cortesía, imprimimos el texto largo
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

  // 1.5 Manejador de Vídeos
  bot.on("message:video", async (ctx) => {
    const userId = ctx.from.id.toString();
    try {
      await ctx.replyWithChatAction("typing");
      
      const fileId = ctx.message.video.file_id;
      const file = await ctx.api.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
      
      const userCaption = ctx.message.caption || "";
      const processingMsg = await ctx.reply("🎞️ *Extrayendo y transcribiendo audio del vídeo...*", { parse_mode: "Markdown" });

      // Pasar a Groq Whisper pasándole extensión mp4
      const transcript = await transcribeMedia(fileUrl, "video.mp4");
      
      await ctx.api.deleteMessage(ctx.chat.id, processingMsg.message_id).catch(() => {});

      // Inyectar en el bucle del agente
      const sessionId = `${userId}${sessionSuffix}`;
      const finalPrompt = `🎞️ EL USUARIO HA ENVIADO UN VÍDEO.\n\nA continuación, la transcripción del audio:\n"""\n${transcript}\n"""\nResponde o ayuda al usuario en base a esto. ${userCaption ? "\nEl usuario añade este comentario original: " + userCaption : "\nAnaliza/traduce esta transcripción de vídeo."}`;
      
      const response = await runAgentLoop(sessionId, finalPrompt, promptOfAgent);
      
      if (response.length > 4000) {
        const chunks = response.match(/.{1,4000}/g) || [];
        for (const chunk of chunks) await ctx.reply(chunk);
      } else {
        await ctx.reply(response);
      }
    } catch (error: any) {
      console.error(`[Video Error - ${sessionSuffix}]:`, error);
      await ctx.reply("⚙️ No he podido descargar o transcribir el vídeo. Comprueba que no supera los 20MB permitidos por Telegram.");
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
      const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
      
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

  // 3. Manejador de Archivos (PDFs y PCAPs)
  bot.on("message:document", async (ctx) => {
    const userId = ctx.from.id.toString();
    try {
      const doc = ctx.message.document;
      const fileName = doc.file_name?.toLowerCase() || "";
      
      const isPdf = doc.mime_type === "application/pdf" || fileName.endsWith(".pdf");
      const isPcap = fileName.endsWith(".pcap") || fileName.endsWith(".pcapng");

      if (!isPdf && !isPcap) {
        await ctx.reply("⚠️ Solo puedo analizar documentos PDF o archivos de captura de red (.pcap / .pcapng).");
        return;
      }
      
      await ctx.replyWithChatAction("typing");
      const file = await ctx.api.getFile(doc.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
      const userCaption = ctx.message.caption || "";

      let extractedText = "";
      let documentType = isPdf ? "DOCUMENTO PDF" : "CAPTURA DE RED (PCAP)";

      if (isPdf) {
        const readingMsg = await ctx.reply("📑 *Leyendo documento PDF...*", { parse_mode: "Markdown" });
        extractedText = await readPdf(fileUrl);
        await ctx.api.deleteMessage(ctx.chat.id, readingMsg.message_id).catch(() => {});
      } else if (isPcap) {
        const readingMsg = await ctx.reply("🦈 *Analizando tráfico de red con TShark...*", { parse_mode: "Markdown" });
        
        // Descargar el archivo pcap localmente
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const tempPcapPath = path.resolve(`./temp_${Date.now()}.pcap`);
        fs.writeFileSync(tempPcapPath, buffer);

        try {
          // Extraer los primeros 150 paquetes de forma legible
          const { stdout, stderr } = await execPromise(`tshark -r ${tempPcapPath} -c 150`, { timeout: 15000 });
          if (stdout) {
            extractedText = stdout;
          } else {
            extractedText = "Error o captura vacía: " + stderr;
          }
        } catch (execErr: any) {
          console.error("Tshark error:", execErr);
          extractedText = "Error al ejecutar tshark. Asegúrate de que Wireshark/tshark esté instalado en el servidor y en el PATH. Detalles: " + execErr.message;
        } finally {
          if (fs.existsSync(tempPcapPath)) fs.unlinkSync(tempPcapPath);
          await ctx.api.deleteMessage(ctx.chat.id, readingMsg.message_id).catch(() => {});
        }
      }

      // Inyectar contexto textual
      const sessionId = `${userId}${sessionSuffix}`;
      const finalPrompt = `📄 EL USUARIO HA ENVIADO UN ${documentType}.\n\nA continuación, el contenido extraído:\n"""\n${extractedText}\n"""\nResponde o ayuda al usuario en base a esto. ${userCaption ? "\nEl usuario añade este comentario original: " + userCaption : "\nAnaliza este contenido y responde a lo que el usuario necesite."}`;
      const response = await runAgentLoop(sessionId, finalPrompt, promptOfAgent);
      
      if (response.length > 4000) {
        const chunks = response.match(/.{1,4000}/g) || [];
        for (const chunk of chunks) await ctx.reply(chunk);
      } else {
        await ctx.reply(response);
      }
    } catch (error: any) {
      console.error(`[Document Error - ${sessionSuffix}]:`, error);
      await ctx.reply("⚙️ Ocurrió un fallo al intentar leer el archivo. Asegúrate de que no esté corrupto.");
    }
  });

}
