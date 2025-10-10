import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed w-full top-0 left-0 z-50 bg-white/70 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <span className="text-lg font-bold text-brandBlue">Jose Manaure</span>
        </Link>

        <nav className="hidden md:flex gap-6 text-sm font-medium text-[#123]">
          <a href="#inicio" className="hover:text-blue-600">Inicio</a>
          <a href="#servicios" className="hover:text-blue-600">Servicios</a>
          <a href="#proyectos" className="hover:text-blue-600">Proyectos</a>
          <a href="#contacto" className="hover:text-blue-600">Contacto</a>
        </nav>

        <div className="md:hidden">
          <button aria-label="menu" className="px-3 py-2 border rounded-md">Menu</button>
        </div>
      </div>
    </header>
  );
}
