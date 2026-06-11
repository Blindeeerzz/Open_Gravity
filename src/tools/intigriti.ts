import { z } from "zod";

const INTIGRITI_API_BASE = "https://api.intigriti.com/researcher/v1";

export const intigritiReportSchema = z.object({
  program_handle: z.string().describe("Handle del programa en Intigriti"),
  title: z.string().describe("Título de la vulnerabilidad"),
  description: z.string().describe("Descripción detallada en formato Pentestify"),
  severity: z.enum(["low", "medium", "high", "critical"]).optional(),
  weaknes: z.string().optional().describe("Tipo: XSS, SQLi, etc")
});

export type IntigritiReportParams = z.infer<typeof intigritiReportSchema>;

export const intigritiReportToolDef = {
  type: "function",
  function: {
    name: "enviar_reporte_intigriti",
    description: "Envía un reporte de vulnerabilidad formateado en estándar Pentestify a la plataforma Intigriti.",
    parameters: {
      type: "object",
      properties: {
        program_handle: { type: "string", description: "Handle del programa (ej: company/program)" },
        title: { type: "string", description: "Título de la vulnerabilidad" },
        description: { type: "string", description: "Reporte completo en formato Pentestify" },
        severity: { type: "string", description: "Severidad: low, medium, high, critical" },
        weaknes: { type: "string", description: "Tipo de debilidad" }
      },
      required: ["program_handle", "title", "description"]
    }
  }
};

export async function executeIntigritiReport(params: IntigritiReportParams): Promise<string> {
  const apiToken = process.env.INTIGRITI_API_TOKEN;

  if (!apiToken) {
    throw new Error("No están configuradas las credenciales de Intigriti. Configura INTIGRITI_API_TOKEN.");
  }

  const reportData = {
    programHandle: params.program_handle,
    title: params.title,
    description: params.description,
    severity: params.severity || "medium",
    vulnerabilityType: params.weaknes || "other"
  };

  try {
    const response = await fetch(`${INTIGRITI_API_BASE}/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiToken}`
      },
      body: JSON.stringify(reportData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error de Intigriti: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return `[Éxito] Reporte enviado a Intigriti. ID: ${result.id || "desconocido"}. Estado: Pendiente.`;
  } catch (error: any) {
    return `[Error] No se pudo enviar a Intigriti: ${error.message}`;
  }
}

export async function searchIntigritiPrograms(query: string): Promise<string> {
  const apiToken = process.env.INTIGRITI_API_TOKEN;

  if (!apiToken) {
    return "Credenciales de Intigriti no configuradas.";
  }

  try {
    const response = await fetch(`${INTIGRITI_API_BASE}/programs?search=${encodeURIComponent(query)}`, {
      headers: { "Authorization": `Bearer ${apiToken}` }
    });

    if (!response.ok) return `Error: ${response.status}`;

    const data = await response.json();
    if (data.programs && data.programs.length > 0) {
      return data.programs.map((p: any) => 
        `- ${p.handle}: ${p.name}`
      ).join("\n");
    }
    return "No se encontraron programas.";
  } catch (error: any) {
    return `Error: ${error.message}`;
  }
}