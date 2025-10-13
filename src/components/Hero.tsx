"use client";

import { useState, useEffect } from "react";
import { FaReact, FaNodeJs, FaExternalLinkAlt } from "react-icons/fa";
import { SiMongodb, SiTailwindcss } from "react-icons/si";
import Script from "next/script";

const techProject = [
  { name: "React", icon: <FaReact className="text-sky-500" /> },
  { name: "Node.js", icon: <FaNodeJs className="text-green-600" /> },
  { name: "MongoDB", icon: <SiMongodb className="text-emerald-700" /> },
  { name: "TailwindCSS", icon: <SiTailwindcss className="text-sky-400" /> },
];

export default function Hero() {
  // ✅ Chat AI
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: "assistant", content: data.message.content }]);
    } catch (error) {
      console.error("Error al llamar al endpoint de chat:", error);
    }
  };

  // ✅ Google Analytics
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "TU-GA4-ID"); // Reemplaza con tu GA4 ID
  }, []);

  const trackClick = (label) => {
    if (window.gtag) {
      window.gtag("event", "click", {
        category: "Interacción",
        label,
      });
    }
  };

  return (
    <section id="inicio" className="flex items-center justify-center min-h-[90vh] bg-gray-50 px-6 relative">
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=TU-GA4-ID`}
      />

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Columna izquierda: presentación + proyecto */}
        <div className="space-y-8">
          {/* Presentación */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug">
              Full Stack Engineer enfocado en{" "}
              <span className="text-brandBlue">rendimiento, escalabilidad y experiencia de usuario</span>
            </h1>
            <p className="text-lg text-gray-700 mt-2">
              Diseño y desarrollo sistemas robustos con <strong>React</strong>, <strong>Node.js</strong> y <strong>MongoDB</strong>,
              aplicando principios de arquitectura limpia y optimización full cycle.
            </p>

            {/* Botones profesionales */}
            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href="#proyecto-inventario"
                onClick={() => trackClick("Proyecto destacado")}
                className="px-5 py-2 bg-brandBlue text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Ver proyecto destacado
              </a>
              <a
                href="./cv.pdf"
                onClick={() => trackClick("Descargar CV")}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 border border-brandBlue text-brandBlue rounded-lg font-medium hover:bg-brandLight transition"
              >
                Descargar CV
              </a>
              <a
                href="https://pfweb-nu.vercel.app/"
                onClick={() => trackClick("Ver Portafolio completo")}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                Ver Portafolio completo
              </a>
            </div>
          </div>

          {/* Proyecto destacado */}
          <div
            id="proyecto-inventario"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
          >
            <div className="aspect-video bg-gray-100">
              <img
                src="/images/inventario-preview.png"
                alt="Proyecto Inventario"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                🏪 Sistema de Inventario — Rasiva SPA
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Aplicación web completa para control de stock, rutas de despacho y gestión de ventas.
                Desarrollada con React, Node.js, MongoDB y TailwindCSS.
              </p>

              {/* Stack del proyecto */}
              <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
                {techProject.map((t) => (
                  <span key={t.name} className="flex items-center gap-1">
                    {t.icon} {t.name}
                  </span>
                ))}
              </div>

              <a
                href="https://pfweb-nu.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-brandBlue hover:underline font-medium"
              >
                Ver proyecto <FaExternalLinkAlt className="ml-1 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Columna derecha: preview CV */}
        <div className="bg-white shadow-sm rounded-2xl p-8 border border-gray-100">
          <h3 className="text-xl font-semibold text-brandBlue mb-3">Preview de mi CV</h3>
          <p className="text-gray-700 text-sm mb-3 leading-relaxed">
            <strong>Comercial Rasiva SPA (2024 – Actualidad)</strong> — Desarrollo completo de una aplicación web de inventario
            con React, Node.js, MongoDB y TailwindCSS. Implementé rutas de despacho, control de stock y pagos seguros con Stripe.
          </p>
          <p className="text-gray-700 text-sm mb-4 leading-relaxed">
            <strong>Proyectos personales (2021 – 2024)</strong> — Aplicaciones full stack con conexión a bases de datos,
            enfoque en rendimiento, seguridad y diseño responsive.
          </p>
          <p className="text-gray-600 text-sm mb-4">
            <strong>Habilidades:</strong> React · Node.js · TypeScript · MongoDB · Express · TailwindCSS · Firebase · Git/GitHub
          </p>
          <div className="text-gray-700 text-sm mb-4">
            <strong>Idiomas:</strong> Español (nativo) · Inglés (intermedio)
          </div>
          <div className="mt-6 flex flex-col gap-2 text-sm">
            <a href="https://github.com/JoseManaure" target="_blank" rel="noreferrer" className="text-brandBlue hover:underline">
              🔗 GitHub: JoseManaure
            </a>
            <a href="https://www.linkedin.com/in/josemanaure/" target="_blank" rel="noreferrer" className="text-brandBlue hover:underline">
              🔗 LinkedIn: josemanaure
            </a>
            <a href="https://pfweb-nu.vercel.app/" target="_blank" rel="noreferrer" className="text-brandBlue hover:underline">
              🌐 Portafolio: pfweb-nu.vercel.app
            </a>
          </div>
          <a href="./cv.pdf" target="_blank" rel="noreferrer" className="inline-block mt-6 px-5 py-2 bg-brandBlue text-white text-sm rounded-full shadow hover:bg-brandBlue/90 transition">
            Ver CV completo →
          </a>
        </div>
      </div>

      {/* Chat interactivo */}
      <div className="fixed bottom-5 right-5 w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50">
        <div className="h-64 overflow-y-auto mb-3">
          {messages.map((m, i) => (
            <div key={i} className={`mb-2 ${m.role === "user" ? "text-right" : "text-left"}`}>
              <span className={`inline-block px-3 py-2 rounded-lg ${m.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}>
                {m.content}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregúntame sobre mi portafolio"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
          />
          <button onClick={sendMessage} className="px-3 py-2 bg-brandBlue text-white rounded-lg">
            Enviar
          </button>
        </div>
      </div>
    </section>
  );
}
