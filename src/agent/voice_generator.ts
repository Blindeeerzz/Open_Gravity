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

/**
 * Genera un archivo MP3 temporal con voz sintética de Google
 * a partir de un texto proporcionado.
 * 
 * @param text - El texto generado por el LLM.
 * @returns La ruta temporal del archivo .mp3 creado.
 */
export async function generateSpeechFromText(text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // 1. Limpiar el texto: quitar markdown (asteriscos, corchetes) y emojis que rompen el TTS de Google
    const cleanText = text
      .replace(/[*_#`~]/g, "") 
      .replace(/<[^>]*>?/gm, '') // quitar HTML
      .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '') // quitar emojis
      .trim();

    // Detectamos el idioma del texto limpio
    const lang = detectLanguage(cleanText);
    
    // Generar TTS
    const gtts = new gTTS(cleanText, lang);
    
    // Archivo temporal usando process.cwd() para asegurar permisos de escritura en servidor
    const tmpFileName = `voice_${Date.now()}_${Math.floor(Math.random() * 1000)}.mp3`;
    const finalPath = path.join(process.cwd(), tmpFileName);

    gtts.save(finalPath, (err: any) => {
      if (err) {
        return reject(`Error de guardado MP3: ${err.message || err}`);
      }
      resolve(finalPath);
    });
  });
}
