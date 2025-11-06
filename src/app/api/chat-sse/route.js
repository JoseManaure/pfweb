// app/api/chat-sse/route.js
import { personalContext } from "@/data/context";

const MISTRAL_API_URL =
    process.env.MISTRAL_API_URL || "https://seven-apples-draw.loca.lt/api/chat";

export const runtime = "nodejs"; // importante: no "edge"

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const prompt = searchParams.get("prompt") || "";
    const sessionId = searchParams.get("sessionId");

    const encoder = new TextEncoder();

    // Creamos el stream SSE
    const stream = new ReadableStream({
        async start(controller) {
            try {
                // --- Primera respuesta inmediata
                controller.enqueue(encoder.encode(`data: Pensando en tu pregunta...\n\n`));

                // --- Llamada al modelo remoto (Mistral)
                const res = await fetch(MISTRAL_API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        prompt: `${personalContext}\nUsuario: ${prompt}`,
                    }),
                });

                if (!res.ok) {
                    controller.enqueue(
                        encoder.encode(`data: Error al conectar con el modelo Mistral.\n\n`)
                    );
                    controller.close();
                    return;
                }

                const reader = res.body.getReader();
                const decoder = new TextDecoder();
                let fullResponse = "";

                // --- Leemos el stream remoto en chunks
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    fullResponse += chunk;
                    controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
                }

                // --- Fin del stream
                controller.enqueue(encoder.encode(`data: [FIN]\n\n`));
                controller.close();
            } catch (err) {
                console.error("❌ Error SSE:", err);
                controller.enqueue(
                    encoder.encode(`data: Error procesando la conexión SSE.\n\n`)
                );
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
