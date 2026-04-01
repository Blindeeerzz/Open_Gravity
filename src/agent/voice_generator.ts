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
  
  const caCount = caMatches ? caMatches.length : 0;
  const esCount = esMatches ? esMatches.length : 0;
  const enCount = enMatches ? enMatches.length : 0;
  
  if (caCount > esCount && caCount > enCount) return 'ca';
  if (enCount > esCount && enCount > caCount) return 'en';
  return 'es'; // Por defecto siempre asumimos español
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
