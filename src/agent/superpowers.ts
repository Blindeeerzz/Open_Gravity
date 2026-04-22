import { config } from "../config.js";
// @ts-ignore
import pdfParse from "pdf-parse-new";

// 1. Transcribir Audio (Whisper en Groq)
export async function transcribeAudio(fileUrl: string): Promise<string> {
  if (!config.GROQ_API_KEY) throw new Error("GROQ_API_KEY no está configurada.");

  try {
    // Descargar el OGG desde Telegram a la memoria de Node
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error(`Error descargando audio: ${response.statusText}`);
    const blob = await response.blob();

    console.log("[Superpower] Enviando audio a Groq Whisper...");
    // Enviar a Groq
    const formData = new FormData();
    formData.append("file", blob, "audio.ogg");
    formData.append("model", "whisper-large-v3-turbo");

    const groqRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.GROQ_API_KEY}`
      },
      body: formData
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      throw new Error(`Groq Whisper Error: ${err}`);
    }

    const data = await groqRes.json();
    return data.text || "No se pudo transcribir nada.";
  } catch (error: any) {
    console.error("[Superpower] Audio Error:", error.message);
    return `[Error al procesar audio: ${error.message}]`;
  }
}

// 2. Analizar Imagen (Gemini API Oficial)
export async function analyzeImage(fileUrl: string, caption: string = ""): Promise<string> {
  if (!config.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY no está configurada. Necesaria para analizar imágenes.");

  try {
    // 1. Descargar la imagen a buffer y pasar a Base64 puro
    const imgResponse = await fetch(fileUrl);
    if (!imgResponse.ok) throw new Error("No se pudo descargar la imagen de Telegram.");
    
    const arrayBuffer = await imgResponse.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64'); // Sin prefijos 'data:...' para Google

    const prompt = caption 
      ? `Describe esta imagen en detalle y responde a este contexto del usuario: ${caption}`
      : "Describe esta imagen detalladamente.";

    // Usamos el API Oficial de Google AI Studio (100% Gratuito y directo)
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${config.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: "image/jpeg", data: base64 } }
          ]
        }]
      })
    });

    if (!geminiRes.ok) {
        const err = await geminiRes.text();
        throw new Error(`Google Gemini Vision Error: ${err}`);
    }

    const data = await geminiRes.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No hay descripción.";
  } catch (error: any) {
    console.error("[Superpower] Vision Error:", error.message);
    return `[Error al procesar imagen: ${error.message}]`;
  }
}

// 3. Extraer Texto de PDF (Ligero y Nativo)
export async function readPdf(fileUrl: string): Promise<string> {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("No se pudo descargar el archivo PDF.");
    
    // Convertirlo a buffer para pasarlo a pdf-parse
    const arrayBuffer = await response.arrayBuffer();
    const dataBuffer = Buffer.from(arrayBuffer);
    
    // Typescript strict mode bypass para librerias CommonJS/ESM
    const extractor: any = pdfParse;
    const executeParse = typeof extractor === "function" ? extractor : extractor.default;

    const data = await executeParse(dataBuffer);
    
    let text = data.text || "";
    // Limpieza básica de saltos de página múltiples
    text = text.replace(/\n{3,}/g, '\n\n').trim();
    
    // Si el texto es peligrosamente gigante (+15K chars), lo truncamos para no matar el LLM
    const MAX_CHARS = 15000;
    if (text.length > MAX_CHARS) {
      text = text.slice(0, MAX_CHARS) + "\n\n... [El resto del documento fue truncado por longitud máxima]";
    }

    return text || "[Documento vacío o sin texto puro detectable]";
  } catch (error: any) {
    console.error(`[Superpower] PDF Error:`, error.message);
    return `[Error escaneando PDF: ${error.message}]`;
  }
}
