import dns from "dns/promises";
import net from "net";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

// --- Tool Definitions ---

export const whoisLookupToolDef = {
  type: "function" as const,
  function: {
    name: "whois_lookup",
    description: "Obtiene información de registro WHOIS de un dominio usando la API de HackerTarget.",
    parameters: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          description: "El dominio a consultar (ej. google.com)"
        }
      },
      required: ["domain"]
    }
  }
};

export const dnsLookupToolDef = {
  type: "function" as const,
  function: {
    name: "dns_lookup",
    description: "Resuelve los registros DNS (A, AAAA, MX, TXT, NS) de un dominio.",
    parameters: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          description: "El dominio a consultar (ej. google.com)"
        }
      },
      required: ["domain"]
    }
  }
};

export const portScannerToolDef = {
  type: "function" as const,
  function: {
    name: "port_scanner",
    description: "Escanea puertos comunes (21, 22, 25, 53, 80, 110, 443, 3306, 3389, 8080) en un objetivo para ver cuáles están abiertos.",
    parameters: {
      type: "object",
      properties: {
        target: {
          type: "string",
          description: "IP o dominio objetivo (ej. 8.8.8.8 o google.com)"
        }
      },
      required: ["target"]
    }
  }
};

export const httpHeadersScannerToolDef = {
  type: "function" as const,
  function: {
    name: "http_headers_scanner",
    description: "Analiza las cabeceras HTTP de una URL para buscar medidas de seguridad o información del servidor.",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "La URL completa a analizar (ej. https://google.com)"
        }
      },
      required: ["url"]
    }
  }
};

export const subdomainSearchToolDef = {
  type: "function" as const,
  function: {
    name: "subdomain_search",
    description: "Busca subdominios conocidos asociados a un dominio principal usando la API de HackerTarget.",
    parameters: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          description: "El dominio principal (ej. google.com)"
        }
      },
      required: ["domain"]
    }
  }
};

export const nmapToolDef = {
  type: "function" as const,
  function: {
    name: "nmap_scan",
    description: "Ejecuta un escaneo real usando el binario Nmap del sistema.",
    parameters: {
      type: "object",
      properties: {
        target: {
          type: "string",
          description: "La IP o dominio a escanear."
        },
        flags: {
          type: "string",
          description: "Los flags de nmap (ej. '-sS -O' o '-p-'). Por defecto '-sV'."
        }
      },
      required: ["target"]
    }
  }
};

// --- Implementations ---

export async function executeWhoisLookup(domain: string): Promise<string> {
  try {
    const response = await fetch(`https://api.hackertarget.com/whois/?q=${encodeURIComponent(domain)}`);
    if (!response.ok) return `Error al consultar HackerTarget: ${response.statusText}`;
    const data = await response.text();
    // La API a veces devuelve "error check your api key" si llegamos al rate limit
    if (data.includes("error")) return `Aviso: Posible límite de consultas en la API o error interno. Resultado crudo: ${data}`;
    return data.substring(0, 3000); // Truncar para evitar sobrepasar contexto
  } catch (err: any) {
    return `Error ejecutando WHOIS: ${err.message}`;
  }
}

export async function executeDnsLookup(domain: string): Promise<string> {
  let result = `Registros DNS para ${domain}:\n`;
  try {
    // A records
    try { const a = await dns.resolve4(domain); result += `- A: ${a.join(", ")}\n`; } catch (e) {}
    // AAAA records
    try { const aaaa = await dns.resolve6(domain); result += `- AAAA: ${aaaa.join(", ")}\n`; } catch (e) {}
    // MX records
    try { const mx = await dns.resolveMx(domain); result += `- MX: ${mx.map(m => `${m.exchange} (prioridad ${m.priority})`).join(", ")}\n`; } catch (e) {}
    // TXT records
    try { const txt = await dns.resolveTxt(domain); result += `- TXT: \n  ${txt.map(t => t.join("")).join("\n  ")}\n`; } catch (e) {}
    // NS records
    try { const ns = await dns.resolveNs(domain); result += `- NS: ${ns.join(", ")}\n`; } catch (e) {}

    return result || "No se encontraron registros DNS comunes.";
  } catch (err: any) {
    return `Error resolviendo DNS para ${domain}: ${err.message}`;
  }
}

export async function executePortScanner(target: string): Promise<string> {
  const commonPorts = [21, 22, 25, 53, 80, 110, 443, 3306, 3389, 8080];
  const openPorts: number[] = [];
  const closedPorts: number[] = [];

  const checkPort = (port: number): Promise<void> => {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(2000); // 2 segundos max
      
      socket.on('connect', () => {
        openPorts.push(port);
        socket.destroy();
        resolve();
      });
      
      socket.on('timeout', () => {
        closedPorts.push(port);
        socket.destroy();
        resolve();
      });
      
      socket.on('error', () => {
        closedPorts.push(port);
        socket.destroy();
        resolve();
      });
      
      socket.connect(port, target);
    });
  };

  try {
    await Promise.all(commonPorts.map(checkPort));
    return `Resultados del escaneo de puertos en ${target}:\n- Puertos Abiertos: ${openPorts.length > 0 ? openPorts.join(", ") : "Ninguno de los escaneados"}\n- Puertos Cerrados/Filtrados: ${closedPorts.join(", ")}`;
  } catch (err: any) {
    return `Error en escaneo de puertos: ${err.message}`;
  }
}

export async function executeHttpHeadersScanner(url: string): Promise<string> {
  try {
    if (!url.startsWith("http")) url = "https://" + url;
    const response = await fetch(url, { method: "HEAD", redirect: "follow" });
    const headersObj: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headersObj[key] = value;
    });
    
    // Convertir a string
    const headersStr = Object.entries(headersObj).map(([k, v]) => `${k}: ${v}`).join("\n");
    return `Cabeceras HTTP de ${url} (Status: ${response.status}):\n${headersStr}\n\nRevisa si faltan cabeceras de seguridad como Strict-Transport-Security, Content-Security-Policy o X-Frame-Options.`;
  } catch (err: any) {
    return `Error al obtener cabeceras HTTP: ${err.message}`;
  }
}

export async function executeSubdomainSearch(domain: string): Promise<string> {
  try {
    const response = await fetch(`https://api.hackertarget.com/hostsearch/?q=${encodeURIComponent(domain)}`);
    if (!response.ok) return `Error al consultar HackerTarget: ${response.statusText}`;
    const data = await response.text();
    if (data.includes("error")) return `Aviso: Posible límite de consultas en la API o error interno. Resultado: ${data}`;
    
    const lines = data.split("\n");
    if (lines.length > 50) {
      return `Se encontraron múltiples subdominios. Primeros 50 resultados:\n${lines.slice(0, 50).join("\n")}\n...y más.`;
    }
    return `Subdominios encontrados:\n${data}`;
  } catch (err: any) {
    return `Error ejecutando búsqueda de subdominios: ${err.message}`;
  }
}

export async function executeNmap(target: string, flags: string = "-sV"): Promise<string> {
  // Validación muy básica para prevenir inyección de comandos
  if (/[;&|`]/.test(target) || /[;&|`]/.test(flags)) {
    return "Error: Inyección de comandos detectada o caracteres inválidos.";
  }
  
  try {
    const command = `nmap ${flags} ${target}`;
    const { stdout, stderr } = await execPromise(command, { timeout: 30000 }); // 30s max
    if (stderr && !stdout) {
      return `Nmap arrojó errores: ${stderr}`;
    }
    
    // Si el output es muy largo, recortamos
    if (stdout.length > 3500) {
      return `Output de nmap demasiado largo. Primeros 3500 caracteres:\n${stdout.substring(0, 3500)}\n...`;
    }
    return `Resultado de nmap:\n${stdout}`;
  } catch (error: any) {
    if (error.message.includes("not found") || error.message.includes("is not recognized")) {
      return "Error: El binario 'nmap' no está instalado o no se encuentra en el PATH del sistema hospedador. Pide al administrador que lo instale.";
    }
    return `Error al ejecutar Nmap: ${error.message}`;
  }
}
