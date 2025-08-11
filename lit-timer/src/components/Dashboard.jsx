import { useState, useEffect } from 'react'

function Dashboard() {
  const [overview, setOverview] = useState(null)
  const [summaryQueue, setSummaryQueue] = useState([])
  const [loading, setLoading] = useState(true)

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch overview
      const overviewResponse = await fetch(`${API_BASE}/api/overview/`)
      const overviewData = await overviewResponse.json()
      setOverview(overviewData)

      // Fetch summary queue
      const queueResponse = await fetch(`${API_BASE}/api/summary-queue/`)
      const queueData = await queueResponse.json()
      setSummaryQueue(queueData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!overview) {
    return (
      <div className="p-6">
        <p className="text-red-400">Failed to load overview data</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Literature Manager Dashboard</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Total Papers</h3>
          <p className="text-3xl font-bold">{overview.total_papers || 0}</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Total Queries</h3>
          <p className="text-3xl font-bold">{overview.total_queries || 0}</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Review Sessions</h3>
          <p className="text-3xl font-bold">{overview.total_sessions || 0}</p>
          {overview.active_sessions > 0 && (
            <p className="text-sm text-green-400">{overview.active_sessions} active</p>
          )}
        </div>
      </div>

      {/* Status Breakdown */}
      {overview.papers_by_status && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Papers by Status</h3>
          <div className="grid grid-cols-5 gap-3">
            {Object.entries(overview.papers_by_status).map(([status, count]) => (
            <div key={status} className="text-center">
              <div className={`px-3 py-2 rounded mb-1 ${
                status === 'QUERIED' ? 'bg-gray-600' :
                status === 'GATED' ? 'bg-yellow-600' :
                status === 'IMPORTED' ? 'bg-green-600' :
                status === 'PDF_READY' ? 'bg-blue-600' :
                status === 'SUMMARIZED' ? 'bg-purple-600' :
                'bg-gray-600'
              }`}>
                <p className="text-2xl font-bold">{count}</p>
              </div>
              <p className="text-sm text-gray-400">{status}</p>
            </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">PDF Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Papers with PDFs</span>
              <span className="font-semibold">{overview.papers_with_pdf || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Papers with Summaries</span>
              <span className="font-semibold">{overview.papers_with_summary || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Pending Summaries</span>
              <span className="font-semibold text-yellow-400">{summaryQueue.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Review Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Review Notes</span>
              <span className="font-semibold">{overview.total_notes || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Active Sessions</span>
              <span className="font-semibold">{overview.active_sessions || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Completed Sessions</span>
              <span className="font-semibold">{(overview.total_sessions || 0) - (overview.active_sessions || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Queries */}
      {overview.recent_queries && overview.recent_queries.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Recent Queries</h3>
          <div className="space-y-2">
            {overview.recent_queries.map((query) => (
              <div key={query._id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                <div>
                  <p className="font-medium">{query.query_string}</p>
                  {query.description && (
                    <p className="text-sm text-gray-400">{query.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm">{query.total_results} papers</p>
                  <p className="text-xs text-gray-400">
                    {new Date(query.last_run).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Queue */}
      {summaryQueue.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Papers Awaiting Summary</h3>
          <div className="space-y-2">
            {summaryQueue.slice(0, 5).map((item) => (
              <div key={item.paper_id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                <div>
                  <p className="font-medium text-sm">{item.paper_id}</p>
                  <p className="text-xs text-gray-400">
                    Added {new Date(item.added_date).toLocaleString()}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  item.status === 'pending' ? 'bg-yellow-600' :
                  item.status === 'processing' ? 'bg-blue-600' :
                  'bg-green-600'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
            {summaryQueue.length > 5 && (
              <p className="text-sm text-gray-400 text-center pt-2">
                And {summaryQueue.length - 5} more...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button
          onClick={fetchData}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded"
        >
          Refresh Data
        </button>
      </div>
    </div>
  )
}

export default Dashboard