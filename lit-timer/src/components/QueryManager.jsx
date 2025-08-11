import { useState, useEffect } from 'react'

function QueryManager() {
  const [queries, setQueries] = useState([])
  const [queryString, setQueryString] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedQuery, setSelectedQuery] = useState(null)
  const [queryPapers, setQueryPapers] = useState([])

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

  useEffect(() => {
    fetchQueries()
  }, [])

  const fetchQueries = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/queries/`)
      const data = await response.json()
      setQueries(data)
    } catch (error) {
      console.error('Error fetching queries:', error)
    }
  }

  const createQuery = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const params = new URLSearchParams({
        query_string: queryString,
        ...(description && { description })
      })
      
      const response = await fetch(`${API_BASE}/api/queries/?${params}`, {
        method: 'POST'
      })
      
      const data = await response.json()
      alert(`Query created! Found ${data.papers_found} papers`)
      
      setQueryString('')
      setDescription('')
      fetchQueries()
    } catch (error) {
      console.error('Error creating query:', error)
      alert('Failed to create query')
    } finally {
      setLoading(false)
    }
  }

  const loadQueryPapers = async (queryId) => {
    try {
      const response = await fetch(`${API_BASE}/api/queries/${queryId}/papers`)
      const data = await response.json()
      setQueryPapers(data)
      setSelectedQuery(queryId)
    } catch (error) {
      console.error('Error loading papers:', error)
    }
  }

  const deleteQuery = async (queryId) => {
    if (!confirm('Are you sure you want to delete this query? This will not delete the papers.')) return
    
    try {
      const response = await fetch(`${API_BASE}/api/queries/${queryId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        alert('Query deleted successfully')
        fetchQueries()
        if (selectedQuery === queryId) {
          setSelectedQuery(null)
          setQueryPapers([])
        }
      } else {
        alert('Failed to delete query')
      }
    } catch (error) {
      console.error('Error deleting query:', error)
      alert('Error deleting query')
    }
  }

  // Removed gating - now handled in separate Gating tab

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Query Management</h2>
      
      {/* Create New Query */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Create New Query</h3>
        <form onSubmit={createQuery} className="space-y-3">
          <input
            type="text"
            placeholder="Search query (e.g., 'machine learning healthcare')"
            value={queryString}
            onChange={(e) => setQueryString(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded text-white"
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search Papers'}
          </button>
        </form>
      </div>

      {/* Existing Queries */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Existing Queries</h3>
        <div className="space-y-2">
          {queries.map((query) => (
            <div
              key={query._id}
              className="flex items-center justify-between p-3 bg-gray-700 rounded hover:bg-gray-600"
            >
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => loadQueryPapers(query._id)}
              >
                <p className="font-medium">{query.query_string}</p>
                {query.description && (
                  <p className="text-sm text-gray-400">{query.description}</p>
                )}
                <p className="text-sm text-gray-400">
                  {query.total_results} papers • {new Date(query.last_run).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteQuery(query._id)
                }}
                className="ml-3 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Query Papers */}
      {queryPapers.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Papers from Query</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {queryPapers.map((paper) => (
              <div key={paper.semantic_scholar_id} className="p-3 bg-gray-700 rounded">
                <h4 className="font-medium mb-1">{paper.title}</h4>
                <p className="text-sm text-gray-400 mb-2">
                  {paper.authors?.slice(0, 3).join(', ')}
                  {paper.authors?.length > 3 && ' et al.'}
                  {paper.year && ` • ${paper.year}`}
                  {paper.citation_count !== null && ` • ${paper.citation_count} citations`}
                </p>
                {paper.abstract && (
                  <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                    {paper.abstract}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    paper.status?.toUpperCase() === 'QUERIED' ? 'bg-gray-600' :
                    paper.status?.toUpperCase() === 'IMPORTED' ? 'bg-green-600' :
                    paper.status?.toUpperCase() === 'PDF_READY' ? 'bg-blue-600' :
                    paper.status?.toUpperCase() === 'SUMMARIZED' ? 'bg-purple-600' :
                    'bg-gray-600'
                  }`}>
                    {paper.status?.toUpperCase()}
                  </span>
                  {paper.pdf_url && (
                    <a
                      href={paper.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                    >
                      PDF
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default QueryManager