import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiMongodb, SiTailwindcss, SiDocker } from "react-icons/si";

const tech = [
  { name: "React", icon: <FaReact className="w-6 h-6 text-blue-500" /> },
  { name: "Node.js", icon: <FaNodeJs className="w-6 h-6 text-green-600" /> },
  { name: "MongoDB", icon: <SiMongodb className="w-6 h-6 text-emerald-700" /> },
  { name: "TailwindCSS", icon: <SiTailwindcss className="w-6 h-6 text-sky-400" /> },
  { name: "Docker", icon: <SiDocker className="w-6 h-6 text-sky-600" /> },
];

export default function TechStack() {
  return (
    <section id="servicios" className="py-20 bg-brandLight/40">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">Stack & Especialidades</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Tecnologías y prácticas que aplico en proyectos de producción.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {tech.map((t) => (
            <div key={t.name} className="card flex flex-col items-center justify-center gap-3">
              <div className="p-3 bg-white rounded-full">{t.icon}</div>
              <div className="text-sm font-semibold">{t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
