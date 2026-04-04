import { z } from "zod";
import { google } from "googleapis";
import { config } from "../config.js";

export const crmSheetsToolDef = {
  type: "function",
  function: {
    name: "registrar_cliente_crm",
    description: "Añade un nuevo cliente o lead al sistema CRM de la empresa (Google Sheets). Úsalo en el momento en que alguien demuestre interés real, pida presupuesto o deje sus datos de contacto.",
    parameters: {
      type: "object",
      properties: {
        nombre: { type: "string", description: "Nombre completo del cliente." },
        contacto: { type: "string", description: "Forma de contacto: Teléfono, nombre de usuario de Telegram, o email." },
        interes: { type: "string", description: "En qué está interesado el cliente exactamente (ej. 'Comprar chalet en Andorra', 'Mentoria de trading', 'Inspeccion de obra')." },
        agente_responsable: { type: "string", description: "Tu propio rol para saber quién le atendió (ej. 'Agente Inmobiliario', 'MiKha-Trading')." },
        notas: { type: "string", description: "Cualquier detalle extra relevante o presupuesto aproximado discutido (opcional)." }
      },
      required: ["nombre", "contacto", "interes", "agente_responsable"]
    }
  }
};

export async function executeCrmSheets(nombre: string, contacto: string, interes: string, agente_responsable: string, notas: string = ""): Promise<string> {
  console.log(`[Tool] Registrando lead en CRM: ${nombre} (${interes}) vía ${agente_responsable}`);

  if (!config.GOOGLE_CLIENT_EMAIL || !config.GOOGLE_PRIVATE_KEY || !config.GOOGLE_SHEET_ID) {
    return `¡Modo Local! El CRM no está conectado porque faltan variables de entorno (GOOGLE_SHEET_ID, etc.). Sin embargo, el Lead (${nombre}) ha sido procesado de forma simulada correcta.`;
  }

  try {
    const privateKey = config.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
    
    // Autenticar mediante Service Account
    const jwtClient = new google.auth.JWT({
      email: config.GOOGLE_CLIENT_EMAIL,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const sheets = google.sheets({ version: "v4", auth: jwtClient });
    
    // Timestamp actual en formato legible
    const fecha = new Date().toISOString().replace("T", " ").substring(0, 19);

    // Los datos deben ir en una matriz 2D (array de arrays) donde cada array interno es una fila
    const fila = [
      [fecha, agente_responsable, nombre, contacto, interes, notas]
    ];

    // Añadir la fila al final del documento de Sheets (asumiendo que los datos están en 'Sheet1' o la primera hoja activa)
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: config.GOOGLE_SHEET_ID,
      range: "A:F", // Añade en cualquier lugar de las columnas A a F
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: fila
      }
    });

    return `Éxito. El perfil del cliente (${nombre}) ha sido inyectado en el CRM corporativo. Continúa la conversación con él de forma natural.`;

  } catch (error: any) {
    console.error("[CRM Sheets Error]:", error);
    return `Hubo un error contactando a la API de Google Sheets: ${error.message}`;
  }
}
