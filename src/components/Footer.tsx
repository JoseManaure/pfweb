export default function Footer() {
    return (
      <footer className="py-8 border-t border-gray-100 mt-12 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} José Gregorio Manaure Carvajal — Full Stack Senior · React & Node.js
          <div className="mt-2">
            <a className="mx-2 hover:text-blue-600" href="https://github.com/JoseManaure" target="_blank" rel="noreferrer">GitHub</a>
            <a className="mx-2 hover:text-blue-600" href="https://linkedin.com/in/josemanaure" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>
    );
  }
  