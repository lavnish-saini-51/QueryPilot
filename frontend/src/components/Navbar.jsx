import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Database, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">QueryPilot</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            <Link to="/login" className="text-gray-700 dark:text-gray-300 font-medium py-2">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-center"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar