import fs from "fs";
import path from "path";
// @ts-ignore
import gTTS from "gtts";

/**
 * Analizador súper ligero para detectar dinámicamente Español, Catalán e Inglés.
 * Evita la necesidad de importar pesadas librerías de Machine Learning.
 */
function detectLanguage(text: string): string {
  const caMatches = text.match(/\b(amb|i|que|però|això|és|són|l'|d'|seva|un|una|com|si us plau|molt|bon dia|adéu|una|les|les|dels|als)\b/gi);
  const esMatches = text.match(/\b(con|y|que|pero|esto|es|son|su|un|una|como|por favor|mucho|hola|adiós|las|los|del|al)\b/gi);
  const enMatches = text.match(/\b(with|and|that|but|this|is|are|his|her|an|how|please|much|hello|goodbye|the|of|to)\b/gi);
  const frMatches = text.match(/\b(avec|et|que|mais|ce|est|sont|son|sa|un|une|comme|pour|dans|bonjour|merci|des)\b/gi);
  const ruMatches = text.match(/\b(с|и|что|но|это|является|его|ее|как|для|в|на|привет|спасибо|да|нет)\b/gi);
  const zhMatches = text.match(/(和|的|在|是|有|我|你|他|这|个|们|了|不|好|请|谢谢)/g);
  
  const caCount = caMatches ? caMatches.length : 0;
  const esCount = esMatches ? esMatches.length : 0;
  const enCount = enMatches ? enMatches.length : 0;
  const frCount = frMatches ? frMatches.length : 0;
  const ruCount = ruMatches ? ruMatches.length : 0;
  const zhCount = zhMatches ? zhMatches.length : 0;
  
  const counts = [
    { lang: 'ca', count: caCount },
    { lang: 'en', count: enCount },
    { lang: 'fr', count: frCount },
    { lang: 'ru', count: ruCount },
    { lang: 'zh-CN', count: zhCount },
    { lang: 'es', count: esCount }
  ];
  
  counts.sort((a, b) => b.count - a.count);
  
  return counts[0].count > 0 ? counts[0].lang : 'es'; // Por defecto español si no detecta nada
}
import { config } from "../config.js";

/**
 * Retorna el Voice ID de ElevenLabs correspondiente para cada agente con acento de España.
 */
function getVoiceIdForAgent(sessionSuffix: string): string {
  switch (sessionSuffix) {
    // --- AGENTES FEMENINOS (Español de España) ---
    case "_admin": // Chloe (CFO / Virtual Assistant)
      return "KHCvMklQZZo0O30ERnVn"; // Voz de Chloe personalizada
    case "_mark":  // Jasmin (Maia - Sweet Natural Storyteller)
      return "jipeLrCHZ6ByxrU2JP9i"; // Voz de Jasmin/Maia personalizada
    case "_mikha": // Lilith (CEO / Principal)
      return "RN21UDW82pAS9bWvJkGP"; // Stela (Voz provisional para Lilith)
    case "_inmo":  // Lili (Analista Inmobiliaria)
      return "tXgbXPnsMpKXkuTgvE3h"; // Elena (Voz provisional para Lili)

    // --- AGENTES MASCULINOS (Español de España) ---
    case "_cyber": // Aegis (Seguridad)
      return "QtPMrakdgePQIUwOX7Ut"; // Voz de Aegis personalizada
    case "_const": // Pere (Ingeniería de la construcción)
      return "diKn1AGR1UOOaW8J7qoL"; // Voz de Pere personalizada
    case "_uni":   // Edu (Soporte Técnico / Ventas)
      return "iXa2i9eYvgmNMRQRCwqO"; // Nico Masip (Voz provisional para Edu)
    case "_kendo": // Kendo Asist (Dojo / Deporte)
      return "iXa2i9eYvgmNMRQRCwqO"; // Nico Masip (Voz provisional para Kendo)

    default:
      return "pNInz6obpgDQGcFmaJgB"; // Adam (Voz por defecto si no coincide)
  }
}

/**
 * Genera un archivo MP3 temporal con voz sintética (ElevenLabs o Google TTS)
 * a partir de un texto proporcionado.
 * 
 * @param text - El texto generado por el LLM.
 * @param sessionSuffix - Sufijo de la sesión del agente para determinar su voz.
 * @returns La ruta temporal del archivo .mp3 creado.
 */
export async function generateSpeechFromText(text: string, sessionSuffix: string = ""): Promise<string> {
  // 1. Limpiar el texto: quitar markdown (asteriscos, corchetes) y emojis
  const cleanText = text
    .replace(/[*_#`~]/g, "") 
    .replace(/<[^>]*>?/gm, '') // quitar HTML
    .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '') // quitar emojis
    .trim();

  const tmpFileName = `voice_${Date.now()}_${Math.floor(Math.random() * 1000)}.mp3`;
  const finalPath = path.join(process.cwd(), tmpFileName);

  // Intentar usar ElevenLabs si hay API Key configurada
  if (config.ELEVENLABS_API_KEY) {
    const voiceId = getVoiceIdForAgent(sessionSuffix);
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': config.ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      fs.writeFileSync(finalPath, Buffer.from(buffer));
      return finalPath;
    } catch (error) {
      console.error("⚠️ [Voice Generator] Error en ElevenLabs, intentando siguiente fallback...", error);
    }
  }

  // Intentar usar Hugging Face (WillMax Voicebox) si hay Token configurado
  if (config.HF_TOKEN) {
    const lang = detectLanguage(cleanText);
    // Modelo por defecto para español, puedes cambiarlo si tienes un Endpoint dedicado de Voicebox
    let modelUrl = "https://api-inference.huggingface.co/models/facebook/mms-tts-spa"; 
    if (lang === 'en') modelUrl = "https://api-inference.huggingface.co/models/facebook/mms-tts-eng";

    try {
      const response = await fetch(modelUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: cleanText })
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      fs.writeFileSync(finalPath, Buffer.from(buffer));
      return finalPath;
    } catch (error) {
      console.error("⚠️ [Voice Generator] Error en Hugging Face Voicebox, haciendo fallback a gTTS...", error);
    }
  }

  // Fallback a gTTS clásico
  return new Promise((resolve, reject) => {
    const lang = detectLanguage(cleanText);
    const gtts = new gTTS(cleanText, lang);

    gtts.save(finalPath, (err: any) => {
      if (err) {
        return reject(`Error de guardado MP3 (gTTS): ${err.message || err}`);
      }
      resolve(finalPath);
    });
  });
}
