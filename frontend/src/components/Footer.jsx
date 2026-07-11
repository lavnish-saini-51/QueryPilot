import { Database } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-lg font-bold text-gray-900 dark:text-white">QueryPilot</span>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} QueryPilot. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer