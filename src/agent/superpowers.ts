import { config } from "../config.js";

// 1. Transcribir Audio (Whisper en Groq)
export async function transcribeAudio(fileUrl: string): Promise<string> {
  if (!config.GROQ_API_KEY) throw new Error("GROQ_API_KEY no está configurada.");

  try {
    // Descargar el OGG desde Telegram a la memoria de Node
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error(`Error descargando audio: ${response.statusText}`);
    const blob = await response.blob();

    // Enviar a Groq
    const formData = new FormData();
    formData.append("file", blob, "audio.ogg");
    formData.append("model", "whisper-large-v3");

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

// 2. Analizar Imagen (Gemini / OpenRouter)
export async function analyzeImage(fileUrl: string, caption: string = ""): Promise<string> {
  if (!config.OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY no está configurada. Necesaria para analizar imágenes.");

  try {
    // 1. Descargar la imagen a buffer y pasar a Base64
    const imgResponse = await fetch(fileUrl);
    if (!imgResponse.ok) throw new Error("No se pudo descargar la imagen de Telegram.");
    
    const arrayBuffer = await imgResponse.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const base64DataUri = `data:image/jpeg;base64,${base64}`;

    const prompt = caption 
      ? `Describe esta imagen en detalle y responde a este contexto del usuario: ${caption}`
      : "Describe esta imagen detalladamente.";

    // Usamos OpenRouter (motor principal para Visión)
    const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/hachi/open_gravity",
        "X-Title": "MiKha Vision"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash", // Gratuito, rápido e increíble con visión
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: base64DataUri } }
            ]
          }
        ]
      })
    });

    if (!orRes.ok) {
        const err = await orRes.text();
        throw new Error(`OpenRouter Vision Error: ${err}`);
    }

    const data = await orRes.json();
    return data.choices?.[0]?.message?.content || "No hay descripción.";
  } catch (error: any) {
    console.error("[Superpower] Vision Error:", error.message);
    return `[Error al procesar imagen: ${error.message}]`;
  }
}
