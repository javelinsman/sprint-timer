import { useState, useEffect } from 'react'

function Gating() {
  const [papers, setPapers] = useState([])
  const [selectedPapers, setSelectedPapers] = useState(new Set())
  const [expandedPaper, setExpandedPaper] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filterQuery, setFilterQuery] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

  useEffect(() => {
    fetchQueriedPapers()
  }, [])

  const fetchQueriedPapers = async () => {
    setLoading(true)
    try {
      // Try with lowercase first (as stored in DB), then uppercase
      let response = await fetch(`${API_BASE}/api/papers/?status=queried`)
      
      if (!response.ok) {
        // If lowercase fails, try uppercase
        response = await fetch(`${API_BASE}/api/papers/?status=QUERIED`)
      }
      
      if (!response.ok) {
        // If both fail, fetch all and filter client-side
        response = await fetch(`${API_BASE}/api/papers/`)
        const allPapers = await response.json()
        const queriedPapers = Array.isArray(allPapers) 
          ? allPapers.filter(p => p.status?.toLowerCase() === 'queried')
          : []
        setPapers(queriedPapers)
      } else {
        const data = await response.json()
        setPapers(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching papers:', error)
      setPapers([])
    } finally {
      setLoading(false)
    }
  }

  const togglePaperSelection = (paperId) => {
    const newSelected = new Set(selectedPapers)
    if (newSelected.has(paperId)) {
      newSelected.delete(paperId)
    } else {
      newSelected.add(paperId)
    }
    setSelectedPapers(newSelected)
  }

  const importSelected = async () => {
    if (selectedPapers.size === 0) {
      alert('Please select papers to import')
      return
    }

    setLoading(true)
    try {
      // Import all selected papers
      const importPromises = Array.from(selectedPapers).map(paperId =>
        fetch(`${API_BASE}/api/papers/${paperId}/import`, { method: 'POST' })
      )
      
      await Promise.all(importPromises)
      
      alert(`Successfully imported ${selectedPapers.size} papers`)
      setSelectedPapers(new Set())
      fetchQueriedPapers() // Refresh the list
    } catch (error) {
      console.error('Error importing papers:', error)
      alert('Failed to import some papers')
    } finally {
      setLoading(false)
    }
  }

  const importSingle = async (paperId) => {
    try {
      await fetch(`${API_BASE}/api/papers/${paperId}/import`, { method: 'POST' })
      fetchQueriedPapers()
    } catch (error) {
      console.error('Error importing paper:', error)
    }
  }

  const rejectPaper = async (paperId) => {
    try {
      // Mark as rejected using the new endpoint
      const response = await fetch(`${API_BASE}/api/papers/${paperId}/reject`, { 
        method: 'POST' 
      })
      
      if (response.ok) {
        fetchQueriedPapers() // Refresh the list
      } else {
        alert('Failed to reject paper')
      }
    } catch (error) {
      console.error('Error rejecting paper:', error)
      alert('Error rejecting paper')
    }
  }

  // Filter papers based on query tags
  const filteredPapers = filterQuery
    ? (papers || []).filter(paper => 
        paper.query_tags?.some(tag => 
          tag.toLowerCase().includes(filterQuery.toLowerCase())
        )
      )
    : (papers || [])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Gating - Review Papers for Import</h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">
            {filteredPapers.length} papers to review
          </span>
          {selectedPapers.size > 0 && (
            <span className="text-blue-400">
              {selectedPapers.size} selected
            </span>
          )}
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Filter by query tag..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-700 rounded text-white"
          />
          
          <button
            onClick={() => setSelectedPapers(new Set((filteredPapers || []).map(p => p.semantic_scholar_id)))}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
            disabled={loading}
          >
            Select All
          </button>
          
          <button
            onClick={() => setSelectedPapers(new Set())}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
            disabled={loading}
          >
            Clear Selection
          </button>
          
          <button
            onClick={importSelected}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded font-semibold"
            disabled={loading || selectedPapers.size === 0}
          >
            Import Selected ({selectedPapers.size})
          </button>
        </div>
      </div>

      {/* Papers List */}
      {loading ? (
        <div className="text-center text-gray-400">Loading papers...</div>
      ) : filteredPapers.length === 0 ? (
        <div className="text-center text-gray-400">
          <p className="text-xl mb-2">No papers to review!</p>
          <p>All papers have been imported or there are no queried papers.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPapers.map((paper) => (
            <div 
              key={paper.semantic_scholar_id} 
              className={`bg-gray-800 rounded-lg p-4 border-2 ${
                selectedPapers.has(paper.semantic_scholar_id) 
                  ? 'border-blue-500' 
                  : 'border-transparent'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedPapers.has(paper.semantic_scholar_id)}
                  onChange={() => togglePaperSelection(paper.semantic_scholar_id)}
                  className="mt-1 w-5 h-5 cursor-pointer"
                />
                
                {/* Paper Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{paper.title}</h3>
                  
                  <p className="text-sm text-gray-400 mb-2">
                    {paper.authors?.slice(0, 3).join(', ')}
                    {paper.authors?.length > 3 && ' et al.'}
                    {paper.year && ` • ${paper.year}`}
                    {paper.venue && ` • ${paper.venue}`}
                  </p>
                  
                  <p className="text-sm text-gray-400 mb-2">
                    {paper.citation_count !== null && `${paper.citation_count} citations`}
                    {paper.reference_count !== null && ` • ${paper.reference_count} references`}
                  </p>
                  
                  {/* Query Tags */}
                  <div className="flex gap-2 mb-3">
                    {paper.query_tags?.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-gray-600 rounded">
                        {tag}
                      </span>
                    ))}
                    {paper.pdf_url && (
                      <span className="text-xs px-2 py-1 bg-blue-600 rounded">
                        Open Access PDF
                      </span>
                    )}
                  </div>
                  
                  {/* Abstract Preview */}
                  {paper.abstract && (
                    <div>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {paper.abstract}
                      </p>
                      {expandedPaper === paper.semantic_scholar_id ? (
                        <div>
                          <p className="text-sm text-gray-300 mt-2">
                            {paper.abstract.substring(150)}
                          </p>
                          <button
                            onClick={() => setExpandedPaper(null)}
                            className="text-xs text-blue-400 hover:text-blue-300 mt-2"
                          >
                            Show less
                          </button>
                        </div>
                      ) : paper.abstract.length > 150 && (
                        <button
                          onClick={() => setExpandedPaper(paper.semantic_scholar_id)}
                          className="text-xs text-blue-400 hover:text-blue-300 mt-2"
                        >
                          Show more
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => importSingle(paper.semantic_scholar_id)}
                    className="px-4 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                  >
                    Import
                  </button>
                  
                  {paper.pdf_url && (
                    <a
                      href={paper.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm text-center"
                    >
                      PDF
                    </a>
                  )}
                  
                  <button
                    onClick={() => rejectPaper(paper.semantic_scholar_id)}
                    className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Gating