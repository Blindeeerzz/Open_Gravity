import { z } from "zod";

const envSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1, "Debe proveer un TELEGRAM_BOT_TOKEN"),
  TELEGRAM_ADMIN_IDS: z.string().min(1, "Debe proveer IDs de administradores (separadas por coma)"),
  HUGGINGFACE_API_KEY: z.string().min(1, "Debe proveer una clave HUGGINGFACE_API_KEY"),
  OPENROUTER_API_KEY: z.string().optional(),
  HUGGINGFACE_MODEL: z.string().default("meta-llama/Meta-Llama-3-8B-Instruct"),
  OPENROUTER_MODEL: z.string().default("openrouter/free"),
  DB_PATH: z.string().default("./memory.db"),
  GROQ_API_KEY: z.string().min(1, "Debe proveer una GROQ_API_KEY para Audio y Visión")
});

export const config = envSchema.parse(process.env);

export const adminUserIds = config.TELEGRAM_ADMIN_IDS.split(",").map(id => parseInt(id.trim(), 10));
