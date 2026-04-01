import fs from "fs";
import path from "path";
// @ts-ignore
import gTTS from "gtts";

/**
 * Genera un archivo MP3 temporal con voz sintética de Google
 * a partir de un texto proporcionado.
 * 
 * @param text - El texto generado por el LLM.
 * @returns La ruta temporal del archivo .mp3 creado.
 */
export async function generateSpeechFromText(text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Si el LLM devuelve un texto demasiado largo, lo recortamos un poco 
    // o el TTS podría fallar, aunque gTTS suele manejar bien frases largas dividiendo internamente.
    // Usamos acento español ('es')
    const gtts = new gTTS(text, 'es');
    
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
