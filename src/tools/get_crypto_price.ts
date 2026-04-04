import { z } from "zod";

export const getCryptoPriceToolDef = {
  type: "function",
  function: {
    name: "get_crypto_price",
    description: "Obtiene el precio actual en vivo de mercado de cualquier criptomoneda contra USDT usando la API de pública de Binance. IMPORTANTE: Debes proporcionar el ticket en mayúsculas (ej. 'BTC', 'ETH', 'SOL').",
    parameters: {
      type: "object",
      properties: {
        symbol: { 
          type: "string", 
          description: "El ticker de la criptomoneda (ej. 'BTC', 'ETH'). No añadas 'USDT' al final, la herramienta lo hace por ti."
        }
      },
      required: ["symbol"]
    }
  }
};

export async function executeGetCryptoPrice(symbol: string): Promise<string> {
  const cleanSymbol = symbol.toUpperCase().trim();
  const pair = `${cleanSymbol}USDT`;
  console.log(`[Tool] Buscando precio de ${pair} en Binance...`);

  try {
    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${pair}`);
    
    if (!response.ok) {
      if (response.status === 400) {
        return `Error: El símbolo ${cleanSymbol} no existe en Binance o no tiene par contra USDT. Intenta con otro o verifica si es muy nuevo.`;
      }
      throw new Error(`Error de red HTTP ${response.status}`);
    }

    const data = await response.json();
    const price = parseFloat(data.price).toLocaleString("en-US", { style: "currency", currency: "USD" });
    
    return `EL PRECIO ACTUAL EN DIRECTO de ${cleanSymbol} es de ${price}. Basa tu siguiente respuesta al inversor usando este dato exacto y actualizado a este instante.`;

  } catch (error: any) {
    console.error("[GetCryptoPrice Error]:", error);
    return `Hubo un error contactando a la API de Binance: ${error.message}. Usa tu mejor juicio histórico pero avisa de que el precio en vivo falló.`;
  }
}
