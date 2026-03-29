import { getSessionMessages, saveMessage } from "../db/database.js";
import { callLLM } from "./llm.js";
import { executeToolWrapper } from "../tools/index.js";

const MAX_ITERATIONS = 5;

export async function runAgentLoop(sessionId: string, userMessage: string, systemPrompt: string): Promise<string> {
  // 1. Guardar mensaje de usuario en BD
  saveMessage(sessionId, "user", userMessage);

  // 2. Recuperar el historial de chat (incluyendo la inyección temporal del System Prompt)
  const dbMessages = getSessionMessages(sessionId, 30);
  
  // Transformar los mensajes para asegurar compatibilidad estricta con OpenAI specs
  const messageHistory = dbMessages.map((m: any) => {
    // Si un mensaje tiene tool_calls en formato string (desde sqlite), pero el modelo requiere un objeto
    const formatted = { ...m };
    if (typeof formatted.tool_calls === 'string') {
        try { formatted.tool_calls = JSON.parse(formatted.tool_calls); } catch(e){}
    }
    return formatted;
  });

  const messages = [
    { role: "system", content: systemPrompt },
    ...messageHistory
  ];

  let iterations = 0;
  let finalResponse = "";

  while (iterations < MAX_ITERATIONS) {
    iterations++;
    console.log(`[AgentLoop] Iteración ${iterations} para sesión ${sessionId}`);
    
    // 3. Llamada al LLM
    const assistantMessage = await callLLM(messages);
    
    if (!assistantMessage) {
      throw new Error("El modelo no devolvió ninguna respuesta.");
    }

    // Asegurarse de mantener el objeto validado en el array local
    const sanitizedAssistantMsg: any = { role: "assistant" };
    if (assistantMessage.content) sanitizedAssistantMsg.content = assistantMessage.content;
    if (assistantMessage.tool_calls) sanitizedAssistantMsg.tool_calls = assistantMessage.tool_calls;
    
    messages.push(sanitizedAssistantMsg);
    
    // Persistir el mensaje del asistente o el uso de herramientas
    saveMessage(
      sessionId, 
      "assistant", 
      assistantMessage.content || null, 
      assistantMessage.tool_calls ? JSON.stringify(assistantMessage.tool_calls) : null
    );

    // 4. ¿Llamó el modelo a una herramienta?
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      // Ejecutar cada herramienta en paralelo o de forma secuencial
      for (const toolCall of assistantMessage.tool_calls) {
        const functionName = toolCall.function.name;
        // Parsear los argumentos (suelen ser string)
        let toolArgs = {};
        try {
          toolArgs = JSON.parse(toolCall.function.arguments || "{}");
        } catch(e) { /* Ignorar error de JSON */ }
        
        // Ejecutar tool
        const toolResult = await executeToolWrapper(functionName, toolArgs);
        
        // Formatear la respuesta
        const toolMessage = {
          role: "tool",
          tool_call_id: toolCall.id,
          name: functionName,
          content: toolResult
        };
        
        messages.push(toolMessage);
        
        // Guardar resultado de la tool
        saveMessage(sessionId, "tool", toolResult, null, toolCall.id);
      }
      // Vuelve al bucle para procesar las observaciones del LLM
      continue; 
    }

    // 5. Si no usó herramientas, esta es la respuesta final
    finalResponse = assistantMessage.content || "Lo siento, no tengo respuesta para eso.";
    break;
  }

  if (iterations >= MAX_ITERATIONS) {
    finalResponse += "\n\n[Aviso del sistema: Se ha alcanzado el límite de iteraciones del agente y se ha forzado el final de la inferencia.]";
    saveMessage(sessionId, "assistant", finalResponse);
  }

  return finalResponse;
}
