import { useState, useEffect, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import ReactMarkdown from 'react-markdown'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

// Audio context for timer chime
const audioContext = new (window.AudioContext || window.webkitAudioContext)()
function playChime() {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3)
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.3)
}

function Viewer() {
  const [papers, setPapers] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentPaper, setCurrentPaper] = useState(null)
  const [currentNote, setCurrentNote] = useState('')
  const [savedNotes, setSavedNotes] = useState([])
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfWidth, setPdfWidth] = useState(null)
  
  // Timer state
  const [isTimedSession, setIsTimedSession] = useState(false)
  const [sessionConfig, setSessionConfig] = useState({
    name: '',
    timePerPaper: 10
  })
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  
  const pdfContainerRef = useRef(null)
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

  useEffect(() => {
    // Check URL parameters for papers
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1])
    const paperIds = urlParams.get('papers')?.split(',') || []
    const singlePaper = urlParams.get('paper')
    
    if (singlePaper) {
      loadPapers([singlePaper])
    } else if (paperIds.length > 0) {
      loadPapers(paperIds)
    } else {
      // Load all imported papers by default
      loadAllPapers()
    }
  }, [])

  useEffect(() => {
    const updatePdfWidth = () => {
      if (pdfContainerRef.current) {
        setPdfWidth(pdfContainerRef.current.offsetWidth - 32)
      }
    }
    updatePdfWidth()
    window.addEventListener('resize', updatePdfWidth)
    return () => window.removeEventListener('resize', updatePdfWidth)
  }, [])

  useEffect(() => {
    if (papers[currentIndex]) {
      setCurrentPaper(papers[currentIndex])
      loadNotes(papers[currentIndex].semantic_scholar_id)
      setPageNumber(1)
    }
  }, [currentIndex, papers])

  useEffect(() => {
    let interval
    if (isRunning && isTimedSession && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            playChime()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, isTimedSession, timeLeft])

  const loadAllPapers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/papers/?status=imported`)
      const data = await response.json()
      setPapers(data)
    } catch (error) {
      console.error('Error loading papers:', error)
    }
  }

  const loadPapers = async (paperIds) => {
    try {
      const paperPromises = paperIds.map(id =>
        fetch(`${API_BASE}/api/papers/${id}`).then(r => r.json())
      )
      const loadedPapers = await Promise.all(paperPromises)
      setPapers(loadedPapers.filter(p => p))
    } catch (error) {
      console.error('Error loading papers:', error)
    }
  }

  const loadNotes = async (paperId) => {
    try {
      const response = await fetch(`${API_BASE}/api/review-notes/paper/${paperId}`)
      const notes = await response.json()
      setSavedNotes(notes || [])
    } catch (error) {
      console.error('Error loading notes:', error)
      setSavedNotes([])
    }
  }

  const startTimedSession = async () => {
    if (!sessionConfig.name) {
      alert('Please enter a session name')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/api/review-sessions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sessionConfig.name,
          paper_ids: papers.map(p => p.semantic_scholar_id),
          time_per_paper: sessionConfig.timePerPaper
        })
      })
      
      const data = await response.json()
      setSessionId(data.session_id)
      setIsTimedSession(true)
      setTimeLeft(sessionConfig.timePerPaper * 60)
      setIsRunning(true)
      setStartTime(Date.now())
    } catch (error) {
      console.error('Error creating session:', error)
    }
  }

  const saveNote = async () => {
    if (!currentNote.trim()) return

    try {
      const noteData = {
        paper_id: currentPaper.semantic_scholar_id,
        content: currentNote,
        time_spent: isTimedSession && startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
      }

      if (sessionId) {
        noteData.session_id = sessionId
      }

      await fetch(`${API_BASE}/api/review-notes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      })

      // Reload notes
      loadNotes(currentPaper.semantic_scholar_id)
      setCurrentNote('')
      alert('Note saved!')
    } catch (error) {
      console.error('Error saving note:', error)
    }
  }

  const nextPaper = () => {
    if (currentIndex < papers.length - 1) {
      if (isTimedSession && sessionId && currentPaper) {
        // Mark paper as complete in session
        fetch(
          `${API_BASE}/api/review-sessions/${sessionId}/papers/${currentPaper.semantic_scholar_id}/complete`,
          { method: 'POST' }
        )
      }
      
      setCurrentIndex(currentIndex + 1)
      setCurrentNote('')
      
      if (isTimedSession) {
        setTimeLeft(sessionConfig.timePerPaper * 60)
        setStartTime(Date.now())
      }
    } else if (isTimedSession) {
      setIsRunning(false)
      alert('Session complete!')
    }
  }

  const prevPaper = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setCurrentNote('')
      if (isTimedSession) {
        setTimeLeft(sessionConfig.timePerPaper * 60)
        setStartTime(Date.now())
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (papers.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Paper Viewer</h2>
        <p className="text-gray-400">No papers selected. Go to Papers tab and select papers to view.</p>
      </div>
    )
  }

  if (!currentPaper) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Loading...</h2>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Paper Viewer</h2>
          <span className="text-sm text-gray-400">
            {currentIndex + 1} / {papers.length}
          </span>
          <span className="text-sm font-mono text-blue-400">
            {currentPaper.semantic_scholar_id.substring(0, 12)}...
          </span>
        </div>
        
        {!isTimedSession ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Session name"
              value={sessionConfig.name}
              onChange={(e) => setSessionConfig({...sessionConfig, name: e.target.value})}
              className="px-2 py-1 bg-gray-700 rounded text-sm"
            />
            <input
              type="number"
              placeholder="Min/paper"
              value={sessionConfig.timePerPaper}
              onChange={(e) => setSessionConfig({...sessionConfig, timePerPaper: parseInt(e.target.value) || 10})}
              className="w-20 px-2 py-1 bg-gray-700 rounded text-sm"
            />
            <button
              onClick={startTimedSession}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
            >
              Start Timed Session
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-sm">Session: {sessionConfig.name}</span>
            <span className="text-lg font-mono font-bold text-green-400">
              {formatTime(timeLeft)}
            </span>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm"
            >
              {isRunning ? 'Pause' : 'Resume'}
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Paper Info & Notes */}
        <div className="w-1/2 bg-gray-800 p-4 overflow-auto">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">{currentPaper.title}</h3>
            <p className="text-sm text-gray-400 mb-1">
              {currentPaper.authors?.slice(0, 3).join(', ')}
              {currentPaper.authors?.length > 3 && ' et al.'}
              {currentPaper.year && ` (${currentPaper.year})`}
            </p>
            <p className="text-xs text-gray-500 font-mono mb-3">
              BibtexID: {currentPaper.semantic_scholar_id}
            </p>
            
            {currentPaper.abstract && (
              <div className="bg-gray-700 rounded p-3 mb-4">
                <h4 className="font-semibold mb-2">Abstract</h4>
                <p className="text-sm">{currentPaper.abstract}</p>
              </div>
            )}
            
            {currentPaper.summary && (
              <div className="bg-gray-700 rounded p-3 mb-4">
                <h4 className="font-semibold mb-2">AI Summary</h4>
                <ReactMarkdown className="text-sm prose prose-invert max-w-none">
                  {currentPaper.summary}
                </ReactMarkdown>
              </div>
            )}
          </div>
          
          {/* Previous Notes */}
          {savedNotes.length > 0 && (
            <div className="bg-gray-700 rounded p-3 mb-4">
              <h4 className="font-semibold mb-2">Previous Notes ({savedNotes.length})</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {savedNotes.map((note, idx) => (
                  <div key={note._id || idx} className="bg-gray-800 p-2 rounded text-sm">
                    <p>{note.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(note.created_date).toLocaleString()}
                      {note.time_spent && ` • ${Math.floor(note.time_spent / 60)}m`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* New Note */}
          <div className="bg-gray-700 rounded p-3">
            <h4 className="font-semibold mb-2">Add Note</h4>
            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Type your notes here..."
              className="w-full h-32 px-3 py-2 bg-gray-800 rounded text-white resize-none mb-2"
            />
            <button
              onClick={saveNote}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
            >
              Save Note
            </button>
          </div>
        </div>

        {/* Right: PDF Viewer */}
        <div className="w-1/2 bg-gray-700 flex flex-col">
          {currentPaper.pdf_path ? (
            <>
              <div className="p-3 pb-2 flex items-center justify-between bg-gray-800">
                <span className="text-sm font-semibold">PDF Document</span>
                <span className="text-sm">
                  Page {pageNumber} / {numPages || '?'}
                </span>
              </div>
              <div ref={pdfContainerRef} className="flex-1 overflow-auto p-4">
                <Document
                  file={`${API_BASE}/stored_pdfs/${currentPaper.semantic_scholar_id}.pdf`}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  className="flex flex-col items-center"
                >
                  {numPages && Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} className="mb-4">
                      <Page
                        pageNumber={index + 1}
                        width={pdfWidth}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        onLoadSuccess={() => {
                          const container = pdfContainerRef.current
                          if (container && index === 0) {
                            container.addEventListener('scroll', () => {
                              const pages = container.querySelectorAll('.react-pdf__Page')
                              const containerTop = container.scrollTop
                              const containerHeight = container.clientHeight
                              
                              pages.forEach((page, idx) => {
                                const pageTop = page.offsetTop - container.offsetTop
                                const pageMiddle = pageTop + page.offsetHeight / 2
                                
                                if (pageMiddle > containerTop && pageMiddle < containerTop + containerHeight / 2) {
                                  setPageNumber(idx + 1)
                                }
                              })
                            })
                          }
                        }}
                      />
                    </div>
                  ))}
                </Document>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <p className="text-gray-400 mb-4">No PDF available</p>
              {currentPaper.pdf_url && (
                <a
                  href={currentPaper.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                >
                  Download from Semantic Scholar
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-gray-800 border-t border-gray-700 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={prevPaper}
              disabled={currentIndex === 0}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              ← Previous
            </button>
            
            <button
              onClick={nextPaper}
              disabled={currentIndex === papers.length - 1 && !isTimedSession}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              {isTimedSession && currentIndex === papers.length - 1 ? 'Complete Session' : 'Next →'}
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={currentIndex}
              onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
              className="px-3 py-2 bg-gray-700 rounded text-sm"
            >
              {papers.map((paper, idx) => (
                <option key={idx} value={idx}>
                  {idx + 1}. {paper.semantic_scholar_id.substring(0, 12)}... - {paper.title.substring(0, 30)}...
                </option>
              ))}
            </select>
            
            {currentPaper.url && (
              <a
                href={currentPaper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm"
              >
                View on SS
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Viewer