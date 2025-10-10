import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Jose Manaure — Portafolio',
  description: 'Portafolio Full Stack Senior — React · Node.js · MongoDB'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased bg-gray-50">
        <Navbar />
        <main className="pt-20">{children}</main> {/* pt-20 = 5rem */}
        <Footer />
      </body>
    </html>
  );
}
