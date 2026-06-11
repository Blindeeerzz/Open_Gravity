import { z } from "zod";
import { Resend } from "resend";
import { config } from "../config.js";

export const sendEmailSchema = z.object({
  destinatario: z.string().email("Debe ser un correo válido"),
  asunto: z.string().describe("El asunto del correo"),
  cuerpo_texto: z.string().describe("El cuerpo del correo en texto plano o con saltos de línea"),
  cuerpo_html: z.string().optional().describe("El cuerpo del correo en HTML (opcional pero recomendado para formatos bonitos)")
});

export type SendEmailParams = z.infer<typeof sendEmailSchema>;

export const sendEmailToolDef = {
  type: "function",
  function: {
    name: "enviar_correo",
    description: "Envía un correo electrónico a un cliente o usuario. Úsalo para enviar reportes de ciberseguridad, presupuestos, confirmar citas o responder peticiones.",
    parameters: {
      type: "object",
      properties: {
        destinatario: { type: "string", description: "Correo electrónico del destinatario (ej. cliente@gmail.com)" },
        asunto: { type: "string", description: "Asunto del correo" },
        cuerpo_texto: { type: "string", description: "El mensaje principal del correo" },
        cuerpo_html: { type: "string", description: "Opcional. Versión HTML rica del mensaje." }
      },
      required: ["destinatario", "asunto", "cuerpo_texto"]
    }
  }
};

export async function executeSendEmail(params: SendEmailParams): Promise<string> {
  if (!config.RESEND_API_KEY) {
    throw new Error("El sistema no tiene configurada la credencial RESEND_API_KEY en sus variables de entorno.");
  }

  const resend = new Resend(config.RESEND_API_KEY);

  // Por defecto, Resend te obliga a enviar desde un dominio verificado (ej. updates@tudominio.com)
  // Pero para pruebas, Resend permite usar onboarding@resend.dev si el destinatario es tu propio email verificado en Resend.
  // Como WillMax ya es una plataforma seria, enviaremos desde willmax.ai si es posible.
  const fromEmail = config.SMTP_FROM || "WillMax AI Systems <onboarding@resend.dev>";

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [params.destinatario],
      subject: params.asunto,
      text: params.cuerpo_texto,
      html: params.cuerpo_html || params.cuerpo_texto.replace(/\n/g, "<br>"),
    });

    if (error) {
      console.error("Resend API Error:", error);
      return `[Error] No se pudo enviar el correo a ${params.destinatario}: ${error.message}`;
    }

    return `[Éxito] Correo electrónico enviado correctamente a ${params.destinatario}. ID del mensaje: ${data?.id}`;
  } catch (error: any) {
    console.error("Error crítico al enviar email:", error);
    return `[Error] Falla en la plataforma de correo al enviar a ${params.destinatario}: ${error.message}`;
  }
}
