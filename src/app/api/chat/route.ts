import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { personalContext } from "@/data/context";

const MISTRAL_API_URL = "https://6da3ae57a7fe.ngrok-free.app/api/chat-json";

// 🧠 Diccionario local
const dictionary = [
  { question: "hola", answer: "¡Hola! 👋 Soy tu asistente virtual. Pregúntame sobre mis proyectos, experiencia o tecnologías." },
  { question: "experiencia", answer: "Tengo más de 15 años de experiencia como desarrollador full stack, trabajando con React, Node.js y MongoDB." },
  { question: "react", answer: "React es mi principal herramienta para construir interfaces dinámicas y rápidas con excelente experiencia de usuario." },
  { question: "node", answer: "Node.js me permite crear el backend de mis aplicaciones full stack, gestionando APIs y servidores eficientemente." },
];

// 💬 Sugerencias predefinidas
const suggestions = [
  "¿Cuánta experiencia tienes?",
  "Háblame de tus proyectos",
  "¿Qué haces con React?",
  "¿Cuál es tu app más destacada?",
  "¿Puedo ver tu CV?",
];

// 🧩 Tipos
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatDocument {
  userId: string;
  messages: ChatMessage[];
}

// 🔍 Funciones auxiliares
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

function getSmartAnswer(userMessage: string) {
  let bestScore = 0;
  let bestAnswer = "No tengo una respuesta concreta para eso todavía.";
  for (const item of dictionary) {
    const score = jaccardSimilarity(userMessage, item.question);
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = item.answer;
    }
  }
  return bestAnswer;
}

// 🔗 Consultar Mistral con timeout y manejo de errores
async function askMistral(message: string): Promise<string> {
  const controller = new AbortController();
  const TIMEOUT_MS = 15000; // 15 segundos de espera máximo
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const auth = "usuario:clave123"; // si usas Basic Auth
    const encoded = Buffer.from(auth).toString("base64");

    console.log("⏱ Enviando request a Mistral...");
    const start = Date.now();

    const res = await fetch(MISTRAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${encoded}`,
      },
      body: JSON.stringify({ prompt: `${personalContext}\nUsuario: ${message}` }),
      signal: controller.signal,
    });

    const duration = Date.now() - start;
    console.log(`✅ Respuesta recibida en ${duration}ms`);

    if (!res.ok) {
      console.warn(`⚠️ Respuesta HTTP no OK: ${res.status}`);
      return "No pude conectar con el modelo Mistral. Pero puedo responder sobre José y sus proyectos.";
    }

    const data = await res.json();
    if (data?.reply) return data.reply.trim();
    return "No encontré una respuesta exacta.";
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error("❌ Timeout: la API de Mistral no respondió a tiempo");
    } else if (error?.cause?.code === "UND_ERR_SOCKET") {
      console.log("ℹ️ Error de socket ignorado");
    } else {
      console.error("❌ Error al consultar Mistral:", error);
    }
    return "No pude conectar con el modelo Mistral. Pero puedo responder sobre José y sus proyectos.";
  } finally {
    clearTimeout(timeout);
  }
}


// 📩 Endpoint principal
export async function POST(req: NextRequest) {
  try {
    const { messages, userId } = (await req.json()) as { messages: ChatMessage[]; userId?: string };
    const userMessage = messages?.length ? messages[messages.length - 1].content : "";

    if (!userMessage) {
      return NextResponse.json({
        message: { role: "assistant", content: "Mensaje vacío" },
        suggestions,
      });
    }

    // 1️⃣ Respuesta local
    let aiResponse = getSmartAnswer(userMessage);

    // 2️⃣ Si es vaga o corta, llama a Mistral
    if (aiResponse.includes("No tengo") || aiResponse.length < 30) {
      aiResponse = await askMistral(userMessage);
    }

    // 3️⃣ Guardar chat en MongoDB
    if (userId) {
      const client = await clientPromise;
      const db = client.db("portfolio");
      const collection = db.collection<ChatDocument>("chats");

      const userMsg: ChatMessage = { role: "user", content: userMessage, timestamp: new Date() };
      const assistantMsg: ChatMessage = { role: "assistant", content: aiResponse, timestamp: new Date() };

      await collection.updateOne(
        { userId },
        { $push: { messages: { $each: [userMsg, assistantMsg] } } },
        { upsert: true }
      );
    }

    return NextResponse.json({
      message: { role: "assistant", content: aiResponse },
      suggestions,
    });
  } catch (error: any) {
    console.error("❌ Error en API chat:", error);
    return NextResponse.json({
      message: { role: "assistant", content: `Error procesando tu mensaje: ${error.message}` },
      suggestions,
    });
  }
}
