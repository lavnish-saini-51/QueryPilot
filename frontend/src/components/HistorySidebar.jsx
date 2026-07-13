import { History, X, Clock } from 'lucide-react'

const HistorySidebar = ({ isOpen, onClose, history, onSelect, loading }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-80 bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 h-full overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Query History</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 space-y-2">
          {loading && <p className="text-sm text-gray-400 text-center mt-6">Loading...</p>}

          {!loading && history.length === 0 && (
            <p className="text-sm text-gray-400 text-center mt-6">No past queries yet.</p>
          )}

          {history.map((item) => (
            <button
              key={item._id}
              onClick={() => onSelect(item.question)}
              className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
            >
              <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">{item.question}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-400 dark:text-gray-500">
                <Clock className="w-3 h-3" />
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HistorySidebar