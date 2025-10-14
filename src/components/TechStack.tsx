"use client";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiMongodb, SiTailwindcss, SiDocker } from "react-icons/si";

const tech = [
  { name: "React", icon: <FaReact className="w-7 h-7 text-sky-500 dark:text-sky-400" /> },
  { name: "Node.js", icon: <FaNodeJs className="w-7 h-7 text-green-600 dark:text-green-500" /> },
  { name: "MongoDB", icon: <SiMongodb className="w-7 h-7 text-emerald-600 dark:text-emerald-500" /> },
  { name: "TailwindCSS", icon: <SiTailwindcss className="w-7 h-7 text-sky-500 dark:text-sky-400" /> },
  { name: "Docker", icon: <SiDocker className="w-7 h-7 text-sky-600 dark:text-sky-500" /> },
];

export default function TechStack() {
  return (
    <section
      id="servicios"
      className="py-24 bg-gray-50 text-gray-800 dark:bg-[#0a0a0a] dark:text-gray-300 relative overflow-hidden transition-colors duration-500"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">
          Stack & Especialidades
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Tecnologías y herramientas que uso en proyectos de producción.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {tech.map((t) => (
            <div
              key={t.name}
              className="relative group p-[2px] rounded-2xl
                         bg-gradient-to-br from-transparent via-transparent to-transparent
                         hover:via-[#0070f3]/30 hover:to-[#0070f3]/50
                         transition-all duration-500"
            >
              <div
                className="flex flex-col items-center justify-center gap-3 rounded-2xl
                           bg-white dark:bg-[#111] p-6 h-full w-full
                           group-hover:shadow-[0_0_20px_#0070f3aa] transition-shadow duration-500"
              >
                <div className="p-3 bg-gray-100 dark:bg-[#1a1a1a] rounded-full group-hover:bg-[#e6f0ff] dark:group-hover:bg-[#0e1a2b] transition-colors">
                  {t.icon}
                </div>
                <div className="text-sm font-medium">{t.name}</div>
              </div>

              {/* Efecto “rayo” animado (usa clase de animación que depende de keyframes definidos abajo) */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[#0070f3]/30 to-transparent opacity-0 group-hover:opacity-100 blur-sm animate-shine" />
            </div>
          ))}
        </div>
      </div>

      {/* keyframes: usamos <style> normal (NO styled-jsx) para evitar romper el build */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        /* clase utilitaria local para aplicar la animación (evita usar styled-jsx) */
        .animate-shine {
          animation: shine 1.5s linear infinite;
        }
      `}</style>
    </section>
  );
}
