import { executeToolWrapper } from './dist/tools/index.js';

async function test() {
    console.log("Iniciando escaneo rápido con Aegis (Nmap) hacia scanme.nmap.org...");
    try {
        const result = await executeToolWrapper("nmap_scan", { target: "scanme.nmap.org", flags: "-F" });
        console.log("===============================");
        console.log("✅ RESULTADO DEL ESCANEO:");
        console.log(result);
        console.log("===============================");
    } catch (e) {
        console.error("❌ Error:", e);
    }
}
test();
