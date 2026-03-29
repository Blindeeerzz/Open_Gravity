export const getCurrentTimeToolDef = {
  type: "function" as const,
  function: {
    name: "get_current_time",
    description: "Obtiene la fecha y hora actual del sistema. Útil para responder preguntas sobre qué hora o día es hoy.",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  }
};

export async function executeGetCurrentTime(): Promise<string> {
  const now = new Date();
  // Formato completo en español de España (ejemplo temporal, configurable)
  const formatter = new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'full',
    timeStyle: 'long',
    timeZone: 'Europe/Madrid' // Ajustable según necesidad
  });
  return formatter.format(now);
}
