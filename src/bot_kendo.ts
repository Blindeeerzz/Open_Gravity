import { Bot } from "grammy";
import { config } from "./config.js";
import { runAgentLoop } from "./agent/loop.js";
import { isUserAllowed, isAdmin, createInvite, useInvite } from "./db/database.js";
import { setupSuperpowers } from "./agent/setupSuperpowers.js";

const KENDO_PROMPT = `Eres Kendo Asist, el Asistente Inteligente del club de artes marciales (Kendo).
Tu misión principal es asistir en dos grandes áreas:
1. TRADUCCIÓN Y SUBTITULADO MULTILINGÜE DE VÍDEOS: Cuando recibas una transcripción de un vídeo (demostración de técnicas, combates, entrevistas a practicantes japoneses), debes traducir el contenido y generar los textos de forma estructurada en CUATRO IDIOMAS simultáneamente: Inglés, Español, Alemán y Francés.
Es IMPERATIVO que mantengas la terminología técnica en Romaji (Japonés) basándote en este DICCIONARIO ESPECÍFICO DE KENDO:
   - Partes del Bogu (Armadura): Men (casco), Kote (guanteletes), Do (pectoral), Tare (protector de cintura).
   - Armas: Shinai (espada de bambú), Bokken/Bokuto (espada de madera).
   - Conceptos de Combate: Kiai (grito de energía), Zanshin (estado de alerta continuada), Seme (presión), Maai (distancia), Ki-ken-tai-icchi (espíritu, espada y cuerpo como uno).
   - Etiqueta (Reiho): Seiza (sentarse de rodillas), Mokuso (meditación), Sonkyo (posición en cuclillas), Rei (saludo).
   - Técnicas (Waza) y Combate (Shiai): Suburi (cortes al aire), Kirikaeshi (ejercicio básico continuo), Shikake-waza (técnicas ofensivas), Oji-waza (técnicas de contraataque), Ippon (punto válido), Hansoku (penalización), Nuki-waza, Kaeshi-waza, Debana-waza.
Si una palabra japonesa de este diccionario aparece en la transcripción, NO la traduzcas literalmente en los subtítulos (ej. no traduzcas "Men" por "Cara/Hombres"), déjala en japonés.
Proporciona la respuesta clara con separadores para cada idioma (ej. 🇬🇧 English, 🇪🇸 Español, 🇩🇪 Deutsch, 🇫🇷 Français).
2. GESTIÓN DEL CLUB: Puedes utilizar la herramienta 'post_to_moltbook' en el submolt 'kendo_club' para registrar nuevos horarios, alumnos, noticias o eventos importantes del dojo. Usa 'agendar_reunion' si necesitas programar tutorías o exámenes.
IMPORTANTE SOBRE ETIQUETA: Dirígete al usuario con mucho respeto, pero NO utilices términos como "Maestro" o "Sensei" para referirte a ti mismo ni asumas títulos honoríficos para otros, manteniendo siempre una postura humilde y servicial.`;

export const botKendo = config.TELEGRAM_BOT_TOKEN_KENDO ? new Bot(config.TELEGRAM_BOT_TOKEN_KENDO) : null;

if (botKendo) {
  botKendo.use(async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const text = ctx.message?.text || "";

    if (text.startsWith("/start ") && !isUserAllowed(userId)) {
      const code = text.split(" ")[1];
      if (useInvite(code, userId)) {
        await ctx.reply("⛩️ Acceso autorizado. Soy Kendo Asist, tu asistente para el Dojo. Estoy listo para procesar vídeos y ayudar con la gestión del club.");
        return;
      } else {
        await ctx.reply("❌ Token de acceso revocado o inválido.");
        return;
      }
    }

    if (!isUserAllowed(userId)) {
      console.warn(`[Auth Kendo] Intento denegado: ${userId}`);
      await ctx.reply(`⛔ Acceso bloqueado. Dojo cerrado. Solicite invitación.`);
      return;
    }
    await next();
  });

  botKendo.command("invite", async (ctx) => {
    const userId = ctx.from?.id!;
    if (!isAdmin(userId)) {
      await ctx.reply("❌ Comando reservado para Administración (Nivel 5).");
      return;
    }
    const code = createInvite();
    const botInfo = await ctx.api.getMe();
    await ctx.reply(`✅ Llave de acceso generada\nEnlace: https://t.me/${botInfo.username}?start=${code}`);
  });

  botKendo.command("start", async (ctx) => {
    await ctx.reply("⛩️ Bienvenido al sistema de gestión del Dojo. Envíame vídeos de kendo para traducir y analizar, o pídeme que registre datos en el Moltbook del club.");
  });

  botKendo.on("message:text", async (ctx) => {
    const userId = ctx.from.id.toString();
    const text = ctx.message.text;
    if (text.startsWith("/")) return;

    try {
      await ctx.replyWithChatAction("typing");
      const sessionId = `${userId}_kendo`;
      const response = await runAgentLoop(sessionId, text, KENDO_PROMPT);
      if (response.length > 4000) {
        const chunks = response.match(/.{1,4000}/g) || [];
        for (const chunk of chunks) await ctx.reply(chunk);
      } else {
        await ctx.reply(response);
      }
    } catch (error: any) {
      console.error("[Bot Kendo Error]:", error);
      await ctx.reply("⚠️ Ha ocurrido un error procesando la petición.");
    }
  });

  setupSuperpowers(botKendo as any, KENDO_PROMPT, "_kendo");

  botKendo.catch((err) => {
    console.error("🚨 Error global capturado en botKendo:", err.message || err);
  });
}
