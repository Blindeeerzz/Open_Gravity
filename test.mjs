import fs from "fs";

async function run() {
  const mod = await import("pdf-parse");
  console.log("Keys:", Object.keys(mod));
  
  const extractor = mod.default || mod;
  console.log("Extractor type:", typeof extractor);
  
  if (typeof extractor === "function") {
    console.log("Ready to parse.");
  }
}
run();
