import { projects } from "../data/projects";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

export default function Projects() {
  return (
    <section id="proyectos" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
          Proyectos Destacados
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((p) => (
            <article
              key={p.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">{p.title}</h3>
                <p className="text-gray-600 mt-3">{p.summary}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {p.demo && (
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-brandBlue text-black rounded-lg inline-flex items-center gap-2 hover:bg-blue-700 transition"
                  >
                    <FaExternalLinkAlt /> Demo
                  </a>
                )}
                {p.repo && (
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 border border-gray-300 text-gray-800 rounded-lg inline-flex items-center gap-2 hover:bg-gray-100 transition"
                  >
                    <FaGithub /> Código
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
