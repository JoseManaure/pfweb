import Hero from "../components/Hero";
import TechStack from "../components/TechStack";
import Projects from "../components/Projects";

export default function Page() {
  return (
    <>
      {/* Hero / Inicio */}
      <section id="inicio" className="pt-20">
        <Hero />
      </section>

      {/* Tech Stack / Servicios */}
      <section id="servicios" className="py-16 bg-gray-50">
        <TechStack />
      </section>

      {/* Proyectos Destacados */}
      <section id="proyectos" className="py-16">
        <Projects />
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">Contacto</h2>
          <p className="text-gray-700 mb-6">
            GitHub:{" "}
            <a
              className="text-brandBlue underline"
              href="https://github.com/JoseManaure/"
              target="_blank"
              rel="noreferrer"
            >
              JoseManaure
            </a>{" "}
            | LinkedIn:{" "}
            <a
              className="text-brandBlue underline"
              href="https://www.linkedin.com/in/josemanaure/"
              target="_blank"
              rel="noreferrer"
            >
              josemanaure
            </a>
          </p>
         
        </div>
      </section>
    </>
  );
}
