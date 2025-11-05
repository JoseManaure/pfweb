"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiMongodb, SiTailwindcss } from "react-icons/si";
import Script from "next/script";

// ✅ Tipos
type Message = {
  role: "user" | "assistant";
  content: string;
  time: string; // 🕒 hora
};

// ✅ Tech stack
const techProject = [
  { name: "React", icon: <FaReact className="text-sky-500" /> },
  { name: "Node.js", icon: <FaNodeJs className="text-green-600" /> },
  { name: "MongoDB", icon: <SiMongodb className="text-emerald-700" /> },
  { name: "TailwindCSS", icon: <SiTailwindcss className="text-sky-400" /> },
];

// ✅ Sugerencias iniciales
const initialSuggestions = [
  "Hola",
  "Cuéntame sobre tu experiencia",
  "Háblame de React",
  "Qué haces con Node.js",
  "Proyectos destacados",
  "Descargar CV",
  "UI/UX",
];

// 🕒 Función para obtener la hora actual
function getCurrentTime(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Hero() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions);
  const [sessionId] = useState(() => crypto.randomUUID()); // identificador único de sesión
  const toggleChat = () => setIsOpen(!isOpen);

  // URL configurable del backend
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  // 👋 Mensaje de bienvenida
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

  // 🧭 Auto-scroll
  useEffect(() => {
    const chatContainer = document.getElementById("chat-messages");
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [messages]);

  // ✅ Función principal: SSE si está disponible, fallback fetch normal
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      time: getCurrentTime(),
    };
    const assistantMessage: Message = {
      role: "assistant",
      content: "",
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    const prompt = input.trim();
    setInput("");

    // 👇 Intentamos SSE primero
    if (typeof EventSource !== "undefined") {
      try {
        const evtSource = new EventSource(
          `${BACKEND_URL}/api/chat-sse?prompt=${encodeURIComponent(
            prompt
          )}&sessionId=${sessionId}`
        );

        let fullReply = "";

        evtSource.onmessage = (event) => {
          if (event.data === "[FIN]") {
            evtSource.close();
            return;
          }
          fullReply += event.data + " ";
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

        evtSource.onerror = (err) => {
          console.error("❌ Error SSE:", err);
          evtSource.close();
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content:
                "❌ Error SSE. Intentando fallback fetch normal...",
              time: getCurrentTime(),
            };
            return updated;
          });
          // fallback fetch
          fallbackFetch(prompt);
        };
        return;
      } catch (err) {
        console.warn("❌ SSE falló, usando fetch normal:", err);
        fallbackFetch(prompt);
      }
    } else {
      fallbackFetch(prompt);
    }
  };

  const fallbackFetch = async (prompt: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, sessionId }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: data.reply || "Sin respuesta",
          time: getCurrentTime(),
        };
        return updated;
      });
    } catch (err) {
      console.error("❌ Error fetch fallback:", err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "❌ Error conectando al backend.",
          time: getCurrentTime(),
        };
        return updated;
      });
    }
  };

  return (
    <section
      id="inicio"
      className="flex items-center justify-center min-h-[90vh] bg-gray-50 dark:bg-[#0a0f1a] px-6 relative transition-colors duration-500"
    >
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
            Diseño y desarrollo sistemas robustos con{" "}
            <strong>React</strong>, <strong>Node.js</strong> y{" "}
            <strong>MongoDB</strong>, aplicando principios de arquitectura
            limpia y optimización full cycle.
          </p>
        </div>
      </div>

      {/* 💬 Chat */}
      <div className="fixed bottom-5 right-5 z-50">
        {isOpen ? (
          <div className="w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                💬 Asistente
              </span>
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
                <div
                  key={i}
                  className={`mb-2 ${m.role === "user" ? "text-right" : "text-left"
                    }`}
                >
                  <span
                    className={`inline-block px-3 py-2 rounded-xl max-w-[85%] break-words whitespace-pre-wrap ${m.role === "user"
                      ? "bg-blue-100 dark:bg-sky-800 text-gray-800 dark:text-gray-200"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                      }`}
                  >
                    {m.content}
                  </span>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {m.time}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setInput(e.target.value)
                  }
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
