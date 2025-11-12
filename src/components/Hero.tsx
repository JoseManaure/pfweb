"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiMongodb, SiTailwindcss } from "react-icons/si";
import Script from "next/script";

type Message = {
  role: "user" | "assistant";
  content: string;
  time: string;
};

const techProject = [
  { name: "React", icon: <FaReact className="text-sky-500" /> },
  { name: "Node.js", icon: <FaNodeJs className="text-green-600" /> },
  { name: "MongoDB", icon: <SiMongodb className="text-emerald-700" /> },
  { name: "TailwindCSS", icon: <SiTailwindcss className="text-sky-400" /> },
];

const initialSuggestions = [
  "Hola",
  "Cuéntame sobre tu experiencia",
  "Háblame de React",
  "Qué haces con Node.js",
  "Proyectos destacados",
  "Descargar CV",
  "UI/UX",
];

function getCurrentTime(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Hero() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions);
  const [isTyping, setIsTyping] = useState(false); // 👈 nuevo estado
  const [sessionId] = useState(() => crypto.randomUUID());
  const toggleChat = () => setIsOpen(!isOpen);



  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "👋 Hola! Soy tu asistente IA. Pregúntame lo que quieras sobre mis proyectos o experiencia.",
          time: getCurrentTime(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    const chatContainer = document.getElementById("chat-messages");
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [messages, isTyping]); // 👈 también cuando cambia isTyping

  const triggerKeywords = ["contratar", "servicio", "precio", "presupuesto", "trabajar contigo", "cotización"];

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input, time: getCurrentTime() };
    const assistantMessage: Message = { role: "assistant", content: "", time: getCurrentTime() };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");

    const prompt = input.trim();
    const backendBase =
      process.env.NODE_ENV === "production"
        ? "https://portfolio-server-production-67e9.up.railway.app"
        : "https://dark-cups-hear.loca.lt";

    const shouldUseWebhook = triggerKeywords.some((kw) => prompt.toLowerCase().includes(kw));

    try {
      if (shouldUseWebhook) {
        console.log("📩 Enviando mensaje a flujo de contacto (Next API)...");
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: sessionId,
            messages: [...messages, { role: "user", content: prompt, time: getCurrentTime() }],
          }),
        });

        const data = await res.json();
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: data.message.content,
            time: getCurrentTime(),
          };
          return updated;
        });
        if (data.suggestions) setSuggestions(data.suggestions);
        return;
      }

      // 💬 Caso normal: usar SSE
      const sseUrl = `${backendBase}/api/chat-sse?prompt=${encodeURIComponent(prompt)}&sessionId=${sessionId}`;
      console.log("📡 Conectando SSE a:", sseUrl);

      const eventSource = new EventSource(sseUrl);
      let fullReply = "";
      setIsTyping(true); // 👈 empieza a escribir
      eventSource.onmessage = (event) => {
        let chunk = event.data;

        if (chunk === "[FIN]" || chunk.includes('"done":true')) {
          setIsTyping(false);
          eventSource.close();
          return;
        }

        if (isTyping) setIsTyping(false);

        // 🔹 Limpieza avanzada del texto
        chunk = chunk
          .replace(/^\[INST\][\s\S]*?\> /, "")       // eliminar tokens [INST]
          .replace(/\s+/g, " ")                       // normalizar espacios
          .replace(/([.,!?])(?=[^\s])/g, "$1 ")       // asegurar espacio después de signos
          .replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, "$1 $2") // separar si se pegan palabras con mayúscula
          .replace(/([a-z])([A-Z])/g, "$1 $2")        // casos tipo 'Manaureesun' -> 'Manaure es un'
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/[^\x20-\x7EáéíóúÁÉÍÓÚñÑüÜ¡¿]/g, "") // eliminar caracteres raros
          .trim();

        // 🔹 Verificar si hace falta espacio entre fragmentos
        const needsSpace =
          fullReply.length > 0 &&
          !fullReply.endsWith(" ") &&
          !chunk.startsWith(" ");

        fullReply += (needsSpace ? " " : "") + chunk;

        // 🔹 Evitar duplicación de espacios
        fullReply = fullReply.replace(/\s{2,}/g, " ");

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: fullReply.trim(),
            time: getCurrentTime(),
          };
          return updated;
        });
      };


      eventSource.onerror = (err) => {
        console.error("❌ Error SSE:", err);
        setIsTyping(false);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "❌ Error conectando con el servidor.",
            time: getCurrentTime(),
          };
          return updated;
        });
        eventSource.close();
      };
    } catch (err) {
      console.error("❌ Error enviando mensaje:", err);
      setIsTyping(false);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "❌ Error enviando mensaje.",
          time: getCurrentTime(),
        };
        return updated;
      });
    }
  };


  return (
    <section className="flex items-center justify-center min-h-[90vh] bg-gray-50 dark:bg-[#0a0f1a] px-6 relative transition-colors duration-500">
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=TU-GA4-ID"
      />

      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-snug transition-colors">
            Full Stack enfocado en{" "}
            <span className="text-brandBlue dark:text-sky-400">
              rendimiento, escalabilidad
            </span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Diseño y desarrollo sistemas robustos con <strong>React</strong>, <strong>Node.js</strong> y <strong>MongoDB</strong>, aplicando principios de arquitectura limpia y optimización full cycle.
          </p>
        </div>
      </div>

      {/* 💬 Chat */}
      <div className="fixed bottom-5 right-5 z-50">
        {isOpen ? (
          <div className="w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700 dark:text-gray-200">💬 Asistente</span>
              <button
                onClick={toggleChat}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm"
                title="Minimizar"
              >
                ✕
              </button>
            </div>

            <div className="h-64 overflow-y-auto mb-2" id="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`mb-2 ${m.role === "user" ? "text-right" : "text-left"}`}>
                  <span
                    className={`inline-block px-3 py-2 rounded-xl max-w-[85%] break-words whitespace-pre-wrap ${m.role === "user"
                      ? "bg-blue-100 dark:bg-sky-800 text-gray-800 dark:text-gray-200"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                      }`}
                  >
                    {m.content}
                  </span>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{m.time}</div>
                </div>
              ))}
              {isTyping && (
                <div className="text-left mb-2 text-gray-500 dark:text-gray-400 text-sm italic animate-pulse">
                  ✍️ Escribiendo...
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brandBlue/40"
                />
                <button
                  onClick={sendMessage}
                  className="px-3 py-2 bg-brandBlue text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  ➤
                </button>
              </div>

              {suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(s)}
                      className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={toggleChat}
            className="bg-brandBlue text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
            title="Abrir chat"
          >
            💬
          </button>
        )}
      </div>
    </section>
  );
}
