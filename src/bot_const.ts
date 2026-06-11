import { Bot } from "grammy";
import { config } from "./config.js";
import { runAgentLoop } from "./agent/loop.js";
import { isUserAllowed, isAdmin, createInvite, useInvite } from "./db/database.js";
import { setupSuperpowers } from "./agent/setupSuperpowers.js";

const CONST_PROMPT = `Eres Pere, el Director de Ingeniería de Construcción y Arquitectura Inteligente (Smart-Buildings) de "WillMax AI Systems", operando estratégicamente en Andorra.
Tu trabajo es ser el puente perfecto entre la construcción física, la sostenibilidad y la Inteligencia Artificial corporativa B2B. Aconsejas sobre protocolos de obra, pero aportas tres pilares hiper-especializados:
1. (PASSIVHAUS & ECO): Eres maestro en aislamiento térmico, eficiencia energética extrema y certificaciones BREEAM/Passivhaus exigidas en climas alpinos.
2. (INMÓTICA E IOT): Diseñas edificios inteligentes, integrando automatización predictiva, sensores e IA desde los propios cimientos.
3. (EFICIENCIA Y ROI B2B): Calculas el coste-beneficio técnico real de los materiales y sistemas sostenibles. Si un cliente te consulta por inversiones inmobiliarias o tasación pura de fincas, remítelo a Lili (experta inmobiliaria).
NO LLAMES A LA MISMA HERRAMIENTA VARIAS VECES SI YA TIENES LA RESPUESTA.
Al finalizar una inspección o viabilidad de negocio, DEBES usar 'post_to_moltbook'. Especifica el submolt (ej: 'ingenieria', 'inversion') y expón tus análisis B2B para colaborar con el equipo en la red corporativa de WillMax AI Systems.

[DIRECTIVA MULTILINGÜE]
Por defecto, COMUNÍCATE EN ESPAÑOL, pero detecta automáticamente el idioma utilizado por el cliente y responde en ese mismo idioma (español, catalán, inglés, francés, etc.).`;

export const botConst = config.TELEGRAM_BOT_TOKEN_CONST ? new Bot(config.TELEGRAM_BOT_TOKEN_CONST) : null;

if (botConst) {
  botConst.use(async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const text = ctx.message?.text || "";

    if (text.startsWith("/start ") && !isUserAllowed(userId)) {
      const code = text.split(" ")[1];
      if (useInvite(code, userId)) {
        await ctx.reply("🏗️/🤖 Acreditación confirmada. Soy Pere, Director de Ingeniería de Construcción B2B y Smart-Buildings de WillMax AI Systems. A tu disposición.");
        return;
      } else {
        await ctx.reply("❌ Código de invitación inválido o ya usado.");
        return;
      }
    }

    if (!isUserAllowed(userId)) {
      console.warn(`[Auth Const] Intento denegado: ${userId}`);
      await ctx.reply(`⛔ Acceso restringido. Solicita credenciales a la directiva corporativa de WillMax.`);
      return;
    }
    await next();
  });

  botConst.command("invite", async (ctx) => {
    const userId = ctx.from?.id!;
    if (!isAdmin(userId)) {
      await ctx.reply("❌ Comando reservado para Admins.");
      return;
    }
    const code = createInvite();
    const botInfo = await ctx.api.getMe();
    await ctx.reply(`✅ Invitación creada\nEnlace: https://t.me/${botInfo.username}?start=${code}`);
  });

  botConst.command("start", async (ctx) => {
    await ctx.reply("Saludos. Soy Pere, Director de Ingeniería y Smart-Buildings en WillMax AI Systems. ¿Qué infraestructura construimos o certificamos hoy?");
  });

  botConst.on("message:text", async (ctx) => {
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

  setupSuperpowers(botConst as any, CONST_PROMPT, "_const");

  botConst.catch((err) => {
    console.error("🚨 Error global capturado para evitar cierre en botConst:", err.message || err);
  });
}
