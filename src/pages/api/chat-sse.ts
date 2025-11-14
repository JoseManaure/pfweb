import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { personalContext } from "@/data/context";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { prompt, sessionId } = req.query;

    if (!prompt || typeof prompt !== "string") {
        res.status(400).end("Missing prompt");
        return;
    }

    console.log("💬 Mensaje recibido:", prompt);

    // === SSE HEADERS ===
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
    });

    function send(data: string) {
        res.write(`data: ${data}\n\n`);
    }

    function end() {
        send("[FIN]");
        res.end();
    }

    // === LÓGICA DE RESPUESTAS RÁPIDAS ===

    const dictionary = [
        { question: "hola", answer: "¡Hola! 👋 Soy tu asistente virtual." },
        { question: "experiencia", answer: "Tengo más de 15 años de experiencia como desarrollador full stack." },
        { question: "react", answer: "React es mi principal herramienta de frontend." },
        { question: "node", answer: "Node.js me permite crear el backend de mis aplicaciones." },
    ];

    function tokenize(str: string) {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/\W+/).filter(Boolean);
    }

    function jaccardSimilarity(a: string, b: string) {
        const setA = new Set(tokenize(a));
        const setB = new Set(tokenize(b));
        const intersection = new Set([...setA].filter(x => setB.has(x)));
        const union = new Set([...setA, ...setB]);
        return union.size === 0 ? 0 : intersection.size / union.size;
    }

    function getSmartAnswer(msg: string) {
        let best = { score: 0, answer: "" };
        for (const pair of dictionary) {
            const score = jaccardSimilarity(msg, pair.question);
            if (score > best.score) best = { score, answer: pair.answer };
        }
        return best.score > 0.3 ? best.answer : null;
    }

    const quick = getSmartAnswer(prompt);
    if (quick) {
        send(JSON.stringify({ choices: [{ delta: { content: quick } }] }));
        end();
        return;
    }

    // === PETICIÓN A MISTRAL ===
    try {
        const llm = await fetch(process.env.MISTRAL_API_URL!, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: personalContext },
                    { role: "user", content: prompt },
                ],
                stream: true,
            }),
        });

        if (!llm.body) {
            send("Error: No response body");
            end();
            return;
        }

        const reader = llm.body.getReader();
        const decoder = new TextDecoder();

        let partial = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            partial += chunk;

            const lines = partial.split("\n");
            partial = lines.pop() || "";

            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    send(line.replace("data: ", ""));
                }
            }
        }

        end();
    } catch (err) {
        console.error("❌ SSE error:", err);
        send("Error procesando tu mensaje.");
        end();
    }
}
