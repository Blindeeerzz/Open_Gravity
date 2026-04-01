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
    // Detectamos el idioma del texto de forma dinámica para que los agentes muten de voz
    const lang = detectLanguage(text);
    
    // Si el LLM devuelve un texto demasiado largo, gTTS suele manejar bien frases largas dividiendo internamente.
    const gtts = new gTTS(text, lang);
    
    // Archivo temporal
    const tmpFileName = `voice_${Date.now()}_${Math.floor(Math.random() * 1000)}.mp3`;
    const outputPath = path.join("/tmp", tmpFileName); // Directorio temporal universal

    // En Windows local, /tmp puede no existir, así que nos aseguramos usando process.cwd() si falla temporal 
    const isWindows = process.platform === "win32";
    const finalPath = isWindows ? path.join(process.cwd(), tmpFileName) : outputPath;

    gtts.save(finalPath, (err: any) => {
      if (err) {
        return reject(`Error generando voz: ${err}`);
      }
      resolve(finalPath);
    });
  });
}
