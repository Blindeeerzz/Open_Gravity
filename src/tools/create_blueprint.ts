import { z } from "zod";
import fs from "fs";
import path from "path";
import { InputFile } from "grammy";
import { botConst } from "../bot_const.js";

export const createBlueprintSchema = z.object({
  nombre_archivo: z.string().describe("Nombre del archivo SVG a generar (ej. plano_distribucion.svg)"),
  svg_content: z.string().describe("El XML del SVG que representa el plano (debe incluir width, height, rects, lines, text para dimensiones, etc. con fondo oscuro o transparente y líneas en cian/blanco estilo arquitectónico)"),
  explicacion: z.string().describe("Explicación de las medidas, distribución y decisiones de inmótica tomadas")
});

export type CreateBlueprintParams = z.infer<typeof createBlueprintSchema>;

export const createBlueprintToolDef = {
  type: "function" as const,
  function: {
    name: "crear_plano",
    description: "Genera un plano vectorial profesional (formato SVG) a partir de las especificaciones de obra o bocetos a mano alzada analizados, y lo envía al usuario en Telegram.",
    parameters: {
      type: "object",
      properties: {
        nombre_archivo: { type: "string", description: "Nombre del archivo (ej: plano_sala.svg)" },
        svg_content: { type: "string", description: "Código SVG XML del plano. Usa un diseño premium estilo Blueprint: fondo oscuro (#030510), líneas cian (#00f0ff) o blancas, y texto de dimensiones claro." },
        explicacion: { type: "string", description: "Explicación del plano, cotas y detalles de domótica/inmótica." }
      },
      required: ["nombre_archivo", "svg_content", "explicacion"]
    }
  }
};

export async function executeCreateBlueprint(params: CreateBlueprintParams, sessionId: string = ""): Promise<string> {
  try {
    const filename = params.nombre_archivo.endsWith(".svg") ? params.nombre_archivo : `${params.nombre_archivo}.svg`;
    const tempDir = path.resolve("./temp_blueprints");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const filePath = path.join(tempDir, `${Date.now()}_${filename}`);
    
    // Guardar el archivo SVG
    fs.writeFileSync(filePath, params.svg_content, "utf-8");
    console.log(`[CreateBlueprint] Archivo guardado en ${filePath}`);

    // Si la sesión es de Telegram (sessionId tiene formato [userId]_const)
    if (sessionId && sessionId.endsWith("_const")) {
      const userIdStr = sessionId.replace("_const", "");
      const userId = parseInt(userIdStr, 10);
      
      if (botConst && !isNaN(userId)) {
        console.log(`[CreateBlueprint] Enviando documento SVG al usuario ${userId} vía Telegram...`);
        // Enviar un mensaje de aviso
        await botConst.api.sendMessage(userId, `📐 *Plano Vectorial Generado:* ${filename}\n${params.explicacion}`, { parse_mode: "Markdown" });
        // Enviar el archivo SVG
        await botConst.api.sendDocument(userId, new InputFile(filePath));
        
        // Limpiar archivo temporal
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        
        return `[Éxito] El plano '${filename}' ha sido creado y enviado directamente al chat del usuario por Telegram.`;
      }
    }

    return `[Éxito] El plano ha sido generado en el servidor en la ruta: ${filePath}. Explicación: ${params.explicacion}`;
  } catch (error: any) {
    console.error("Error en executeCreateBlueprint:", error);
    return `[Error] No se pudo crear el plano: ${error.message}`;
  }
}
