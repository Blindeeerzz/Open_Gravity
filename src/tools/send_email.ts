import { z } from "zod";
import nodemailer from "nodemailer";
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
    description: "Envía un correo electrónico a un cliente o usuario. Úsalo para enviar presupuestos, confirmar citas o responder peticiones.",
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
  // Verificamos si la configuración del servidor ha sido aportada
  if (!config.SMTP_HOST || !config.SMTP_USER || !config.SMTP_PASS) {
    throw new Error("El sistema no tiene configuradas las credenciales SMTP en sus variables de entorno.");
  }

  // Configurar el transporte SMTP
  const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: parseInt(config.SMTP_PORT || "465", 10),
    secure: parseInt(config.SMTP_PORT || "465", 10) === 465, // true for 465, false for other ports
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: config.SMTP_FROM || `"Agencia Inmobiliaria" <${config.SMTP_USER}>`,
    to: params.destinatario,
    subject: params.asunto,
    text: params.cuerpo_texto,
    html: params.cuerpo_html || params.cuerpo_texto.replace(/\n/g, "<br>"),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return `[Éxito] Correo electrónico enviado correctamente a ${params.destinatario}. ID del mensaje: ${info.messageId}`;
  } catch (error: any) {
    console.error("Error al enviar email:", error);
    return `[Error] No se pudo enviar el correo a ${params.destinatario}: ${error.message}`;
  }
}
