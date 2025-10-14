"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-black/60 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* === LOGO === */}
        <Link href="/" className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 128 128"
            className="h-6 w-6"
          >
            <path
              fill={currentTheme === "dark" ? "#fff" : "#000"}
              d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0Zm0 116C35.4 116 12 92.6 12 64S35.4 12 64 12s52 23.4 52 52-23.4 52-52 52Z"
            />
          </svg>
          <span className="text-[17px] font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Jose <span className="font-normal text-gray-500 dark:text-gray-400">Manaure</span>
          </span>
        </Link>

        {/* === NAV LINKS === */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700 dark:text-gray-300">
          <a href="#inicio" className="hover:text-black dark:hover:text-white transition-colors">
            Inicio
          </a>
          <a href="#proyectos" className="hover:text-black dark:hover:text-white transition-colors">
            Proyectos
          </a>
          <a href="#servicios" className="hover:text-black dark:hover:text-white transition-colors">
            Servicios
          </a>
          <a href="#contacto" className="hover:text-black dark:hover:text-white transition-colors">
            Contacto
          </a>
        </nav>

        {/* === ACTIONS === */}
        <div className="flex items-center space-x-3">
          {/* Tema */}
          <button
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Cambiar tema"
          >
            {currentTheme === "dark" ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-gray-700" />
            )}
          </button>

          {/* Botón CTA (opcional como Next.js “Get Started”) */}
          <a
            href="#contacto"
            className="hidden md:inline-block px-3 py-1.5 text-sm font-medium rounded-md bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition"
          >
            Contactar
          </a>

          {/* Menú móvil */}
          <div className="md:hidden">
            <button
              aria-label="Abrir menú"
              className="p-2 border rounded-md border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200"
            >
              ☰
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
