import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { personalContext } from "@/data/context";

const MISTRAL_API_URL =
  process.env.MISTRAL_API_URL || "https://every-wasps-write.loca.lt/api/chat";
const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL || "https://a430c7531532.ngrok-free.app/webhook/chat";

type ChatMessage = { role: "user" | "assistant"; content: string; timestamp: Date };
type ChatDocument = { userId: string; messages: ChatMessage[] };

const dictionary: { question: string; answer: string }[] = [
  { question: "hola", answer: "¡Hola! 👋 Soy tu asistente virtual. Pregúntame sobre mis proyectos o experiencia." },
  { question: "experiencia", answer: "Tengo más de 15 años de experiencia como desarrollador full stack, trabajando con React, Node.js y MongoDB." },
  { question: "react", answer: "React es mi principal herramienta para construir interfaces dinámicas y rápidas." },
  { question: "node", answer: "Node.js me permite crear el backend de mis aplicaciones full stack." },
];

const suggestions: string[] = [
  "¿quiero contratar tus servicios?",
  "Háblame de tus proyectos",
  "¿Qué haces con React?",
  "¿Cuál es tu app más destacada?",
];

// Flujo de contacto
const contactFields = ["nombre", "apellido", "email", "asunto"] as const;
type ContactField = typeof contactFields[number];
const contactQuestions: Record<ContactField, string> = {
  nombre: "¡Hola! Para poder contactarte, ¿cuál es tu nombre?",
  apellido: "Perfecto, ¿y tu apellido?",
  email: "Gracias. ¿Cuál es tu correo electrónico?",
  asunto: "Finalmente, ¿cuál es el asunto de tu mensaje?",
};
type ContactSession = { currentField: number; data: Record<ContactField, string> };
const contactSessions = new Map<string, ContactSession>();




// ------------------- UTILIDADES -------------------

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

async function askMistral(message: string): Promise<string> {



  try {
    const res = await fetch(MISTRAL_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: `${personalContext}\nUsuario: ${message}` }),
    });

    if (!res.ok) return "No pude conectar con el modelo Mistral.";
    const text = await res.text();
    return text.replace(/^data:\s*/gm, "").trim();
  } catch (err) {
    console.error("❌ Error Mistral:", err);
    return "No pude conectar con el modelo Mistral.";
  }
}

async function notifyN8n(message: string, title: string = "Nuevo mensaje") {
  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, message }),
    });
    if (!res.ok) console.warn("⚠️ Webhook n8n devolvió", res.status);
    else console.log("✅ Webhook enviado correctamente a n8n:", message);
  } catch (err) {
    console.error("❌ Error enviando webhook a n8n:", err);
  }
}

// ------------------- HANDLER -------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, userId } = body as { messages?: ChatMessage[]; userId?: string };
    const userMessage = messages?.length ? messages[messages.length - 1].content : "";

    if (!userMessage)
      return Response.json({ message: { role: "assistant", content: "Mensaje vacío" }, suggestions }, { status: 400 });

    console.log("💬 Mensaje recibido:", userMessage);

    const triggerKeywords = ["contratar", "servicio", "precio", "presupuesto", "trabajar contigo", "cotización"];
    const normalize = (str: string) =>
      str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/g, "");
    const shouldTriggerWebhook = triggerKeywords.some(kw => normalize(userMessage).includes(normalize(kw)));

    let session = userId ? contactSessions.get(userId) : undefined;

    // Flujo de contacto
    if (shouldTriggerWebhook && !session && userId) {
      session = { currentField: 0, data: {} as Record<ContactField, string> };
      contactSessions.set(userId, session);
      return Response.json({
        message: { role: "assistant", content: contactQuestions[contactFields[0]] },
        suggestions,
      });
    }

    if (session && userId) {
      const field: ContactField = contactFields[session.currentField];
      session.data[field] = userMessage;
      session.currentField += 1;

      if (session.currentField < contactFields.length) {
        contactSessions.set(userId, session);
        return Response.json({
          message: { role: "assistant", content: contactQuestions[contactFields[session.currentField]] },
          suggestions,
        });
      } else {
        const finalMessage = session.data;
        await notifyN8n(`📩 Nuevo contacto:
      Nombre: ${finalMessage.nombre}
      Apellido: ${finalMessage.apellido}
      Email: ${finalMessage.email}
      Asunto: ${finalMessage.asunto}`, "Formulario completado");

        contactSessions.delete(userId);
        return Response.json({
          message: { role: "assistant", content: "¡Gracias! Tu mensaje ha sido enviado. Te contactaré pronto." },
          suggestions,
        });
      }
    }

    // Inteligencia
    let aiResponse = getSmartAnswer(userMessage);
    if (aiResponse.includes("No tengo") || aiResponse.length < 30)
      aiResponse = await askMistral(userMessage);

    // Guardar chat
    if (userId) {
      const client = await clientPromise;
      const db = client.db("portfolio");
      const collection = db.collection<ChatDocument>("chats");

      await collection.updateOne(
        { userId },
        {
          $push: {
            messages: {
              $each: [
                { role: "user", content: userMessage, timestamp: new Date() },
                { role: "assistant", content: aiResponse, timestamp: new Date() },
              ],
            },
          },
        },
        { upsert: true }
      );
    }

    return Response.json({ message: { role: "assistant", content: aiResponse }, suggestions });
  } catch (err) {
    console.error("❌ Error general en API /chat:", err);
    return Response.json({ message: { role: "assistant", content: "Error procesando tu mensaje." }, suggestions }, { status: 500 });
  }
}
