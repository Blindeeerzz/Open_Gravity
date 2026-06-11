import { z } from "zod";

const BUGCROWD_API_BASE = "https://api.bugcrowd.com/v1";

export const bugcrowdReportSchema = z.object({
  program_handle: z.string().describe("Handle del programa en Bugcrowd"),
  title: z.string().describe("Título de la vulnerabilidad"),
  description: z.string().describe("Descripción detallada en formato Pentestify"),
  severity: z.enum(["low", "medium", "high", "critical"]).optional(),
  weaknes: z.string().optional().describe("Tipo: XSS, SQLi, etc")
});

export type BugcrowdReportParams = z.infer<typeof bugcrowdReportSchema>;

export const bugcrowdReportToolDef = {
  type: "function",
  function: {
    name: "enviar_reporte_bugcrowd",
    description: "Envía un reporte de vulnerabilidad formateado en estándar Pentestify a la plataforma Bugcrowd.",
    parameters: {
      type: "object",
      properties: {
        program_handle: { type: "string", description: "Handle del programa (slug)" },
        title: { type: "string", description: "Título de la vulnerabilidad" },
        description: { type: "string", description: "Reporte completo en formato Pentestify" },
        severity: { type: "string", description: "Severidad: low, medium, high, critical" },
        weaknes: { type: "string", description: "Tipo de debilidad" }
      },
      required: ["program_handle", "title", "description"]
    }
  }
};

export async function executeBugcrowdReport(params: BugcrowdReportParams): Promise<string> {
  const apiToken = process.env.BUGCROWD_API_TOKEN;
  const apiUser = process.env.BUGCROWD_USERNAME;

  if (!apiToken || !apiUser) {
    throw new Error("No están configuradas las credenciales de Bugcrowd. Configura BUGCROWD_API_TOKEN y BUGCROWD_USERNAME.");
  }

  const programHandle = params.program_handle;
  
  const submissionData = {
    data: {
      type: "submission",
      attributes: {
        title: params.title,
        description: params.description,
        state: "pending"
      },
      relationships: {
        program: {
          data: {
            type: "program",
            handle: programHandle
          }
        }
      }
    }
  };

  try {
    const response = await fetch(`${BUGCROWD_API_BASE}/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/vnd.bugcrowd+json",
        "Authorization": `Token ${apiUser}:${apiToken}`
      },
      body: JSON.stringify(submissionData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error de Bugcrowd: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return `[Éxito] Reporte enviado a Bugcrowd programa @${programHandle}. ID: ${result.data?.id || "desconocido"}. Estado: Pendiente de revisión.`;
  } catch (error: any) {
    return `[Error] No se pudo enviar a Bugcrowd: ${error.message}`;
  }
}

export async function searchBugcrowdPrograms(query: string): Promise<string> {
  const apiToken = process.env.BUGCROWD_API_TOKEN;
  const apiUser = process.env.BUGCROWD_USERNAME;

  if (!apiToken || !apiUser) {
    return "Credenciales de Bugcrowd no configuradas.";
  }

  try {
    const response = await fetch(`${BUGCROWD_API_BASE}/programs`, {
      headers: {
        "Accept": "application/vnd.bugcrowd+json",
        "Authorization": `Token ${apiUser}:${apiToken}`
      }
    });

    if (!response.ok) return `Error: ${response.status}`;

    const data = await response.json();
    const programs = data.data?.filter((p: any) => 
      p.attributes.name.toLowerCase().includes(query.toLowerCase())
    ) || [];
    
    if (programs.length > 0) {
      return programs.map((p: any) => 
        `- @${p.attributes.handle}: ${p.attributes.name}`
      ).join("\n");
    }
    return "No se encontraron programas.";
  } catch (error: any) {
    return `Error: ${error.message}`;
  }
}