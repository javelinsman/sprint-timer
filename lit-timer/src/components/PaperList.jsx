import { useState, useEffect } from 'react'

function PaperList() {
  const [papers, setPapers] = useState([])
  const [filter, setFilter] = useState({
    status: '',
    queryTag: '',
    hasPdf: '',
    hasSummary: '',
    showRejected: false
  })
  const [selectedPapers, setSelectedPapers] = useState(new Set())
  const [expandedPaper, setExpandedPaper] = useState(null)
  const [uploadingPdf, setUploadingPdf] = useState(null)
  const [reviewNotes, setReviewNotes] = useState({})
  const [editingNote, setEditingNote] = useState(null)
  const [editNoteContent, setEditNoteContent] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

  useEffect(() => {
    fetchPapers()
  }, [filter])

  const fetchPapers = async () => {
    try {
      const params = new URLSearchParams()
      if (filter.status) params.append('status', filter.status)
      if (filter.queryTag) params.append('query_tag', filter.queryTag)
      if (filter.hasPdf !== '') params.append('has_pdf', filter.hasPdf)
      if (filter.hasSummary !== '') params.append('has_summary', filter.hasSummary)
      
      const response = await fetch(`${API_BASE}/api/papers/?${params}`)
      let data = await response.json()
      
      // Filter out rejected papers unless explicitly showing them
      if (!filter.showRejected) {
        data = data.filter(paper => paper.status?.toUpperCase() !== 'REJECTED')
      }
      
      setPapers(data)
      
      // Fetch review notes for papers
      const notesPromises = data.map(paper => 
        fetch(`${API_BASE}/api/review-notes/paper/${paper.semantic_scholar_id}`)
          .then(res => res.json())
          .catch(() => [])
      )
      const notesResults = await Promise.all(notesPromises)
      const notesMap = {}
      data.forEach((paper, idx) => {
        notesMap[paper.semantic_scholar_id] = notesResults[idx]
      })
      setReviewNotes(notesMap)
    } catch (error) {
      console.error('Error fetching papers:', error)
    }
  }

  const uploadPdf = async (paperId, file) => {
    setUploadingPdf(paperId)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch(`${API_BASE}/api/papers/${paperId}/pdf`, {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        alert('PDF uploaded successfully!')
        fetchPapers()
      } else {
        alert('Failed to upload PDF')
      }
    } catch (error) {
      console.error('Error uploading PDF:', error)
      alert('Error uploading PDF')
    } finally {
      setUploadingPdf(null)
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

  const deletePaper = async (paperId) => {
    if (!confirm('Are you sure you want to delete this paper and all associated data?')) return
    
    try {
      const response = await fetch(`${API_BASE}/api/papers/${paperId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        alert('Paper deleted successfully')
        fetchPapers()
        // Remove from selection if selected
        const newSelected = new Set(selectedPapers)
        newSelected.delete(paperId)
        setSelectedPapers(newSelected)
      } else {
        alert('Failed to delete paper')
      }
    } catch (error) {
      console.error('Error deleting paper:', error)
      alert('Error deleting paper')
    }
  }

  const deleteSelectedPapers = async () => {
    if (selectedPapers.size === 0) {
      alert('No papers selected')
      return
    }
    
    if (!confirm(`Are you sure you want to delete ${selectedPapers.size} papers?`)) return
    
    try {
      const deletePromises = Array.from(selectedPapers).map(paperId =>
        fetch(`${API_BASE}/api/papers/${paperId}`, { method: 'DELETE' })
      )
      
      await Promise.all(deletePromises)
      alert(`Successfully deleted ${selectedPapers.size} papers`)
      setSelectedPapers(new Set())
      fetchPapers()
    } catch (error) {
      console.error('Error deleting papers:', error)
      alert('Failed to delete some papers')
    }
  }

  const getStatusBadge = (status) => {
    const upperStatus = status?.toUpperCase()
    const colors = {
      'QUERIED': 'bg-gray-600',
      'IMPORTED': 'bg-green-600',
      'PDF_READY': 'bg-blue-600',
      'SUMMARIZED': 'bg-purple-600',
      'REJECTED': 'bg-red-600'
    }
    return colors[upperStatus] || 'bg-gray-600'
  }

  const deleteNote = async (noteId, paperId) => {
    if (!confirm('Are you sure you want to delete this note?')) return
    
    try {
      const response = await fetch(`${API_BASE}/api/review-notes/${noteId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Update local state
        setReviewNotes(prev => ({
          ...prev,
          [paperId]: prev[paperId].filter(note => note._id !== noteId)
        }))
      } else {
        alert('Failed to delete note')
      }
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('Error deleting note')
    }
  }

  const startEditNote = (note) => {
    setEditingNote(note)
    setEditNoteContent(note.content)
  }

  const saveEditedNote = async () => {
    if (!editingNote) return
    
    try {
      const response = await fetch(`${API_BASE}/api/review-notes/${editingNote._id}?content=${encodeURIComponent(editNoteContent)}`, {
        method: 'PUT'
      })
      
      if (response.ok) {
        // Update local state
        setReviewNotes(prev => {
          const paperId = editingNote.paper_id
          return {
            ...prev,
            [paperId]: prev[paperId].map(note => 
              note._id === editingNote._id 
                ? { ...note, content: editNoteContent }
                : note
            )
          }
        })
        setEditingNote(null)
        setEditNoteContent('')
      } else {
        alert('Failed to update note')
      }
    } catch (error) {
      console.error('Error updating note:', error)
      alert('Error updating note')
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Papers Library</h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">{papers.length} papers</span>
          {selectedPapers.size > 0 && (
            <>
              <span className="text-blue-400">{selectedPapers.size} selected</span>
              <button
                onClick={deleteSelectedPapers}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
              >
                Delete Selected
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-3 mb-4">
        <div className="grid grid-cols-5 gap-3">
          <select
            value={filter.status}
            onChange={(e) => setFilter({...filter, status: e.target.value})}
            className="px-2 py-1 bg-gray-700 rounded text-white text-sm"
          >
            <option value="">All Status</option>
            <option value="imported">Imported</option>
            <option value="pdf_ready">PDF Ready</option>
            <option value="summarized">Summarized</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <input
            type="text"
            placeholder="Filter by query..."
            value={filter.queryTag}
            onChange={(e) => setFilter({...filter, queryTag: e.target.value})}
            className="px-2 py-1 bg-gray-700 rounded text-white text-sm"
          />
          
          <select
            value={filter.hasPdf}
            onChange={(e) => setFilter({...filter, hasPdf: e.target.value})}
            className="px-2 py-1 bg-gray-700 rounded text-white text-sm"
          >
            <option value="">PDF: Any</option>
            <option value="true">Has PDF</option>
            <option value="false">No PDF</option>
          </select>
          
          <select
            value={filter.hasSummary}
            onChange={(e) => setFilter({...filter, hasSummary: e.target.value})}
            className="px-2 py-1 bg-gray-700 rounded text-white text-sm"
          >
            <option value="">Summary: Any</option>
            <option value="true">Has Summary</option>
            <option value="false">No Summary</option>
          </select>
          
          <div className="flex gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filter.showRejected}
                onChange={(e) => setFilter({...filter, showRejected: e.target.checked})}
                className="w-4 h-4"
              />
              <span>Show Rejected</span>
            </label>
            <button
              onClick={() => setSelectedPapers(new Set())}
              className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm"
            >
              Clear Selection
            </button>
          </div>
        </div>
      </div>

      {/* Compact Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr className="text-left text-sm">
              <th className="p-2 w-8">
                <input
                  type="checkbox"
                  checked={selectedPapers.size === papers.length && papers.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPapers(new Set(papers.map(p => p.semantic_scholar_id)))
                    } else {
                      setSelectedPapers(new Set())
                    }
                  }}
                />
              </th>
              <th className="p-2 font-mono">BibtexID</th>
              <th className="p-2">Title</th>
              <th className="p-2">Queries</th>
              <th className="p-2">Notes</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {papers.map((paper) => {
              const notes = reviewNotes[paper.semantic_scholar_id] || []
              return (
                <tr 
                  key={paper.semantic_scholar_id} 
                  className="border-t border-gray-700 hover:bg-gray-750 text-sm"
                >
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedPapers.has(paper.semantic_scholar_id)}
                      onChange={() => togglePaperSelection(paper.semantic_scholar_id)}
                    />
                  </td>
                  
                  <td className="p-2 font-mono text-xs">
                    <button
                      onClick={() => setExpandedPaper(expandedPaper === paper ? null : paper)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {paper.semantic_scholar_id.substring(0, 12)}...
                    </button>
                  </td>
                  
                  <td className="p-2">
                    <div className="max-w-md">
                      <p className="truncate font-medium">{paper.title}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {paper.authors?.slice(0, 2).join(', ')}
                        {paper.authors?.length > 2 && ' et al.'}
                        {paper.year && ` (${paper.year})`}
                      </p>
                    </div>
                  </td>
                  
                  <td className="p-2">
                    <div className="flex flex-wrap gap-1">
                      {paper.query_tags?.map((tag, idx) => (
                        <span key={idx} className="text-xs px-1 py-0.5 bg-gray-700 rounded">
                          {tag.length > 20 ? tag.substring(0, 20) + '...' : tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  
                  <td className="p-2">
                    {notes.length > 0 ? (
                      <span className="text-xs text-green-400">
                        {notes.length} note{notes.length > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">-</span>
                    )}
                  </td>
                  
                  <td className="p-2">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(paper.status)}`}>
                      {paper.status?.toUpperCase()}
                    </span>
                  </td>
                  
                  <td className="p-2">
                    <div className="flex items-center gap-1">
                      {paper.pdf_path ? (
                        <a
                          href={`${API_BASE}/stored_pdfs/${paper.semantic_scholar_id}.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded"
                        >
                          PDF
                        </a>
                      ) : (
                        <label className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded cursor-pointer">
                          {uploadingPdf === paper.semantic_scholar_id ? '...' : 'Upload'}
                          <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            disabled={uploadingPdf === paper.semantic_scholar_id}
                            onChange={(e) => {
                              const file = e.target.files[0]
                              if (file) uploadPdf(paper.semantic_scholar_id, file)
                            }}
                          />
                        </label>
                      )}
                      
                      <button
                        onClick={() => deletePaper(paper.semantic_scholar_id)}
                        className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        
        {papers.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No papers found with current filters
          </div>
        )}
      </div>
      
      {/* Edit Note Modal */}
      {editingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Edit Note</h3>
            <textarea
              value={editNoteContent}
              onChange={(e) => setEditNoteContent(e.target.value)}
              className="w-full h-32 px-3 py-2 bg-gray-700 text-white rounded resize-none"
              placeholder="Enter your note..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setEditingNote(null)
                  setEditNoteContent('')
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedNote}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Expanded Paper Details */}
      {expandedPaper && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-2">{expandedPaper.title}</h3>
          <p className="text-sm text-gray-400 mb-2">
            BibtexID: <span className="font-mono">{expandedPaper.semantic_scholar_id}</span>
          </p>
          {expandedPaper.abstract && (
            <p className="text-sm text-gray-300 mb-2">{expandedPaper.abstract}</p>
          )}
          {expandedPaper.url && (
            <a
              href={expandedPaper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View on Semantic Scholar →
            </a>
          )}
          
          {/* Display notes for expanded paper */}
          {reviewNotes[expandedPaper.semantic_scholar_id]?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-sm mb-2">Review Notes:</h4>
              <div className="space-y-2">
                {reviewNotes[expandedPaper.semantic_scholar_id].map((note) => (
                  <div key={note._id} className="bg-gray-700 p-3 rounded">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{note.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {note.session_name && `Session: ${note.session_name} • `}
                          {new Date(note.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => startEditNote(note)}
                          className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteNote(note._id, expandedPaper.semantic_scholar_id)}
                          className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PaperList