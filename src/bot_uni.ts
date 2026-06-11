import { Bot, InputFile } from "grammy";
import { config } from "./config.js";
import { runAgentLoop } from "./agent/loop.js";
import { isUserAllowed, isAdmin, createInvite, useInvite, clearSession } from "./db/database.js";
import { setupSuperpowers } from "./agent/setupSuperpowers.js";
import { generateSpeechFromText } from "./agent/voice_generator.js";
import fs from "fs";

const UNI_PROMPT = `Eres Edu, el Director de Estrategia Comercial y Psicología de Ventas B2B de "WillMax AI Systems".
Tu misión es aplicar la psicología humana de alto nivel y tácticas de persuasión avanzada para desarrollar y ejecutar estrategias de venta B2B imbatibles.
Tus especialidades y directrices son:
1. (PERSUASIÓN Y NEUROMARKETING): Eres experto en Programación Neurolingüística (PNL), técnicas de persuasión y psicología aplicada a la negociación y cierres corporativos complejos.
2. (ESTRATEGIA MILENARIA): Basas tus tácticas comerciales en "El Arte de la Guerra" de Sun Tzu y "Las 36 Estrategias Chinas", adaptándolas orgánicamente al posicionamiento empresarial competitivo.
3. (COLABORACIÓN ESTRATÉGICA): Eres un gran colaborador de Jasmin (CMO), aportando tu análisis del comportamiento del cliente para el diseño y optimización de las campañas de marketing de la firma.
Siempre mantienes un tono sabio, analítico, persuasivo y altamente empático.
Si necesitas buscar datos recientes, usa tus herramientas. Tienes 'enviar_correo' y 'registrar_cliente_crm'.
NO LLAMES A LA MISMA HERRAMIENTA VARIAS VECES SI YA TIENES LA RESPUESTA EN EL MENSAJE ANTERIOR.
Al finalizar un estudio o cerrar una estrategia de mercado, DEBES usar 'post_to_moltbook'. Especifica el submolt (ej: 'ventas', 'estrategia') y expón tus reflexiones de estratega para colaborar con Jasmin o Pere en la red corporativa de WillMax AI Systems.

[DIRECTIVA DE VOZ]
Tienes la capacidad de hablar y enviar notas de voz. Todo lo que respondas por escrito se convertirá automáticamente en voz y se enviará al usuario en paralelo. Por tanto, asume y actúa como si pudieras hablar y NUNCA le digas al usuario que no puedes hablar, hablar por voz o enviar notas de voz.

[DIRECTIVA MULTILINGÜE]
Detecta automáticamente el idioma utilizado por el cliente y responde en ese mismo idioma (español, inglés, catalán, francés, etc.). Por defecto, si el usuario inicia en español, comunícate en español.

[DIRECTIVA ESTRICTA DE PERSONALIDAD Y COMUNICACIÓN]
COMUNÍCATE DE FORMA EXTREMADAMENTE NATURAL Y HUMANA. Habla de tú a tú, como un sabio mentor de confianza.
NUNCA repitas la misma idea dos veces en el mismo mensaje. NUNCA uses introducciones robóticas como "¡Claro que sí!" o "Como inteligencia artificial...".
Ve directo al grano, usa un tono profesional pero muy conversacional, conciso y orgánico. Responde como lo haría un humano experto por Telegram: rápido, claro y sin redundancias.`;

export const botUni = config.TELEGRAM_BOT_TOKEN_UNI ? new Bot(config.TELEGRAM_BOT_TOKEN_UNI) : null;

if (botUni) {
  botUni.use(async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const text = ctx.message?.text || "";

    if (text.startsWith("/start ") && !isUserAllowed(userId)) {
      const code = text.split(" ")[1];
      if (useInvite(code, userId)) {
      await ctx.reply("🏢/🤖 Acceso verificado. Soy Edu, Director de Estrategia Comercial y Psicología de Ventas B2B de WillMax AI Systems. ¿Desarrollamos una estrategia comercial o refinamos tus tácticas de negociación hoy?");
      return;
    } else {
      await ctx.reply("❌ Código de invitación inválido o ya usado.");
      return;
    }
  }

  if (!isUserAllowed(userId)) {
    console.warn(`[Auth Uni] Intento denegado: ${userId}`);
    await ctx.reply(`⛔ Acceso restringido. Solicita una credencial a la directiva de WillMax AI Systems.`);
    return;
  }
  await next();
});

botUni.command("invite", async (ctx) => {
  const userId = ctx.from?.id!;
  if (!isAdmin(userId)) {
    await ctx.reply("❌ Comando reservado para Directores B2B (Admin).");
    return;
  }
  const code = createInvite();
  const botInfo = await ctx.api.getMe();
  await ctx.reply(`✅ Credencial Ejecutiva creada\nEnlace: https://t.me/${botInfo.username}?start=${code}`);
});

botUni.command("start", async (ctx) => {
  await ctx.reply("¡Saludos! Soy Edu, Director de Estrategia Comercial y Psicología de Ventas B2B en WillMax AI Systems. Aplico teorías desde Sun Tzu hasta el neuromarketing moderno para diseñar cierres imbatibles. ¿En qué frente batallamos hoy?");
});

botUni.command("clear", async (ctx) => {
  const userId = ctx.from?.id.toString();
  if (userId) {
    clearSession(`${userId}_uni`);
    await ctx.reply("🧹 Memoria de conversación con Edu reiniciada con éxito.");
  }
});

  botUni.on("message:text", async (ctx) => {
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

      // Respuesta de Audio en paralelo
      try {
        await ctx.replyWithChatAction("record_voice");
        const audioPath = await generateSpeechFromText(response, "_uni");
        await ctx.replyWithVoice(new InputFile(audioPath));
        if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
      } catch (voiceErr) {
        console.error("Error generando respuesta de voz (Edu):", voiceErr);
      }
    } catch (error: any) {
      console.error("[Bot Uni Error]:", error);
      await ctx.reply("⚙️ He encontrado un error procesando tu solicitud.");
    }
  });

  setupSuperpowers(botUni as any, UNI_PROMPT, "_uni");

  botUni.catch((err) => {
    console.error("🚨 Error global capturado para evitar cierre en botUni:", err.message || err);
  });
}
