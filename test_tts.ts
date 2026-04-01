import { generateSpeechFromText } from "./src/agent/voice_generator.js";

async function test() {
  try {
    const path = await generateSpeechFromText("Hola, esto es una prueba");
    console.log("Exito:", path);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
