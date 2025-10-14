"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { FaReact, FaNodeJs, FaExternalLinkAlt } from "react-icons/fa";
import { SiMongodb, SiTailwindcss } from "react-icons/si";
import Script from "next/script";

// ✅ Tipos
type Message = {
  role: "user" | "assistant";
  content: string;
};

// ✅ Tech stack proyecto
const techProject = [
  { name: "React", icon: <FaReact className="text-sky-500" /> },
  { name: "Node.js", icon: <FaNodeJs className="text-green-600" /> },
  { name: "MongoDB", icon: <SiMongodb className="text-emerald-700" /> },
  { name: "TailwindCSS", icon: <SiTailwindcss className="text-sky-400" /> },
];

// ✅ Declaración global para GA
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export default function Hero() {
  // Chat AI
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input) return;
    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...newMessages,
        { role: "assistant", content: data.message?.content || "Respuesta vacía" },
      ]);
    } catch (error) {
      console.error("Error al llamar al endpoint de chat:", error);
    }
  };

  // Scroll automático al último mensaje
  useEffect(() => {
    const chatContainer = document.getElementById("chat-messages");
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [messages]);

  // Google Analytics
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", "TU-GA4-ID");
  }, []);

  const trackClick = (label: string) => {
    if (window.gtag) {
      window.gtag("event", "click", { category: "Interacción", label });
    }
  };

  return (
    <section
      id="inicio"
      className="flex items-center justify-center min-h-[90vh] 
      bg-gray-50 dark:bg-[#0a0f1a] px-6 relative transition-colors duration-500"
    >
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=TU-GA4-ID`}
      />

<div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
  {/* Hero principal */}
  <div className="max-w-2xl space-y-6">
    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-snug transition-colors">
      Full Stack Engineer enfocado en{" "}
      <span className="text-brandBlue dark:text-sky-400">
        rendimiento, escalabilidad y experiencia de usuario
      </span>
    </h1>
    <p className="text-lg text-gray-700 dark:text-gray-300">
      Diseño y desarrollo sistemas robustos con <strong>React</strong>, <strong>Node.js</strong> y{" "}
      <strong>MongoDB</strong>, aplicando principios de arquitectura limpia y optimización full cycle.
    </p>

    {/* Botones */}
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      <a
        href="#proyecto-inventario"
        onClick={() => trackClick("Proyecto destacado")}
        className="px-5 py-2 bg-brandBlue text-yellow rounded-lg font-medium 
        hover:bg-blue-700 hover:text-white transition-colors"
      >
        Inventario App
      </a>
      <a
        href="./cv.pdf"
        onClick={() => trackClick("Descargar CV")}
        target="_blank"
        rel="noreferrer"
        className="px-5 py-2 border border-brandBlue text-brandBlue rounded-lg font-medium 
        hover:bg-brandLight dark:hover:bg-sky-900 transition-colors"
      >
        Descargar CV
      </a>
    </div>
  </div>

      </div>

      {/* 💬 Chat flotante */}
      <div className="fixed bottom-5 right-5 z-50">
        {isOpen ? (
          <div className="w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
                          rounded-2xl shadow-lg p-4 flex flex-col transition-colors duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
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

            {/* Mensajes */}
            <div className="h-64 overflow-y-auto mb-3" id="chat-messages">
              {messages.length === 0 && (
                <p className="text-gray-400 dark:text-gray-500 text-sm text-center mt-6">
                  👋 Hola! Pregúntame sobre mi experiencia o proyectos.
                </p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`mb-2 ${m.role === "user" ? "text-right" : "text-left"}`}>
                  <span
                    className={`inline-block px-3 py-2 rounded-xl max-w-[85%] ${
                      m.role === "user"
                        ? "bg-blue-100 dark:bg-sky-800 text-gray-800 dark:text-gray-200"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {m.content}
                  </span>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Escribe tu mensaje..."
                className="flex-1 border border-gray-300 dark:border-gray-700 
                           bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                           rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 
                           focus:ring-brandBlue/40 transition-colors"
              />
              <button
                onClick={sendMessage}
                className="px-3 py-2 bg-brandBlue text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                ➤
              </button>
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
