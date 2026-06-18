import { z } from "zod";
import { Resend } from "resend";
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

function getAgentDisplayName(sessionId: string): string {
  const sess = sessionId.toLowerCase();
  if (sess.includes("cyber")) {
    return "Aegis Security | WillMax AI Systems";
  } else if (sess.includes("admin")) {
    return "Chloe CFO | WillMax AI Systems";
  } else if (sess.includes("mark")) {
    return "Jasmin Marketing | WillMax AI Systems";
  } else if (sess.includes("const")) {
    return "Pere Passivhaus | WillMax AI Systems";
  } else if (sess.includes("inmo")) {
    return "Lili Inmobiliaria | WillMax AI Systems";
  } else if (sess.includes("uni")) {
    return "Edu B2B | WillMax AI Systems";
  }
  return "WillMax AI Systems";
}

function extractEmailAddress(smtpFrom?: string, smtpUser?: string): string {
  if (!smtpFrom) return smtpUser || "onboarding@resend.dev";
  const match = smtpFrom.match(/<([^>]+)>/);
  return match ? match[1] : smtpFrom;
}

export async function executeSendEmail(params: SendEmailParams, sessionId: string = ""): Promise<string> {
  const fromName = getAgentDisplayName(sessionId);
  const emailBodyHtml = params.cuerpo_html || params.cuerpo_texto.replace(/\n/g, "<br>");

  // 1. Prioridad: SMTP (Nodemailer) si están los datos configurados
  if (config.SMTP_HOST && config.SMTP_USER && config.SMTP_PASS) {
    const fromAddress = extractEmailAddress(config.SMTP_FROM, config.SMTP_USER);
    const fromHeader = `"${fromName}" <${fromAddress}>`;

    try {
      const transporter = nodemailer.createTransport({
        host: config.SMTP_HOST,
        port: parseInt(config.SMTP_PORT || "587", 10),
        secure: config.SMTP_PORT === "465",
        auth: {
          user: config.SMTP_USER,
          pass: config.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: fromHeader,
        to: params.destinatario,
        subject: params.asunto,
        text: params.cuerpo_texto,
        html: emailBodyHtml,
      });

      return `[Éxito] Correo electrónico enviado correctamente a ${params.destinatario} vía SMTP. ID del mensaje: ${info.messageId}`;
    } catch (smtpError: any) {
      console.error("SMTP Error al enviar email:", smtpError);
      return `[Error] No se pudo enviar el correo a ${params.destinatario} vía SMTP: ${smtpError.message}`;
    }
  }

  // 2. Fallback: Resend si no hay SMTP configurado
  if (!config.RESEND_API_KEY) {
    throw new Error("El sistema no tiene configurada la credencial RESEND_API_KEY ni variables SMTP en sus variables de entorno.");
  }

  const resend = new Resend(config.RESEND_API_KEY);
  const fromAddress = extractEmailAddress(config.SMTP_FROM) || "onboarding@resend.dev";
  const fromHeader = `"${fromName}" <${fromAddress}>`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromHeader,
      to: [params.destinatario],
      subject: params.asunto,
      text: params.cuerpo_texto,
      html: emailBodyHtml,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return `[Error] No se pudo enviar el correo a ${params.destinatario} vía Resend: ${error.message}`;
    }

    return `[Éxito] Correo electrónico enviado correctamente a ${params.destinatario} vía Resend. ID del mensaje: ${data?.id}`;
  } catch (resendError: any) {
    console.error("Error crítico al enviar email vía Resend:", resendError);
    return `[Error] Falla en la plataforma de correo al enviar a ${params.destinatario}: ${resendError.message}`;
  }
}

