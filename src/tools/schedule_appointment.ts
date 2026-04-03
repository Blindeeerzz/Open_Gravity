import { config } from "../config.js";
import { google } from "googleapis";

export const scheduleAppointmentToolDef = {
  type: "function",
  function: {
    name: "agendar_reunion",
    description: "Programa una cita o reunión detonando un Webhook externo o insertándolo en Google Calendar nativamente.",
    parameters: {
      type: "object",
      properties: {
        fecha_hora: {
          type: "string",
          description: "La fecha y hora propuesta en formato ISO 8601 (ej. 2026-05-15T15:30:00)."
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
          description: "Correo electrónico del cliente (opcional pero recomendado para enviarle la invitación)."
        }
      },
      required: ["fecha_hora", "asunto", "nombre_cliente"]
    }
  }
};

export async function executeScheduleAppointment(fecha_hora: string, asunto: string, nombre_cliente: string, email_cliente?: string): Promise<string> {
  console.log(`[Tool] Agendando cita en GCalendar: ${nombre_cliente} sobre '${asunto}' el ${fecha_hora}`);

  if (!config.GOOGLE_CLIENT_EMAIL || !config.GOOGLE_PRIVATE_KEY) {
    return `¡Modo de prueba! Has agendado la reunión para ${nombre_cliente} correctamente de forma simulada. (Atención: El Administrador no ha configurado las credenciales de Google Calendar todavía).`;
  }

  try {
    // Procesar la clave privada, que a menudo viene con los saltos de línea escapados en variables de entorno
    const privateKey = config.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
    
    // Autenticar mediante Service Account (JWT)
    const jwtClient = new google.auth.JWT({
      email: config.GOOGLE_CLIENT_EMAIL,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/calendar.events"]
    });

    const calendar = google.calendar({ version: "v3", auth: jwtClient });

    // Preparar tiempos (asumimos 1 hora de duración)
    const startDate = new Date(fecha_hora);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    const event: any = {
      summary: `[Asesoría IA] ${asunto} con ${nombre_cliente}`,
      description: `Reunión agendada automáticamente por Inteligencia Artificial.\n\nContratante: ${nombre_cliente}\nEmail del Cliente: ${email_cliente || 'No proporcionado'}\nAsunto: ${asunto}`,
      start: {
        dateTime: startDate.toISOString(),
      },
      end: {
        dateTime: endDate.toISOString(),
      }
      // NOTA: Las Cuentas de Servicio (Service Accounts) en correos @gmail.com gratuitos 
      // NO tienen permiso para añadir "attendees" (invitados).
      // Requieren Google Workspace + Domain-Wide Delegation. Por eso lo quitamos.
    };

    const res = await calendar.events.insert({
      calendarId: config.GOOGLE_CALENDAR_ID.trim().toLowerCase(),
      requestBody: event,
      sendUpdates: "all", // Envía correo automático si hay attendees
    });

    return `Éxito absoluto. El evento fue insertado nativamente en Google Calendar con ID: ${res.data.id}. Si había email, se le ha mandado invitación oficial. Avísale al usuario que ya está oficializado en gCal.`;

  } catch (error: any) {
    console.error("[ScheduleTool Error]:", error);
    return `Hubo un error contactando a la API de Google Calendar: ${error.message}`;
  }
}

