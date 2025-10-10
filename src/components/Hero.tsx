import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiMongodb, SiTailwindcss, SiDocker } from "react-icons/si";

const tech = [
  { name: "React", icon: <FaReact className="w-5 h-5 text-blue-500" /> },
  { name: "Node.js", icon: <FaNodeJs className="w-5 h-5 text-green-600" /> },
  { name: "MongoDB", icon: <SiMongodb className="w-5 h-5 text-emerald-700" /> },
  { name: "TailwindCSS", icon: <SiTailwindcss className="w-5 h-5 text-sky-400" /> },
  { name: "Docker", icon: <SiDocker className="w-5 h-5 text-sky-600" /> },
];

const strengths = [
  "Diseño de APIs robustas y escalables",
  "Optimización de rendimiento y seguridad",
  "Integración con bases de datos SQL y NoSQL",
  "Testing y despliegue en entornos productivos",
  "Arquitecturas limpias y mantenibles",
];

export default function Hero() {
  return (
    <section
      id="inicio"
      className="flex items-center justify-center min-h-[80vh] bg-gray-50 px-6"
    >
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

        {/* Columna izquierda: Texto, botones y fortalezas */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug">
            Construyo <span className="text-brandBlue">soluciones web escalables</span> y seguras
          </h1>

          <p className="text-gray-700 text-base md:text-lg max-w-md">
            Desarrollador <strong>Full Stack </strong> — React · Node.js · MongoDB · arquitecturas escalables.
            Diseño soluciones que priorizan rendimiento, seguridad y mantención.
          </p>

          {/* Botones */}
          <div className="flex flex-wrap gap-3 mt-2">
            <a
              href="#proyectos"
              className="px-5 py-2 bg-brandBlue text-black rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Ver proyectos
            </a>
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 border border-brandBlue text-brandBlue rounded-lg font-medium hover:bg-brandLight transition"
            >
              Descargar CV
            </a>
          </div>

          {/* Características / fortalezas */}
          <ul className="mt-4 space-y-2 text-gray-700 text-sm md:text-base">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-brandBlue font-bold">•</span> {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Columna derecha: Tecnologías */}
        <div className="flex flex-wrap gap-3 justify-start md:justify-end mt-4 md:mt-0">
          {tech.map((t) => (
            <div
              key={t.name}
              className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
            >
              {t.icon}
              {t.name}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
