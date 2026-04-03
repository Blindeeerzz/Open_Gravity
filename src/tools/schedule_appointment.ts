import { config } from "../config.js";

export const scheduleAppointmentToolDef = {
  type: "function",
  function: {
    name: "agendar_reunion",
    description: "Programa una cita o reunión detonando un Webhook externo (n8n, Make) o de forma local.",
    parameters: {
      type: "object",
      properties: {
        fecha_hora: {
          type: "string",
          description: "La fecha y hora propuesta en formato ISO 8601 (ej. 2026-05-15T15:30:00) o en texto natural claro."
        },
        asunto: {
          type: "string",
          description: "De qué tratará la reunión."
        },
        nombre_cliente: {
          type: "string",
          description: "Nombre de la persona con la que se agenda la cita."
        },
        email_cliente: {
          type: "string",
          description: "Correo electrónico del cliente (opcional pero muy recomendado para enviarle la invitación)."
        }
      },
      required: ["fecha_hora", "asunto", "nombre_cliente"]
    }
  }
};

export async function executeScheduleAppointment(fecha_hora: string, asunto: string, nombre_cliente: string, email_cliente?: string): Promise<string> {
  console.log(`[Tool] Agendando reunión para ${nombre_cliente} sobre '${asunto}' el ${fecha_hora}`);

  const payload = {
    fecha_hora,
    asunto,
    nombre_cliente,
    email_cliente: email_cliente || "no_proporcionado"
  };

  // Si existe la URL configurada por el usuario (n8n, webhook.site, Zapier), enviamos los datos.
  if (config.WEBHOOK_CALENDAR_URL) {
    try {
      const res = await fetch(config.WEBHOOK_CALENDAR_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        throw new Error(`El Webhook respondió con error ${res.status}`);
      }
      return `Éxito absoluto. La reunión sobre "${asunto}" ha sido enviada al sistema automatizado. Confírmaselo al usuario de forma natural.`;
    } catch (error: any) {
      console.error("[ScheduleTool Error]:", error);
      return `Hubo un error contactando el servidor de calendarios: ${error.message}`;
    }
  }

  // Si no hay Webhook, simulamos que ha funcionado (Modo local de pruebas)
  return `¡Modo de prueba! Has agendado exitosamente la reunión para ${nombre_cliente} en el sistema local, pero ten en cuenta que WEBHOOK_CALENDAR_URL no está configurada, así que no se ha notificado a ningún sistema externo real todavía.`;
}
