import fs from "fs";
import path from "path";

const KNOWLEDGE_FILE = "./knowledge_base.json";

interface KnowledgeEntry {
  id: string;
  category: string;
  content: string;
  source: string;
  createdAt: string;
}

function loadKnowledgeBase(): KnowledgeEntry[] {
  try {
    if (fs.existsSync(KNOWLEDGE_FILE)) {
      const data = fs.readFileSync(KNOWLEDGE_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error loading knowledge base:", e);
  }
  return [];
}

function saveKnowledgeBase(entries: KnowledgeEntry[]): void {
  fs.writeFileSync(KNOWLEDGE_FILE, JSON.stringify(entries, null, 2));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const addKnowledgeToolDef = {
  type: "function",
  function: {
    name: "add_knowledge",
    description: "Añade nuevo conocimiento a la base de conocimientos del agente. Úsalo cuando el usuario te proporcione información importante, metodologías, procedimientos, o documentación que debas recordar para tareas futuras.",
    parameters: {
      type: "object",
      properties: {
        category: { type: "string", description: "Categoría del conocimiento (ej: 'red_team', 'bug_bounty', 'metodologia', 'procedimientos')" },
        content: { type: "string", description: "El contenido o conocimiento a guardar" },
        source: { type: "string", description: "Fuente de la información (ej: 'video_youtube', 'documentacion', 'experiencia')" }
      },
      required: ["category", "content"]
    }
  }
};

export const deleteKnowledgeToolDef = {
  type: "function",
  function: {
    name: "delete_knowledge",
    description: "Elimina conocimiento obsoleto de la base de conocimientos. Usa el ID del entry para eliminarlo específicamente.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string", description: "ID del conocimiento a eliminar" },
        category: { type: "string", description: "Categoría de donde eliminar (opcional)" }
      },
      required: ["id"]
    }
  }
};

export const searchKnowledgeToolDef = {
  type: "function",
  function: {
    name: "search_knowledge",
    description: "Busca en la base de conocimientos del agente. Úsalo cuando necesites consultar metodologías, procedimientos o información guardada previamente.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Palabras clave a buscar" },
        category: { type: "string", description: "Categoría específica (opcional)" }
      },
      required: ["query"]
    }
  }
};

export const listKnowledgeCategoriesToolDef = {
  type: "function",
  function: {
    name: "list_knowledge_categories",
    description: "Lista todas las categorías disponibles en la base de conocimientos y cuántos entries tiene cada una.",
    parameters: {
      type: "object",
      properties: {}
    }
  }
};

export async function executeAddKnowledge(args: any): Promise<string> {
  const { category, content, source } = args;
  
  if (!category || !content) {
    return "Error: Se requiere categoría y contenido.";
  }

  const entries = loadKnowledgeBase();
  const newEntry: KnowledgeEntry = {
    id: generateId(),
    category: category.toLowerCase(),
    content,
    source: source || "manual",
    createdAt: new Date().toISOString()
  };

  entries.push(newEntry);
  saveKnowledgeBase(entries);

  return `[Éxito] Conocimiento añadido a la categoría '${category}'. ID: ${newEntry.id}. Total entries: ${entries.length}`;
}

export async function executeDeleteKnowledge(args: any): Promise<string> {
  const { id, category } = args;
  
  if (!id) {
    return "Error: Se requiere el ID del conocimiento a eliminar.";
  }

  const entries = loadKnowledgeBase();
  const initialLength = entries.length;
  const filtered = entries.filter(e => e.id !== id);
  
  if (filtered.length === initialLength) {
    return `Error: No se encontró ningún conocimiento con ID '${id}'.`;
  }

  saveKnowledgeBase(filtered);
  return `[Éxito] Conocimiento con ID '${id}' eliminado.`;
}

export async function executeSearchKnowledge(args: any): Promise<string> {
  const { query, category } = args;
  
  if (!query) {
    return "Error: Se requiere una búsqueda.";
  }

  const entries = loadKnowledgeBase();
  const queryLower = query.toLowerCase();
  
  let results = entries.filter(e => {
    const matchesQuery = e.content.toLowerCase().includes(queryLower) || 
                         e.category.toLowerCase().includes(queryLower);
    const matchesCategory = category ? e.category.toLowerCase() === category.toLowerCase() : true;
    return matchesQuery && matchesCategory;
  });

  if (results.length === 0) {
    return "No se encontró ningún conocimiento relacionado con la búsqueda.";
  }

  // Limit to top 5 results
  results = results.slice(0, 5);

  const formatted = results.map(e => 
    `[${e.category.toUpperCase()}] (ID: ${e.id})\n${e.content.substring(0, 500)}${e.content.length > 500 ? '...' : ''}`
  ).join("\n\n---\n\n");

  return `Resultados de búsqueda para "${query}" (${results.length} encontrados):\n\n${formatted}`;
}

export async function executeListKnowledgeCategories(): Promise<string> {
  const entries = loadKnowledgeBase();
  
  if (entries.length === 0) {
    return "La base de conocimientos está vacía.";
  }

  const categories: Record<string, number> = {};
  entries.forEach(e => {
    categories[e.category] = (categories[e.category] || 0) + 1;
  });

  const formatted = Object.entries(categories)
    .map(([cat, count]) => `- ${cat}: ${count} entries`)
    .join("\n");

  return `Categorías en la base de conocimientos:\n\n${formatted}\n\nTotal: ${entries.length} entries`;
}