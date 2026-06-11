import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function deployAgentZero(task: string): Promise<string> {
    // Escapar comillas simples para evitar inyecciones en el comando bash
    const cleanTask = task.replace(/'/g, "'\\''");
    
    // Al estar en el mismo servidor de Oracle montado con el socket de Docker, 
    // podemos ejecutar directamente 'docker exec' hacia el contenedor de agent_zero.
    const command = `docker exec -d agent_zero python main.py '${cleanTask}'`;
    
    try {
        await execAsync(command);
        return "SUCCESS: La orden ha sido enviada a Agent Zero. La artillería pesada está trabajando en segundo plano en la nube y te enviará los resultados mediante la acción '/raw_report' cuando termine. NO TE QUEDES ESPERANDO, sigue con otras tareas.";
    } catch (error: any) {
        return `ERROR: Fallo al contactar con Agent Zero: ${error.message}`;
    }
}

export const agentZeroToolDefinition = {
  type: "function" as const,
  function: {
    name: "deploy_agent_zero",
    description: "Despliega la artillería pesada (Agent Zero) en el servidor de Oracle para realizar escaneos profundos, investigaciones largas o fuerza bruta. Úsalo SIEMPRE que detectes una anomalía o necesites delegar trabajo pesado.",
    parameters: {
      type: "object",
      properties: {
        task: {
          type: "string",
          description: "La misión detallada que Agent Zero debe ejecutar. Ejemplo: 'Escanea todos los puertos de target.com y busca vulnerabilidades CVE. Cuando termines, usa tu herramienta send_to_aegis para enviarme los resultados.'",
        },
      },
      required: ["task"],
    },
  },
};
