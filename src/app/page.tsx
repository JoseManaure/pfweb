import Hero from "../components/Hero";
import TechStack from "../components/TechStack";
import Projects from "../components/Projects";
import "./globals.css";

export default function Page() {
  return (
    <main className="flex flex-col">
      {/* Hero / Inicio */}
      <section id="inicio" className=" bg-white">
        <Hero />
      </section>

      {/* Proyectos Destacados */}
      <section
        id="proyectos"
        className="py-12 bg-white border-t border-gray-100"
      >
        <Projects />
      </section>

      {/* Tech Stack / Servicios */}
      <section
        id="servicios"
        className="py-12 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100"
      >
        <TechStack />
      </section>

      {/* Contacto */}
      <section
        id="contacto"
        className="py-12 bg-gradient-to-t from-gray-50 to-white border-t border-gray-100"
      >
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-3 text-gray-800">
            Contacto
          </h2>
          <p className="text-gray-600 mb-4">
            GitHub:{" "}
            <a
              className="text-brandBlue font-medium hover:underline"
              href="https://github.com/JoseManaure/"
              target="_blank"
              rel="noreferrer"
            >
              JoseManaure
            </a>{" "}
            | LinkedIn:{" "}
            <a
              className="text-brandBlue font-medium hover:underline"
              href="https://www.linkedin.com/in/josemanaure/"
              target="_blank"
              rel="noreferrer"
            >
              josemanaure
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
