import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { User, Bot } from 'lucide-react'

const QueryMessage = ({ role, question, sql, explanation, status, isStreaming }) => {
  if (role === 'user') {
    return (
      <div className="flex gap-3 justify-end">
        <div className="bg-indigo-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-lg">
          {question}
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-gray-600 dark:text-gray-300" />
      </div>
      <div className="flex-1 max-w-2xl space-y-3 min-w-0">
        {status && (
          <p className="text-xs text-gray-400 dark:text-gray-500 italic animate-pulse">{status}</p>
        )}

       {sql && (
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">SQL Query:</p>
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
              <SyntaxHighlighter language="sql" style={oneDark} customStyle={{ margin: 0, fontSize: '0.85rem' }}>
                {sql}
              </SyntaxHighlighter>
            </div>
          </div>
        )}

        {explanation && (
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Explanation of the Result:</p>
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 text-gray-800 dark:text-gray-200 overflow-x-auto">
              <div className="prose prose-sm dark:prose-invert max-w-none prose-table:text-xs prose-th:px-2 prose-th:py-1 prose-td:px-2 prose-td:py-1 prose-th:border prose-td:border prose-th:border-gray-300 dark:prose-th:border-gray-700 prose-td:border-gray-300 dark:prose-td:border-gray-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
              </div>
              {isStreaming && <span className="inline-block w-1.5 h-4 bg-indigo-500 ml-0.5 animate-pulse align-middle" />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QueryMessage