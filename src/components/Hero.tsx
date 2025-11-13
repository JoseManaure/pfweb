"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiMongodb, SiTailwindcss } from "react-icons/si";

type Message = { role: "user" | "assistant"; content: string; time: string };

function getCurrentTime(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Hero() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const prompt = input.trim();
    const userMessage: Message = { role: "user", content: prompt, time: getCurrentTime() };
    const assistantMessage: Message = { role: "assistant", content: "", time: getCurrentTime() };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
    setIsTyping(true);

    const backendBase =
      process.env.NODE_ENV === "production"
        ? "https://portfolio-server-production-67e9.up.railway.app"
        : process.env.LOCAL_BACKEND_URL || "https://portfolio-server-production-67e9.up.railway.app";

    const sseUrl = `${backendBase}/api/chat-sse?prompt=${encodeURIComponent(prompt)}&sessionId=${sessionId}`;
    const eventSource = new EventSource(sseUrl);

    let fullReply = "";

    eventSource.onmessage = (event) => {
      const chunk = event.data;
      if (chunk === "[FIN]") {
        setIsTyping(false);
        eventSource.close();
        return;
      }
      fullReply += " " + chunk;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = fullReply.trim();
        return updated;
      });
    };

    eventSource.onerror = (err) => {
      console.error("❌ SSE frontend error:", err);
      setIsTyping(false);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = "❌ Error conectando con el servidor.";
        return updated;
      });
      eventSource.close();
    };
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { role: "assistant", content: "👋 Hola! Soy tu asistente IA. Pregúntame lo que quieras sobre mis proyectos o experiencia.", time: getCurrentTime() },
      ]);
    }
  }, []);

  useEffect(() => {
    const chatContainer = document.getElementById("chat-messages");
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [messages, isTyping]);

  return (
    <section className="flex items-center justify-center min-h-[90vh] bg-gray-50 dark:bg-[#0a0f1a] px-6 relative transition-colors duration-500">
      <div className="fixed bottom-5 right-5 z-50">
        {isOpen ? (
          <div className="w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700 dark:text-gray-200">💬 Asistente</span>
              <button onClick={toggleChat} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm">✕</button>
            </div>
            <div className="h-64 overflow-y-auto mb-2" id="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`mb-2 ${m.role === "user" ? "text-right" : "text-left"}`}>
                  <span className={`inline-block px-3 py-2 rounded-xl max-w-[85%] break-words whitespace-pre-wrap ${m.role === "user" ? "bg-blue-100 dark:bg-sky-800 text-gray-800 dark:text-gray-200" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}>
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
            <div className="flex gap-2">
              <input value={input} onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Escribe tu mensaje..." className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brandBlue/40" />
              <button onClick={sendMessage} className="px-3 py-2 bg-brandBlue text-white rounded-lg hover:bg-blue-700 transition text-sm">➤</button>
            </div>
          </div>
        ) : (
          <button onClick={toggleChat} className="bg-brandBlue text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform">💬</button>
        )}
      </div>
    </section>
  );
}
