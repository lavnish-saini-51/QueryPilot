import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Database, Loader2 } from 'lucide-react'
import { testConnection, createConnection } from '../services/dbConnectionService'

const AddConnection = () => {
  const [formData, setFormData] = useState({
    label: '',
    host: '',
    port: 3306,
    username: '',
    password: '',
    database: '',
  })
  const [testing, setTesting] = useState(false)
  const [tested, setTested] = useState(false)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: name === 'port' ? Number(value) : value })
    setTested(false)
  }

  const handleTest = async () => {
    setTesting(true)
    try {
      await testConnection(formData)
      toast.success('Connection successful!')
      setTested(true)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Connection test failed')
      setTested(false)
    } finally {
      setTesting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createConnection(formData)
      toast.success('Database connected successfully!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save connection')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black px-4 py-12">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Database className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Connect Your Database</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Connection Label</label>
            <input
              type="text"
              name="label"
              required
              value={formData.label}
              onChange={handleChange}
              placeholder="My Production DB"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Host</label>
              <input
                type="text"
                name="host"
                required
                value={formData.host}
                onChange={handleChange}
                placeholder="127.0.0.1"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Port</label>
              <input
                type="number"
                name="port"
                required
                value={formData.port}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="root"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Database Name</label>
            <input
              type="text"
              name="database"
              required
              value={formData.database}
              onChange={handleChange}
              placeholder="querypilot_test"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={handleTest}
            disabled={testing}
            className="w-full flex items-center justify-center gap-2 border border-indigo-600 text-indigo-600 dark:text-indigo-400 py-2.5 rounded-lg font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors disabled:opacity-60"
          >
            {testing && <Loader2 className="w-4 h-4 animate-spin" />}
            {testing ? 'Testing...' : 'Test Connection'}
          </button>

          <button
            type="submit"
            disabled={!tested || saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-semibold transition-colors"
          >
            {saving ? 'Saving...' : 'Save & Connect'}
          </button>
          {!tested && (
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Please test the connection successfully before saving.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default AddConnection