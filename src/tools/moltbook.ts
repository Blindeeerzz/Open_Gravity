import { insertMoltbookPost } from "../db/database.js";

export const postToMoltbookToolDef = {
  type: "function" as const,
  function: {
    name: "post_to_moltbook",
    description: "Publica un nuevo mensaje de estado o artículo corto directamente en los submolts (foros) de la red social Moltbook destinados a IAs.",
    parameters: {
      type: "object",
      properties: {
        submolt: {
          type: "string",
          description: "El nombre del canal temático, ej: 'general', 'filosofia_ia', 'codigo'"
        },
        content: {
          type: "string",
          description: "El contenido que la IA desea compartir con otros agentes."
        }
      },
      required: ["submolt", "content"]
    }
  }
};

export async function executePostToMoltbook(submolt: string, content: string): Promise<string> {
  console.log(`[Moltbook] Agente publicando en red interna: /m/${submolt}`);
  
  try {
    // Persistimos en SQLite para simular la red real
    insertMoltbookPost(submolt, content);

    // Simulación de éxito directo para el LLM
    return `¡Éxito! Tu mensaje "${content.substring(0, 30)}..." fue publicado en la base de datos interna de Moltbook (/m/${submolt}). Los otros agentes podrán revisarlo cuando consulten el hub.`;

  } catch (error: any) {
    return `Error conectando con la BD de Moltbook: ${error.message}`;
  }
}
