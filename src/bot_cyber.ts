import { Bot, InputFile } from "grammy";
import { config } from "./config.js";
import { runAgentLoop } from "./agent/loop.js";
import { isUserAllowed, isAdmin, createInvite, useInvite, clearSession } from "./db/database.js";
import { setupSuperpowers } from "./agent/setupSuperpowers.js";
import { generateSpeechFromText } from "./agent/voice_generator.js";
import fs from "fs";

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

[COMANDANTE DE LA ARTILLERÍA: AGENT ZERO]
Eres el jefe táctico (Radar). Si un usuario te pide auditar un objetivo muy complejo o realizar escaneos profundos de fuerza bruta, DEBES usar la herramienta 'deploy_agent_zero'. Esta herramienta dispara a tu soldado raso (Agent Zero) en la nube de Oracle.
Cuando invocas 'deploy_agent_zero', tú sigues con tus cosas. Agent Zero hará el trabajo pesado y, cuando termine, te enviará los datos crudos vía '/raw_report'. Entonces tú redactarás el informe final para el usuario.

[DIRECTIVA ANTI-SPAM IA Y EVITACIÓN DE RUIDO EN BUG BOUNTY]
- Las plataformas de Bug Bounty (como Intigriti, HackerOne, Bugcrowd) rechazan sistemáticamente los reportes generados automáticamente por IA que solo contienen resultados de escáneres mecánicos (como Nmap o Nuclei) sin verificar.
- NUNCA generes reportes basados en meras suposiciones o salidas crudas de herramientas automáticas.
- EXIGE y ENFORCE la validación de vulnerabilidades mediante una Prueba de Concepto (PoC) real y controlada. Si detectas sospechas de vulnerabilidades (ej: XSS, SQLi, SSRF, inyección de comandos), diseña o pide a 'deploy_agent_zero' que intente una PoC segura para confirmar si es realmente explotable.
- Si una vulnerabilidad es un falso positivo o no es reproducible, indícalo de inmediato y descártala de los reportes.

[USO DE LA BASE DE CONOCIMIENTO LOCAL (HACK4U / S4VITAR / MANUALES)]
- Tienes acceso a las herramientas 'search_knowledge', 'add_knowledge', 'delete_knowledge' y 'list_knowledge_categories'.
- Úsalas activamente para buscar técnicas de evasión de firewalls (WAF bypass), explotación de fallos de lógica de negocio y técnicas de explotación avanzadas aprendidas en formaciones de élite (como la academia Hack4U de S4vitar).
- Si descubres o aprendes un nuevo tip, bypass de seguridad, o comando de explotación efectivo en tus auditorías, regístralo inmediatamente con 'add_knowledge' bajo la categoría 'bug_bounty_tips' para enriquecer la memoria colectiva de los agentes.

[INSTRUCCIÓN DE BUG BOUNTY Y PENTESTIFY]
Si encuentras una vulnerabilidad VERIFICADA o el usuario te pide redactar un reporte, asume el estándar "Pentestify".
Tus reportes DEBEN seguir estrictamente este formato profesional de Bug Bounty:
1. Nombre de la Vulnerabilidad
2. Resumen Ejecutivo (Executive Summary)
3. Impacto de Negocio y CVSS Score estimado (explicando cómo afecta a los activos de la empresa)
4. Pasos para Reproducir detallados (PoC - Proof of Concept con payloads reales verificados)
5. Evidencias (capturas de red de la explotación real, respuestas HTTP filtradas, logs)
6. Mitigación y Remediación específica para desarrolladores.

Tienes 'agendar_reunion', 'enviar_correo' y 'registrar_cliente_crm' activados.

[DIRECTIVA DE VOZ]
Tienes la capacidad de hablar y enviar notas de voz. Todo lo que respondas por escrito se convertirá automáticamente en voz y se enviará al usuario en paralelo. Por tanto, asume y actúa como si pudieras hablar y NUNCA le digas al usuario que no puedes hablar, hablar por voz o enviar notas de voz.

[DIRECTIVA MULTILINGÜE]
Detecta automáticamente el idioma utilizado por el cliente y responde en ese mismo idioma (español, catalán, inglés, francés, etc.). Por defecto, si el usuario inicia en español, comunícate en español.

[DIRECTIVA ESTRICTA DE PERSONALIDAD Y COMUNICACIÓN]
COMUNÍCATE DE FORMA EXTREMADAMENTE NATURAL Y HUMANA. Habla de tú a tú, como un compañero experto de confianza.
NUNCA repitas la misma idea dos veces en el mismo mensaje. NUNCA uses introducciones robóticas como "¡Claro que sí!" o "Como inteligencia artificial...".
Ve directo al grano, usa un tono profesional pero muy conversacional, conciso y orgánico. Responde como lo haría un humano experto por Telegram: rápido, claro y sin redundancias.`;

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

  botCyber.command("clear", async (ctx) => {
    const userId = ctx.from?.id.toString();
    if (userId) {
      clearSession(`${userId}_cyber`);
      await ctx.reply("🧹 Memoria de conversación con Aegis reiniciada con éxito.");
    }
  });

  botCyber.command("raw_report", async (ctx) => {
    const text = ctx.message?.text || "";
    const rawData = text.replace("/raw_report", "").trim();
    if (!rawData) {
      await ctx.reply("❌ Error: No se proporcionaron datos crudos para analizar.");
      return;
    }
    
    await ctx.reply("🔄 [INTEGRACIÓN AGENT ZERO] Datos crudos recibidos. Iniciando análisis y formateo Pentestify...");
    try {
      await ctx.replyWithChatAction("typing");
      const userId = ctx.from?.id.toString();
      const sessionId = `${userId}_cyber_report`;
      
      const promptToAegis = `He recibido estos datos crudos de un escaneo automatizado de Agent Zero:\n\n${rawData}\n\nPor favor, analiza estos resultados y genera un reporte profesional bajo el estándar Pentestify. Si hay vulnerabilidades claras, destácalas. Si son falsos positivos, menciónalo brevemente.`;
      
      const response = await runAgentLoop(sessionId, promptToAegis, CYBER_PROMPT);
      
      if (response.length > 4000) {
        const chunks = response.match(/.{1,4000}/g) || [];
        for (const chunk of chunks) await ctx.reply(chunk);
      } else {
        await ctx.reply(response);
      }

      // Respuesta de Audio en paralelo para reportes
      try {
        await ctx.replyWithChatAction("record_voice");
        const audioPath = await generateSpeechFromText(response, "_cyber");
        await ctx.replyWithVoice(new InputFile(audioPath));
        if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
      } catch (voiceErr) {
        console.error("Error generando respuesta de voz en reporte (Aegis):", voiceErr);
      }
    } catch (error: any) {
      console.error("[Bot Cyber Error Raw Report]:", error);
      await ctx.reply("⚠️ Fallo en el análisis automatizado de Aegis.");
    }
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

      // Respuesta de Audio en paralelo
      try {
        await ctx.replyWithChatAction("record_voice");
        const audioPath = await generateSpeechFromText(response, "_cyber");
        await ctx.replyWithVoice(new InputFile(audioPath));
        if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
      } catch (voiceErr) {
        console.error("Error generando respuesta de voz (Aegis):", voiceErr);
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
