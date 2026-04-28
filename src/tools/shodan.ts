import { config } from "../config.js";

export const shodanToolDef = {
  type: "function" as const,
  function: {
    name: "shodan_search",
    description: "Busca información sobre una IP o dominio usando la API de Shodan (puertos abiertos, vulnerabilidades, etc).",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "La IP (ej. '8.8.8.8') o la consulta de búsqueda para Shodan."
        },
        type: {
          type: "string",
          enum: ["ip", "search"],
          description: "El tipo de búsqueda. 'ip' para buscar una IP específica, 'search' para una consulta general."
        }
      },
      required: ["query", "type"]
    }
  }
};

export async function executeShodanSearch(query: string, type: "ip" | "search"): Promise<string> {
  const apiKey = config.SHODAN_API_KEY;
  if (!apiKey) {
    return "Error: La clave SHODAN_API_KEY no está configurada en el archivo .env. Por favor, dile al usuario que la añada.";
  }

  try {
    let url = "";
    if (type === "ip") {
      url = `https://api.shodan.io/shodan/host/${encodeURIComponent(query)}?key=${apiKey}`;
    } else {
      url = `https://api.shodan.io/shodan/host/search?key=${apiKey}&query=${encodeURIComponent(query)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      return `Error en la API de Shodan: ${response.statusText} (${response.status})`;
    }

    const data = await response.json();
    
    // Simplificar la salida para no exceder los límites del LLM
    if (type === "ip") {
      return JSON.stringify({
        ip: data.ip_str,
        organization: data.org,
        isp: data.isp,
        os: data.os,
        ports: data.ports,
        hostnames: data.hostnames,
        vulns: data.vulns || []
      }, null, 2);
    } else {
      // Para búsquedas generales, devolver los primeros 5 resultados
      const results = (data.matches || []).slice(0, 5).map((match: any) => ({
        ip: match.ip_str,
        port: match.port,
        org: match.org,
        product: match.product,
        os: match.os
      }));
      return JSON.stringify({
        total: data.total,
        top_results: results
      }, null, 2);
    }
  } catch (error: any) {
    return `Excepción al ejecutar búsqueda en Shodan: ${error.message}`;
  }
}
