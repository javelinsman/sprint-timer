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

// Create audio context for chime
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

function ReviewTimer() {
  const [sessions, setSessions] = useState([])
  const [activeSession, setActiveSession] = useState(null)
  const [sessionPapers, setSessionPapers] = useState([])
  const [currentPaperIndex, setCurrentPaperIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [bufferTime, setBufferTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [hasPlayedChime, setHasPlayedChime] = useState(false)
  const [noteContent, setNoteContent] = useState('')
  const [currentNote, setCurrentNote] = useState('')
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfWidth, setPdfWidth] = useState(null)
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [newSession, setNewSession] = useState({
    name: '',
    paperIds: [],
    timePerPaper: 10
  })

  const pdfContainerRef = useRef(null)
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

  useEffect(() => {
    fetchSessions()
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
    let interval
    if (isRunning && activeSession) {
      interval = setInterval(() => {
        if (timeLeft > 0) {
          setTimeLeft(prev => Math.max(0, prev - 1))
        } else {
          if (!hasPlayedChime) {
            playChime()
            setHasPlayedChime(true)
          }
          setBufferTime(prev => prev - 1)
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, hasPlayedChime, activeSession])

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/review-sessions/`)
      const data = await response.json()
      setSessions(data)
    } catch (error) {
      console.error('Error fetching sessions:', error)
    }
  }

  const loadSession = async (sessionId) => {
    try {
      const response = await fetch(`${API_BASE}/api/review-sessions/${sessionId}`)
      const session = await response.json()
      setActiveSession(session)
      
      // Load papers for the session
      if (session.paper_ids && session.paper_ids.length > 0) {
        const paperPromises = session.paper_ids.map(id => 
          fetch(`${API_BASE}/api/papers/${id}`).then(r => r.json())
        )
        const papers = await Promise.all(paperPromises)
        setSessionPapers(papers)
      } else {
        setSessionPapers([])
      }
      
      // Find first incomplete paper
      const firstIncompleteIndex = session.paper_ids?.findIndex(
        id => !(session.completed_papers || []).includes(id)
      ) ?? 0
      setCurrentPaperIndex(firstIncompleteIndex !== -1 ? firstIncompleteIndex : 0)
      setTimeLeft(session.time_per_paper * 60) // Convert minutes to seconds
      setBufferTime(0)
      setPageNumber(1)
      setHasPlayedChime(false)
    } catch (error) {
      console.error('Error loading session:', error)
    }
  }

  const createNewSession = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/review-sessions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSession.name,
          paper_ids: newSession.paperIds,
          time_per_paper: newSession.timePerPaper
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        fetchSessions()
        setShowSessionForm(false)
        setNewSession({ name: '', paperIds: [], timePerPaper: 10 })
        loadSession(data.session_id)
      }
    } catch (error) {
      console.error('Error creating session:', error)
    }
  }

  const markPaperComplete = async () => {
    if (!activeSession || !sessionPapers[currentPaperIndex]) return
    
    const currentPaper = sessionPapers[currentPaperIndex]
    const elapsedTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
    
    // Save note if there is one
    if (currentNote.trim()) {
      try {
        await fetch(`${API_BASE}/api/review-notes/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paper_id: currentPaper.semantic_scholar_id,
            session_id: activeSession._id,
            content: currentNote,
            time_spent: elapsedTime
          })
        })
      } catch (error) {
        console.error('Error saving note:', error)
      }
    }
    
    // Mark paper as complete
    try {
      await fetch(
        `${API_BASE}/api/review-sessions/${activeSession._id}/papers/${currentPaper.semantic_scholar_id}/complete`,
        { method: 'POST' }
      )
    } catch (error) {
      console.error('Error marking paper complete:', error)
    }
    
    // Calculate buffer adjustment
    const timeDifference = (activeSession.time_per_paper * 60) - elapsedTime
    setBufferTime(prev => prev + timeDifference)
    
    // Move to next paper
    if (currentPaperIndex < sessionPapers.length - 1) {
      setCurrentPaperIndex(prev => prev + 1)
      setTimeLeft(activeSession.time_per_paper * 60)
      setStartTime(Date.now())
      setPageNumber(1)
      setHasPlayedChime(false)
      setCurrentNote('')
    } else {
      setIsRunning(false)
      alert('Session complete!')
    }
  }

  const postponePaper = () => {
    if (!activeSession || sessionPapers.length <= 1) return
    
    // Move current paper to end of list
    const newPapers = [...sessionPapers]
    const [postponed] = newPapers.splice(currentPaperIndex, 1)
    newPapers.push(postponed)
    setSessionPapers(newPapers)
    
    // Reset timer
    setTimeLeft(activeSession.time_per_paper * 60)
    setStartTime(Date.now())
    setPageNumber(1)
    setHasPlayedChime(false)
  }

  const formatTime = (seconds) => {
    const absSeconds = Math.abs(seconds)
    const hours = Math.floor(absSeconds / 3600)
    const minutes = Math.floor((absSeconds % 3600) / 60)
    const secs = absSeconds % 60
    const sign = seconds < 0 ? '-' : ''
    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const currentPaper = sessionPapers[currentPaperIndex]

  if (!activeSession) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Review Sessions</h2>
        
        <button
          onClick={() => setShowSessionForm(true)}
          className="mb-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Create New Session
        </button>
        
        {showSessionForm && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3">New Review Session</h3>
            <input
              type="text"
              placeholder="Session name"
              value={newSession.name}
              onChange={(e) => setNewSession({...newSession, name: e.target.value})}
              className="w-full mb-3 px-3 py-2 bg-gray-700 rounded text-white"
            />
            <input
              type="number"
              placeholder="Minutes per paper"
              value={newSession.timePerPaper}
              onChange={(e) => setNewSession({...newSession, timePerPaper: parseInt(e.target.value)})}
              className="w-full mb-3 px-3 py-2 bg-gray-700 rounded text-white"
            />
            <textarea
              placeholder="Paper IDs (one per line)"
              onChange={(e) => setNewSession({...newSession, paperIds: e.target.value.split('\n').filter(id => id.trim())})}
              className="w-full mb-3 px-3 py-2 bg-gray-700 rounded text-white h-32"
            />
            <div className="flex gap-2">
              <button
                onClick={createNewSession}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
              >
                Create
              </button>
              <button
                onClick={() => setShowSessionForm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {sessions && sessions.length > 0 ? sessions.map((session) => (
            <div
              key={session._id}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 cursor-pointer"
              onClick={() => loadSession(session._id)}
            >
              <h3 className="font-semibold mb-1">{session.name}</h3>
              <p className="text-sm text-gray-400">
                {session.paper_ids?.length || 0} papers • {session.time_per_paper || 0} min/paper
                {session.completed_papers?.length > 0 && 
                  ` • ${session.completed_papers.length}/${session.paper_ids?.length || 0} completed`
                }
              </p>
              <p className="text-sm text-gray-400">
                Created: {new Date(session.created_date).toLocaleDateString()}
                {!session.is_active && ' • Completed'}
              </p>
            </div>
          )) : (
            <p className="text-gray-400 text-center">No review sessions yet</p>
          )}
        </div>
      </div>
    )
  }

  if (!currentPaper) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">Session Complete!</h1>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Paper Info & Notes */}
        <div className="w-1/2 bg-gray-800 p-4 overflow-auto">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">{currentPaper.title}</h2>
            <p className="text-sm text-gray-400 mb-2">
              {currentPaper.authors?.slice(0, 3).join(', ')}
              {currentPaper.authors?.length > 3 && ' et al.'}
              {currentPaper.year && ` • ${currentPaper.year}`}
            </p>
            {currentPaper.abstract && (
              <div className="bg-gray-700 rounded p-3 mb-4">
                <h3 className="font-semibold mb-2">Abstract</h3>
                <p className="text-sm">{currentPaper.abstract}</p>
              </div>
            )}
            {currentPaper.summary && (
              <div className="bg-gray-700 rounded p-3 mb-4">
                <h3 className="font-semibold mb-2">Summary</h3>
                <ReactMarkdown className="text-sm prose prose-invert max-w-none">
                  {currentPaper.summary}
                </ReactMarkdown>
              </div>
            )}
          </div>
          
          <div className="bg-gray-700 rounded p-3">
            <h3 className="font-semibold mb-2">Review Notes</h3>
            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Take notes here..."
              className="w-full h-64 px-3 py-2 bg-gray-800 rounded text-white resize-none"
            />
          </div>
        </div>

        {/* Right: PDF Viewer */}
        <div className="w-1/2 bg-gray-700 flex flex-col">
          {currentPaper.pdf_path ? (
            <>
              <div className="p-4 pb-2 flex items-center justify-between">
                <h2 className="text-xl font-semibold">PDF</h2>
                <span className="text-sm">
                  Page {pageNumber} / {numPages || '?'}
                </span>
              </div>
              <div ref={pdfContainerRef} className="flex-1 overflow-auto p-4 pt-2">
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
                      />
                    </div>
                  ))}
                </Document>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400">No PDF available for this paper</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Timer and Controls */}
      <div className="bg-gray-800 border-t border-gray-700 p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 pl-2">
            <button
              onClick={markPaperComplete}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-16 rounded-lg text-3xl transition-colors"
            >
              완료
            </button>
            
            <button
              onClick={postponePaper}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-6 px-16 rounded-lg text-3xl transition-colors"
            >
              이따가
            </button>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <span className="text-sm text-gray-400">Paper</span>
              <p className="text-lg">{currentPaperIndex + 1} / {sessionPapers.length}</p>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-400">Time Left</span>
              <p className="text-2xl font-mono font-bold text-green-400">
                {formatTime(timeLeft)}
              </p>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-400">Buffer</span>
              <p className={`text-2xl font-mono font-bold ${bufferTime >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                {formatTime(bufferTime)}
              </p>
            </div>
          </div>

          <div className="pr-2">
            {!isRunning ? (
              <button
                onClick={() => {
                  setIsRunning(true)
                  setStartTime(Date.now())
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Start
              </button>
            ) : (
              <button
                onClick={() => setIsRunning(false)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Pause
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewTimer