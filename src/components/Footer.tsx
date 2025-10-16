export default function Footer() {
  return (
    <footer className="py-8 border-t border-gray-200 dark:border-gray-800 mt-12 bg-white dark:bg-[#0a0f1a] transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()}{" "}
        <span className="font-medium text-gray-800 dark:text-gray-200">
          José Gregorio Manaure Carvajal
        </span>{" "}
        
        <div className="mt-3">
          <a
            className="mx-2 text-brandBlue dark:text-sky-400 hover:underline hover:text-blue-600 dark:hover:text-sky-300 transition-colors"
            href="https://github.com/JoseManaure"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="mx-2 text-brandBlue dark:text-sky-400 hover:underline hover:text-blue-600 dark:hover:text-sky-300 transition-colors"
            href="https://linkedin.com/in/josemanaure"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
