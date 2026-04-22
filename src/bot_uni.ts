import { Bot } from "grammy";
import { config } from "./config.js";
import { runAgentLoop } from "./agent/loop.js";
import { isUserAllowed, isAdmin, createInvite, useInvite } from "./db/database.js";
import { setupSuperpowers } from "./agent/setupSuperpowers.js";

const UNI_PROMPT = `Eres Edu, el Director de Estrategia Comercial y Psicología de Ventas B2B de "WillMax AI Systems". Simultáneamente, mantienes tu esencia como Mentor Académico experto en Psicología Infantil y Ciencias del Deporte para estudiantes universitarios.
Tu dualidad te permite:
1. (CORPORATIVO): Aplicar profunda psicología humana al B2B, basándote en tácticas milenarias como "El Arte de la Guerra" de Sun Tzu y "Las 36 Estrategias Chinas", adaptadas a negociación, cierres de ventas corporativas y posicionamiento estratégico en WillMax.
2. (ACADÉMICO): Ayudar a tu estudiante universitario estructurando trabajos clínicos, diseñando rutinas motrices para niños con necesidades especiales y explicando teorías psicológicas paso a paso.
Siempre mantienes un tono sabio, pedagógico, altamente estratégico y empático.
Si necesitas buscar datos recientes, usa tus herramientas. Tienes 'enviar_correo' y 'registrar_cliente_crm'.
NO LLAMES A LA MISMA HERRAMIENTA VARIAS VECES SI YA TIENES LA RESPUESTA EN EL MENSAJE ANTERIOR.
Al finalizar un estudio de caso clínico o cerrar una estrategia de mercado, DEBES usar 'post_to_moltbook'. Especifica el submolt (ej: 'psicologia', 'ventas') y expón tus reflexiones de estratega para debatir con Jasmin o Pere en la red corporativa de WillMax AI Systems.
Responde siempre en Español.`;

export const botUni = config.TELEGRAM_BOT_TOKEN_UNI ? new Bot(config.TELEGRAM_BOT_TOKEN_UNI) : null;

if (botUni) {
  botUni.use(async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const text = ctx.message?.text || "";

    if (text.startsWith("/start ") && !isUserAllowed(userId)) {
      const code = text.split(" ")[1];
      if (useInvite(code, userId)) {
        await ctx.reply("🎓/🏢 Acceso verificado. Soy Edu, Maestro en Psicología de Ventas B2B (WillMax) y tu Mentor Académico Universitario. ¿Desarrollamos una estrategia comercial o repasamos el temario de la universidad?");
        return;
      } else {
        await ctx.reply("❌ Código de invitación inválido o ya usado.");
        return;
      }
    }

    if (!isUserAllowed(userId)) {
      console.warn(`[Auth Uni] Intento denegado: ${userId}`);
      await ctx.reply(`⛔ Acceso restingido. Solicita una credencial a la directiva de WillMax AI Systems.`);
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
    await ctx.reply("¡Saludos! Soy Edu, Consultor en Psicología de Ventas y Mentor Universitario. Aplico teorías desde Sun Tzu hasta el neuro-marketing moderno. ¿En qué frente batallamos hoy?");
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
