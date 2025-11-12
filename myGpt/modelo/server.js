import express from "express";
import { spawn } from "child_process";
import path from "path";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4001;
const MODEL_PATH = path.join(process.cwd(), "llama.cpp/models/mistral-7b.gguf");

app.post("/api/chat", (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).send("Falta prompt");

    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
    });

    // Ejecuta llama.cpp (ajusta los flags según tu build)
    const cmd = spawn(path.join(process.cwd(), "llama.cpp/build/main"), [
        "-m", MODEL_PATH,
        "-p", prompt,
        "-t", "4",       // hilos
        "-b", "8",       // batch
    ]);

    cmd.stdout.on("data", (data) => {
        const text = data.toString().trim();
        if (!text) return;
        res.write(`data: ${text}\n\n`);
    });

    cmd.stderr.on("data", (err) => {
        console.error("❌ Modelo:", err.toString());
    });

    cmd.on("close", () => {
        res.write("data: [FIN]\n\n");
        res.end();
    });
});

app.listen(PORT, () => console.log(`🚀 Modelo Mistral SSE corriendo en puerto ${PORT}`));
