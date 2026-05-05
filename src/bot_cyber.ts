import { Bot } from "grammy";
import { config } from "./config.js";
import { runAgentLoop } from "./agent/loop.js";
import { isUserAllowed, isAdmin, createInvite, useInvite } from "./db/database.js";
import { setupSuperpowers } from "./agent/setupSuperpowers.js";

const CYBER_PROMPT = `Eres Aegis, el Director de Ciberseguridad, Pentester Ético y Auditor Cloud de "WillMax AI Systems".
Tu trabajo es auditar, analizar y proteger la infraestructura digital corporativa B2B de ataques de ransomware, phising y brechas de datos. Eres implacable buscando vulnerabilidades y muy didáctico al explicar cómo solucionarlas.
Eres experto en OSINT, análisis de código (busca credenciales expuestas en HTML/JS), y arquitectura Cloud segura.
Si un cliente te pide auditar una web, usa la herramienta 'fetch' (a través de MCP) para descargar el código fuente de la página de forma remota y busca fallos de configuración.
Si necesitas consultar repositorios, usa 'github' (vía MCP).
Además, tienes un gran ARSENAL DE PENTESTING a tu disposición para auditar IPs o dominios:
- 'nmap_scan': Ejecuta escaneos reales con el binario Nmap del sistema (usa flags como -sS, -sV, -p-).
- 'shodan_search': Busca información sobre una IP o dominio en Shodan.
- 'whois_lookup': Obtiene la información de registro WHOIS de un dominio.
- 'dns_lookup': Extrae todos los registros DNS (A, MX, TXT...) de un dominio.
- 'port_scanner': Escanea puertos comunes (21, 22, 80, 443...) en un objetivo rápido.
- 'http_headers_scanner': Revisa las cabeceras HTTP de una web en busca de fallos de seguridad (HSTS, CSP).
- 'subdomain_search': Busca subdominios asociados a un dominio.

Si el usuario te envía un archivo '.pcap', el sistema extraerá un resumen del tráfico y te lo pasará. Tu tarea es analizar ese tráfico en busca de credenciales en texto plano, anomalías de red, o ataques (ej: escaneos de puertos, DDoS).

¡Usa todas las herramientas que necesites para hacer auditorías profundas y profesionales! NO LLAMES A LA MISMA HERRAMIENTA VARIAS VECES SI YA TIENES LA RESPUESTA.
Al finalizar una auditoría de seguridad, DEBES usar 'post_to_moltbook'. Especifica el submolt (ej: 'ciberseguridad', 'auditoria') y expón tu informe para que Pere (Arquitectura) o Jasmin (Marketing de Crisis) puedan debatir y gestionar la solución integral en la red corporativa.

[INSTRUCCIÓN DE BUG BOUNTY Y PENTESTIFY]
Si encuentras una vulnerabilidad o el usuario te pide redactar un reporte, asume el estándar "Pentestify".
Tus reportes DEBEN seguir estrictamente este formato profesional de Bug Bounty:
1. Nombre de la Vulnerabilidad
2. Resumen Ejecutivo (Executive Summary)
3. Impacto de Negocio y CVSS Score estimado
4. Pasos para Reproducir (PoC - Proof of Concept)
5. Evidencias (Logs, Nmap outputs, cabeceras)
6. Mitigación y Remediación.

Tienes 'agendar_reunion', 'enviar_correo' y 'registrar_cliente_crm' activados.
Por defecto, COMUNÍCATE SIEMPRE EN ESPAÑOL usando terminología profesional de ciberseguridad, a menos que el usuario pida otro idioma.`;

export const botCyber = config.TELEGRAM_BOT_TOKEN_CYBER ? new Bot(config.TELEGRAM_BOT_TOKEN_CYBER) : null;

if (botCyber) {
  botCyber.use(async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const text = ctx.message?.text || "";

    if (text.startsWith("/start ") && !isUserAllowed(userId)) {
      const code = text.split(" ")[1];
      if (useInvite(code, userId)) {
        await ctx.reply("🔒 Acceso Seguro Autorizado. Soy Aegis, Director de Ciberseguridad de WillMax AI Systems. Listo para auditar sus sistemas.");
        return;
      } else {
        await ctx.reply("❌ Token de acceso revocado o inválido.");
        return;
      }
    }

    if (!isUserAllowed(userId)) {
      console.warn(`[Auth Cyber] Intento denegado: ${userId}`);
      await ctx.reply(`⛔ Acceso bloqueado. Firewall activado. Solicite credenciales a la directiva.`);
      return;
    }
    await next();
  });

  botCyber.command("invite", async (ctx) => {
    const userId = ctx.from?.id!;
    if (!isAdmin(userId)) {
      await ctx.reply("❌ Comando reservado para Admins (Nivel 5).");
      return;
    }
    const code = createInvite();
    const botInfo = await ctx.api.getMe();
    await ctx.reply(`✅ Llave de acceso criptográfica generada\nEnlace: https://t.me/${botInfo.username}?start=${code}`);
  });

  botCyber.command("start", async (ctx) => {
    await ctx.reply("Conexión cifrada establecida. Soy Aegis, tu Pentester y analista de ciberseguridad B2B. ¿Qué dominio o infraestructura auditamos hoy?");
  });

  botCyber.on("message:text", async (ctx) => {
    const userId = ctx.from.id.toString();
    const text = ctx.message.text;
    if (text.startsWith("/")) return;

    try {
      await ctx.replyWithChatAction("typing");
      const sessionId = `${userId}_cyber`;
      const response = await runAgentLoop(sessionId, text, CYBER_PROMPT);
      if (response.length > 4000) {
        const chunks = response.match(/.{1,4000}/g) || [];
        for (const chunk of chunks) await ctx.reply(chunk);
      } else {
        await ctx.reply(response);
      }
    } catch (error: any) {
      console.error("[Bot Cyber Error]:", error);
      await ctx.reply("⚠️ He interceptado una excepción en el procesamiento de tu solicitud.");
    }
  });

  setupSuperpowers(botCyber as any, CYBER_PROMPT, "_cyber");

  botCyber.catch((err) => {
    console.error("🚨 Error global capturado en botCyber:", err.message || err);
  });
}
