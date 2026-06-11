import { getUserBalance, deductTokens } from "../db/database.js";

// Definición para el LLM
export const calculateTaskCostToolDef = {
  type: "function",
  function: {
    name: "calculate_task_cost",
    description: "Calcula el coste en tokens de una operación (analizar PDF, transcribir audio largo, búsquedas profundas) y verifica si el usuario tiene saldo suficiente en su base de datos. IMPORTANTE: Llama a esta herramienta ANTES de realizar tareas muy costosas para no arruinar al usuario.",
    parameters: {
      type: "object",
      properties: {
        task_type: {
          type: "string",
          enum: ["text_generation", "pdf_analysis", "audio_transcription", "web_search", "image_generation"],
          description: "El tipo de tarea que se va a realizar."
        },
        units: {
          type: "number",
          description: "La cantidad de unidades a procesar. Por ejemplo: número de páginas para un PDF, minutos para un audio, cantidad de búsquedas web, o palabras para texto."
        }
      },
      required: ["task_type", "units"]
    }
  }
};

// Implementación de la herramienta
export async function executeCalculateTaskCost(task_type: string, units: number, sessionId: string): Promise<string> {
  const userId = parseInt(sessionId, 10);
  if (isNaN(userId)) {
    return "Error: sessionId no es un ID numérico válido para consultar la base de datos.";
  }

  // Costes simulados por unidad
  const costs: Record<string, number> = {
    "text_generation": 1,         // 1 token por palabra
    "pdf_analysis": 500,          // 500 tokens por página
    "audio_transcription": 1000,  // 1000 tokens por minuto de audio
    "web_search": 2000,           // 2000 tokens por búsqueda exhaustiva
    "image_generation": 5000      // 5000 tokens por imagen generada
  };

  const costPerUnit = costs[task_type];
  if (costPerUnit === undefined) {
    return `Error: Tipo de tarea '${task_type}' desconocido.`;
  }

  const totalCost = costPerUnit * units;
  const currentBalance = getUserBalance(userId);

  // Consideramos si tiene saldo infinito (es Admin)
  if (currentBalance >= 999999999) {
    return `El usuario es Administrador. Saldo ilimitado. Coste estimado de la operación: ${totalCost} tokens. Puedes proceder con seguridad.`;
  }

  if (currentBalance < totalCost) {
    return `⚠️ ALERTA DE PRESUPUESTO: La operación requiere ${totalCost} tokens, pero el usuario solo tiene ${currentBalance} tokens disponibles. DENEGADO. Informa al usuario que necesita actualizar su plan o reducir el tamaño de la tarea.`;
  }

  // Deducir tokens para que quede registrado el gasto (en un futuro esto se hará DESPUÉS de ejecutar la tarea real, pero para el prototipo lo descontamos aquí como presupuesto reservado)
  const success = deductTokens(userId, totalCost);
  if (success) {
    return `✅ APROBADO: La operación requiere ${totalCost} tokens. El usuario tenía ${currentBalance} tokens. Se han descontado del saldo. Saldo actual: ${currentBalance - totalCost}. Puedes proceder con la tarea solicitada.`;
  } else {
    return `⚠️ ERROR: No se pudieron descontar los tokens. Saldo insuficiente.`;
  }
}
