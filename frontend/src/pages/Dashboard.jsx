import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Database, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getConnections, deleteConnection } from '../services/dbConnectionService'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchConnections = async () => {
    try {
      const res = await getConnections()
      setConnections(res.data.data)
    } catch (error) {
      toast.error('Failed to load connections')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConnections()
  }, [])

  const handleDelete = async (id) => {
    try {
      await deleteConnection(id)
      toast.success('Connection removed')
      setConnections(connections.filter((c) => c._id !== id))
    } catch (error) {
      toast.error('Failed to delete connection')
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, {user?.name}
        </h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Logout
        </button>
      </div>

      <Link
        to="/connect-database"
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors mb-8"
      >
        <Plus className="w-4 h-4" /> Connect a Database
      </Link>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading connections...</p>
      ) : connections.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No databases connected yet. Click above to add your first connection.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections.map((conn) => (
            <div
              key={conn._id}
              className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Database className="w-5 h-5" />
                </div>
                <button
                  onClick={() => handleDelete(conn._id)}
                  className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  aria-label="Delete connection"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{conn.label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {conn.host}:{conn.port} / {conn.database}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard