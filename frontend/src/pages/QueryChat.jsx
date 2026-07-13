import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Send, ArrowLeft, Loader2, History } from 'lucide-react'
import toast from 'react-hot-toast'
import QueryMessage from '../components/QueryMessage'
import HistorySidebar from '../components/HistorySidebar'
import { runQuery, getQueryHistory } from '../services/queryService'

const TYPE_SPEED_MS = 15

const QueryChat = () => {
  const { connectionId } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const openHistory = async () => {
    setHistoryOpen(true)
    setHistoryLoading(true)
    try {
      const res = await getQueryHistory(connectionId)
      setHistory(res.data.data)
    } catch (error) {
      toast.error('Failed to load history')
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleSelectHistory = (question) => {
    setInput(question)
    setHistoryOpen(false)
  }

  const typeOutExplanation = (fullText, msgIndex) => {
    let i = 0
    const interval = setInterval(() => {
      i += 3
      setMessages((prev) => {
        const updated = [...prev]
        updated[msgIndex].explanation = fullText.slice(0, i)
        updated[msgIndex].isStreaming = i < fullText.length
        return updated
      })
      if (i >= fullText.length) clearInterval(interval)
    }, TYPE_SPEED_MS)
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const question = input.trim()
    setInput('')
    setLoading(true)

    const assistantIndex = messages.length + 1
    setMessages((prev) => [
      ...prev,
      { role: 'user', question },
      { role: 'assistant', status: 'Thinking...', sql: '', result: '', explanation: '', isStreaming: true },
    ])

    try {
      const res = await runQuery({ connectionId, question })
      const { sql, explanation } = res.data.data

      setMessages((prev) => {
        const updated = [...prev]
        updated[assistantIndex].status = null
        updated[assistantIndex].sql = sql
        return updated
      })

      typeOutExplanation(explanation, assistantIndex)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Query failed')
      setMessages((prev) => {
        const updated = [...prev]
        updated[assistantIndex].status = null
        updated[assistantIndex].isStreaming = false
        updated[assistantIndex].explanation = '⚠️ Something went wrong. Please try again.'
        return updated
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">
      <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-gray-900 dark:text-white">Query Assistant</h1>
        </div>
        <button
          onClick={openHistory}
          className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <History className="w-4 h-4" /> History
        </button>
      </div>

      <HistorySidebar
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onSelect={handleSelectHistory}
        loading={historyLoading}
      />

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-3xl mx-auto w-full">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 mt-20">
            Ask a question about your database in plain English.
          </p>
        )}
        {messages.map((msg, idx) => (
          <QueryMessage key={idx} role={msg.role} {...msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Show me all courses with credits greater than 3"
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  )
}

export default QueryChat