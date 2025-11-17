// src/app/layout.tsx
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CookieConsent from "@/components/CookieConsent";
import type { ReactNode } from "react";

export const metadata = {
  title: "Jose Manaure — Portafolio",
  description: "Portafolio Full Stack Senior — React · Node.js · MongoDB",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="pt-20">{children}</main>
          <Footer />
        </ThemeProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
