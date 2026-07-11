import { Link } from 'react-router-dom'
import { ArrowRight, MessageSquare, Database, Zap, ShieldCheck } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const LandingPage = () => {
  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Natural Language Queries',
      description: 'Ask questions in plain English and get instant SQL results.',
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: 'Live Schema Detection',
      description: 'Automatically inspects your database structure for accurate queries.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Explanations',
      description: 'Get plain-English breakdowns of every result, powered by AI.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Read-Only & Secure',
      description: 'Enforced read-only queries with encrypted credential storage.',
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      <Navbar />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Talk to Your Database.
          <br />
          <span className="text-indigo-600 dark:text-indigo-400">No SQL Required.</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          QueryPilot turns your plain English questions into accurate SQL queries, executes them live, and explains the results — instantly.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            Connect Your Database <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
          >
            Login
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all hover:shadow-lg bg-white dark:bg-gray-950"
            >
              <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage