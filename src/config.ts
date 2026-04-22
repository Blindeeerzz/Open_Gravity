import { z } from "zod";

const envSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1, "Debe proveer un TELEGRAM_BOT_TOKEN base"),
  TELEGRAM_BOT_TOKEN_MARK: z.string().optional(),
  TELEGRAM_BOT_TOKEN_UNI: z.string().optional(),
  TELEGRAM_BOT_TOKEN_CONST: z.string().optional(),
  TELEGRAM_ADMIN_IDS: z.string().min(1, "Debe proveer IDs de administradores (separadas por coma)"),
  HUGGINGFACE_API_KEY: z.string().min(1, "Debe proveer una clave HUGGINGFACE_API_KEY"),
  OPENROUTER_API_KEY: z.string().optional(),
  HUGGINGFACE_MODEL: z.string().default("meta-llama/Meta-Llama-3-8B-Instruct"),
  OPENROUTER_MODEL: z.string().default("openrouter/free"),
  DB_PATH: z.string().default("./memory.db"),
  GROQ_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  GOOGLE_CLIENT_EMAIL: z.string().optional(),
  GOOGLE_PRIVATE_KEY: z.string().optional(),
  GOOGLE_CALENDAR_ID: z.string().optional().default("primary"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  GOOGLE_SHEET_ID: z.string().optional()
});

export const config = envSchema.parse(process.env);

export const adminUserIds = config.TELEGRAM_ADMIN_IDS.split(",").map(id => parseInt(id.trim(), 10));
