import { z } from "zod";

const HACKERONE_API_BASE = "https://api.hackerone.com/v1";

export const hackeroneReportSchema = z.object({
  program_handle: z.string().describe("Handle del programa (ej: vercel, cloudflare)"),
  title: z.string().describe("Título de la vulnerabilidad"),
  description: z.string().describe("Descripción detallada en formato Pentestify"),
  severity: z.enum(["low", "medium", "high", "critical"]).optional().describe("Severidad de la vulnerabilidad"),
  weaknes: z.string().optional().describe("Tipo de debilidad (XSS, SQLi, etc)")
});

export type HackeroneReportParams = z.infer<typeof hackeroneReportSchema>;

export const hackeroneReportToolDef = {
  type: "function",
  function: {
    name: "enviar_reporte_hackerone",
    description: "Envía un reporte de vulnerabilidad formateado en estándar Pentestify directamente a la plataforma HackerOne. Usa esta herramienta cuando hayas completado un análisis y tengas un reporte profesional listo para enviar.",
    parameters: {
      type: "object",
      properties: {
        program_handle: { type: "string", description: "Handle del programa (sin @). Ej: vercel, cloudflare, shopify" },
        title: { type: "string", description: "Título descriptivo de la vulnerabilidad" },
        description: { type: "string", description: "Reporte completo en formato Pentestify" },
        severity: { type: "string", description: "Severidad: low, medium, high, critical" },
        weaknes: { type: "string", description: "Tipo de debilidad: XSS, SQLi, IDOR, etc" }
      },
      required: ["program_handle", "title", "description"]
    }
  }
};

export async function executeHackeroneReport(params: HackeroneReportParams): Promise<string> {
  const apiToken = process.env.HACKERONE_API_TOKEN;
  const apiUsername = process.env.HACKERONE_USERNAME;

  if (!apiToken || !apiUsername) {
    throw new Error("No están configuradas las credenciales de HackerOne. Configura HACKERONE_API_TOKEN y HACKERONE_USERNAME en las variables de entorno.");
  }

  const programHandle = params.program_handle.replace(/^@/, "");
  
  const reportData = {
    data: {
      type: "report",
      attributes: {
        title: params.title,
        description: params.description,
        severity: params.severity,
        weaknes: params.weaknes || "other",
        source: "api"
      },
      relationships: {
        program: {
          data: {
            handle: programHandle
          }
        }
      }
    }
  };

  try {
    const response = await fetch(`${HACKERONE_API_BASE}/hackathons/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(`${apiUsername}:${apiToken}`).toString("base64")}`
      },
      body: JSON.stringify(reportData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error de HackerOne: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return `[Éxito] Reporte enviado a HackerOne programa @${programHandle}. ID: ${result.data?.id || "desconocido"}. Estado: Pendiente de revisión.`;
  } catch (error: any) {
    console.error("Error enviando a HackerOne:", error);
    return `[Error] No se pudo enviar el reporte: ${error.message}`;
  }
}

export async function searchHackeronePrograms(query: string): Promise<string> {
  const apiToken = process.env.HACKERONE_API_TOKEN;
  const apiUsername = process.env.HACKERONE_USERNAME;

  if (!apiToken || !apiUsername) {
    return "Credenciales de HackerOne no configuradas.";
  }

  try {
    const response = await fetch(`${HACKERONE_API_BASE}/programs?q=${encodeURIComponent(query)}`, {
      headers: {
        "Authorization": `Basic ${Buffer.from(`${apiUsername}:${apiToken}`).toString("base64")}`
      }
    });

    if (!response.ok) {
      return `Error al buscar programas: ${response.status}`;
    }

    const data = await response.json();
    if (data.data && data.data.length > 0) {
      const programs = data.data.map((p: any) => 
        `- @${p.attributes.handle}: ${p.attributes.name}`
      ).join("\n");
      return `Programas encontrados:\n${programs}`;
    }

    return "No se encontraron programas.";
  } catch (error: any) {
    return `Error buscando programas: ${error.message}`;
  }
}