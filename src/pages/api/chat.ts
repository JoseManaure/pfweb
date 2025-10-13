// /src/pages/api/chat.ts
import { NextApiRequest, NextApiResponse } from "next";

// Endpoint simulado 100% local
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { messages } = req.body;

  console.log("Request recibida en /api/chat:", messages);

  try {
    const userMessage = messages[messages.length - 1]?.content || "";
    let simulatedResponse = "Lo siento, no entendí tu mensaje.";

    if (userMessage.toLowerCase().includes("react")) {
      simulatedResponse = "¡React es mi biblioteca favorita para interfaces!";
    } else if (userMessage.toLowerCase().includes("node")) {
      simulatedResponse = "Node.js es perfecto para backend rápido y escalable.";
    } else if (userMessage.toLowerCase().includes("mongo")) {
      simulatedResponse = "MongoDB es excelente para bases de datos NoSQL.";
    } else if (userMessage.toLowerCase().includes("hola")) {
      simulatedResponse = "¡Hola! ¿Cómo puedo ayudarte con mi portafolio?";
    }

    const responseMessage = { role: "assistant", content: simulatedResponse };

    console.log("Response enviada desde /api/chat:", responseMessage);

    res.status(200).json({ message: responseMessage });
  } catch (error) {
    console.error("Error en chat simulado:", error);
    res.status(500).json({ error: "Error en el chat simulado" });
  }
}
