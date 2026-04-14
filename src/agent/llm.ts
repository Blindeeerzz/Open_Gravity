import { config } from "../config.js";
import { getCombinedTools } from "../tools/index.js";

/**
 * Llama al LLM usando la API tipo OpenAI hospedada en HuggingFace.
 * Si falla, hace fallback automático a OpenRouter.
 */
export async function callLLM(messages: any[], model: string = config.HUGGINGFACE_MODEL) {
  try {
    console.log(`[LLM] Intentando con HuggingFace (Modelo: ${model})...`);
    // Usamos el endpoint de compatibilidad de OpenAI de Hugging Face
    const response = await fetch(`https://router.huggingface.co/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        tools: getCombinedTools(),
        tool_choice: "auto",
        max_tokens: 2000
      })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HF API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message;
  } catch (hfError: any) {
    console.error(`[LLM HuggingFace Error]: ${hfError.message}`);
    
    if (config.OPENROUTER_API_KEY) {
      console.log("[LLM] Aplicando fallback a OpenRouter...");
      return await callOpenRouterFallback(messages);
    } else {
      throw new Error("HuggingFace falló y no hay clave de fallback de OpenRouter configurada.");
    }
  }
}

async function callOpenRouterFallback(messages: any[]) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/tu-usuario/mikha",
        "X-Title": "MiKha Agent",
      },
      body: JSON.stringify({
        model: config.OPENROUTER_MODEL,
        messages: messages,
        tools: getCombinedTools(),
        tool_choice: "auto"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message;
  } catch (error: any) {
    console.error(`[LLM Fallback Error]: ${error.message}`);
    throw new Error("Ambos LLM (HuggingFace y OpenRouter) fallaron.");
  }
}
