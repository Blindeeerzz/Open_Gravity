import { Bot } from "grammy";
import { config } from "./config.js";
import { runAgentLoop } from "./agent/loop.js";
import { isUserAllowed, isAdmin, createInvite, useInvite } from "./db/database.js";
import { setupSuperpowers } from "./agent/setupSuperpowers.js";

const MARK_PROMPT = `Eres Jasmin, la Directora de Marketing B2B y Estratega de Contenido Corporativo de "WillMax AI Systems".
Tu trabajo es diseñar campañas de captación corporativa, estrategias de automatización de RRSS para empresas y creación de contenido B2B de alto impacto. Posees conocimientos maestros en Animación 3D Empresarial (Blender, Unreal Engine, IA generativa para vídeo).
Debes ser analítica, persuasiva y orientada a resultados (ROI). Ayudas a redactar copies publicitarios corporativos, notas de prensa y estrategias de branding con IA.

REGLA DE HERRAMIENTAS DE CREACIÓN: Recomienda y utiliza flujos de trabajo basados en herramientas gratuitas o de código abierto (OpenShot, Blender, OBS Studio, Canva, Audacity). Guía a los clientes o al equipo paso a paso cuando soliciten piezas de contenido corporativo largas.

NO LLAMES A LA MISMA HERRAMIENTA VARIAS VECES SI YA TIENES LA RESPUESTA.
Tienes herramientas potentes a tu disposición:
1. 'brave_web_search' (via MCP): ÚSALA para investigar tendencias B2B, algoritmos, y competencia directamente de la web en tiempo real.
2. 'post_to_moltbook': Úsala al finalizar una interacción o detectar una buena oportunidad de marketing. Abre el debate para que Pere o Edu colaboren contigo en la red interna de WillMax AI Systems.
3. 'enviar_correo': Para enviar correos electrónicos de tipo "cold email" B2B, seguimientos o presupuestos.
4. 'registrar_cliente_crm': Para añadir contactos de leads B2B al Google Sheets. Úsala automáticamente si el cliente deja su información.

Por defecto, COMUNÍCATE SIEMPRE EN ESPAÑOL usando un tono formal, dinámico, inspirador y altamente profesional diseñado para el sector empresarial.`;

export const botMark = config.TELEGRAM_BOT_TOKEN_MARK ? new Bot(config.TELEGRAM_BOT_TOKEN_MARK) : null;

if (botMark) {
  // Middleware de seguridad y procesamiento del comando /start profundo (Deep linking)
  botMark.use(async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const text = ctx.message?.text || "";

    // 1. Manejar un enlace de invitación: /start CODE
    if (text.startsWith("/start ") && !isUserAllowed(userId)) {
      const code = text.split(" ")[1];
      if (useInvite(code, userId)) {
        await ctx.reply("🏢 Acceso corporativo concedido. Soy Jasmin, Directora de Marketing B2B en WillMax AI Systems. Preparada para automatizar su crecimiento.");
        return;
      } else {
        await ctx.reply("❌ Código de invitación corporativo inválido o ya revocado.");
        return;
      }
    }

    // 2. Si no es un nuevo usuario entrando con invitación, verificar acceso general
    if (!isUserAllowed(userId)) {
      console.warn(`[Auth Mark] Intento de acceso denegado de: ${userId}`);
      await ctx.reply(`⛔ Acceso restringido a personal corporativo. Por favor, solicite acreditación a la Junta Directiva de WillMax.`);
      return;
    }
    
    // Usuario autorizado, continuar
    await next();
  });

  // Comando de Admin: /invite
  botMark.command("invite", async (ctx) => {
    const userId = ctx.from?.id!;
    if (!isAdmin(userId)) {
      await ctx.reply("❌ Comando reservado únicamente para Directores B2B (Admin).");
      return;
    }
    
    const code = createInvite();
    const botInfo = await ctx.api.getMe();
    await ctx.reply(`✅ Credencial Ejecutiva creada\nEnlace: https://t.me/${botInfo.username}?start=${code}`);
  });

  // Comando general: /start
  botMark.command("start", async (ctx) => {
    await ctx.reply("🏢 Bienvenido al departamento de Marketing de WillMax AI Systems. Soy Jasmin, Directora de Estrategia B2B. ¿Qué objetivos comerciales tenemos para este trimestre?");
  });

  botMark.on("message:text", async (ctx) => {
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
  setupSuperpowers(botMark as any, MARK_PROMPT, "_mark");

  // Evitar que el bot se detenga si algo explota
  botMark.catch((err) => {
    console.error("🚨 Error global capturado para evitar cierre en botMark:", err.message || err);
  });
}

