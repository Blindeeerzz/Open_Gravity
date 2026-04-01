import * as cheerio from "cheerio";
import TurndownService from "turndown";

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

export const navegarWebTool = {
  type: "function",
  function: {
    name: "navegar_web",
    description: "Visita una URL de internet y extrae su contenido de texto. Útil para leer noticias, revisar foros de inversión o artículos de interés.",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "La URL completa a visitar",
        },
      },
      required: ["url"],
    },
  },
};

export async function executeNavegarWeb(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      return `❌ Error al acceder a la página: ${response.status} ${response.statusText}`;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Eliminar scripts, estilos, iframes, navs, y anuncios para dejar el texto limpio
    $('script, style, noscript, iframe, nav, footer, header, aside, .ad, .ads, .advertisement').remove();

    const cleanHtml = $('body').html();
    if (!cleanHtml) return "La página parece estar vacía o bloqueada.";

    let markdown = turndownService.turndown(cleanHtml);
    
    // Limitar la longitud y limpiar excesos de espacios
    markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();
    if (markdown.length > 20000) {
      markdown = markdown.substring(0, 20000) + "\n\n... [Contenido truncado artificialmente].";
    }

    return markdown;
  } catch (error: any) {
    return `❌ Error interno al navegar: ${error.message}`;
  }
}
