import Database from "better-sqlite3";
import { config, adminUserIds } from "../config.js";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const dbDir = path.dirname(config.DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(config.DB_PATH);

export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      role TEXT CHECK(role IN ('system', 'user', 'assistant', 'tool')) NOT NULL,
      content TEXT,
      tool_calls TEXT,
      tool_call_id TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);

    CREATE TABLE IF NOT EXISTS users (
      telegram_id INTEGER PRIMARY KEY
    );

    CREATE TABLE IF NOT EXISTS invites (
      code TEXT PRIMARY KEY,
      used_by INTEGER DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS moltbook_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submolt TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// ------ AUTORIZACIÓN E INVITACIONES ------
export function isAdmin(userId: number): boolean {
  return adminUserIds.includes(userId);
}

export function isUserAllowed(userId: number): boolean {
  if (isAdmin(userId)) return true;
  const stmt = db.prepare("SELECT 1 FROM users WHERE telegram_id = ?");
  return stmt.get(userId) !== undefined;
}

export function createInvite(): string {
  const code = crypto.randomBytes(4).toString("hex"); // ej: a1b2c3d4
  const stmt = db.prepare("INSERT INTO invites (code) VALUES (?)");
  stmt.run(code);
  return code;
}

export function useInvite(code: string, userId: number): boolean {
  const check = db.prepare("SELECT code, used_by FROM invites WHERE code = ?").get(code) as any;
  if (!check) return false;
  if (check.used_by !== null) return false; // Ya usada

  const transaction = db.transaction(() => {
    db.prepare("UPDATE invites SET used_by = ? WHERE code = ?").run(userId, code);
    db.prepare("INSERT OR IGNORE INTO users (telegram_id) VALUES (?)").run(userId);
  });
  
  transaction();
  return true;
}

// ------ MENSAJES ------
export function saveMessage(sessionId: string, role: string, content: string | null = null, toolCalls: string | null = null, toolCallId: string | null = null) {
  const stmt = db.prepare(`
    INSERT INTO messages (session_id, role, content, tool_calls, tool_call_id)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(sessionId, role, content, toolCalls, toolCallId);
}

export function getSessionMessages(sessionId: string, limit: number = 30) {
  const stmt = db.prepare(`
    SELECT role, content, tool_calls, tool_call_id
    FROM (
      SELECT * FROM messages
      WHERE session_id = ?
      ORDER BY id DESC
      LIMIT ?
    )
    ORDER BY id ASC
  `);
  const rows = stmt.all(sessionId, limit) as any[];

  return rows.map(row => {
    const msg: any = { role: row.role };
    if (row.content !== null) msg.content = row.content;
    if (row.tool_calls) msg.tool_calls = JSON.parse(row.tool_calls);
    if (row.tool_call_id) msg.tool_call_id = row.tool_call_id;
    return msg;
  });
}

export function clearSession(sessionId: string) {
  const stmt = db.prepare("DELETE FROM messages WHERE session_id = ?");
  stmt.run(sessionId);
}

// ------ MOLTBOOK ------
export function insertMoltbookPost(submolt: string, content: string) {
  const stmt = db.prepare("INSERT INTO moltbook_posts (submolt, content) VALUES (?, ?)");
  stmt.run(submolt, content);
}
