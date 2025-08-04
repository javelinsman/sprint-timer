import { useState, useEffect, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import ReactMarkdown from 'react-markdown'
import { paperMapping } from './paperMapping'
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

function App() {
  const totalTimeInSeconds = 3 * 60 * 60 // 3 hours
  const baseTimePerPaper = Math.floor(totalTimeInSeconds / paperMapping.length)

  const [queue, setQueue] = useState(paperMapping)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [baseTimeLeft, setBaseTimeLeft] = useState(baseTimePerPaper)
  const [bufferTime, setBufferTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfWidth, setPdfWidth] = useState(null)
  const [noteContent, setNoteContent] = useState('')
  const [hasPlayedChime, setHasPlayedChime] = useState(false)
  
  const pdfContainerRef = useRef(null)
  const currentPaper = queue[currentIndex]

  // Calculate PDF width to fit container
  useEffect(() => {
    const updatePdfWidth = () => {
      if (pdfContainerRef.current) {
        setPdfWidth(pdfContainerRef.current.offsetWidth - 32) // Subtract padding
      }
    }

    updatePdfWidth()
    window.addEventListener('resize', updatePdfWidth)
    return () => window.removeEventListener('resize', updatePdfWidth)
  }, [])

  // Load note content when paper changes
  useEffect(() => {
    if (currentPaper) {
      fetch(`/lits/${currentPaper.note}`)
        .then(res => res.text())
        .then(text => setNoteContent(text))
        .catch(err => {
          console.error('Error loading note:', err)
          setNoteContent('# Note not found\n\nCould not load the note file.')
        })
    }
  }, [currentPaper])

  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => {
        if (baseTimeLeft > 0) {
          setBaseTimeLeft(prev => Math.max(0, prev - 1))
        } else {
          // Play chime when base time reaches 0
          if (!hasPlayedChime) {
            playChime()
            setHasPlayedChime(true)
          }
          setBufferTime(prev => prev - 1)
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, baseTimeLeft, hasPlayedChime])

  const formatTime = (seconds) => {
    const absSeconds = Math.abs(seconds)
    const hours = Math.floor(absSeconds / 3600)
    const minutes = Math.floor((absSeconds % 3600) / 60)
    const secs = absSeconds % 60
    const sign = seconds < 0 ? '-' : ''
    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    setIsRunning(true)
    setStartTime(Date.now())
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleComplete = () => {
    if (!startTime) return
    
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000)
    const timeDifference = baseTimePerPaper - elapsedTime
    setBufferTime(prev => prev + timeDifference)
    
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setBaseTimeLeft(baseTimePerPaper)
      setStartTime(Date.now())
      setPageNumber(1) // Reset to first page
      setHasPlayedChime(false) // Reset chime flag for next paper
    } else {
      setIsRunning(false)
    }
  }

  const handlePostpone = () => {
    if (queue.length <= 1) return
    
    const newQueue = [...queue]
    const [postponed] = newQueue.splice(currentIndex, 1)
    newQueue.push(postponed)
    setQueue(newQueue)
    
    setBaseTimeLeft(baseTimePerPaper)
    setStartTime(Date.now())
    setPageNumber(1) // Reset to first page
    setHasPlayedChime(false) // Reset chime flag for next paper
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  if (!currentPaper) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">All papers completed!</h1>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Note Viewer (Left) - Light Theme */}
        <div className="w-1/2 bg-white text-gray-900 p-4 overflow-auto">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Notes: {currentPaper.id}</h2>
          </div>
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({children}) => <h1 className="text-3xl font-bold mt-6 mb-4">{children}</h1>,
                h2: ({children}) => <h2 className="text-2xl font-bold mt-5 mb-3">{children}</h2>,
                h3: ({children}) => <h3 className="text-xl font-semibold mt-4 mb-2">{children}</h3>,
                p: ({children}) => <p className="mb-4 leading-relaxed">{children}</p>,
                ul: ({children}) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
                li: ({children}) => <li className="mb-1">{children}</li>,
                code: ({inline, children}) => 
                  inline 
                    ? <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{children}</code>
                    : <code className="block bg-gray-100 p-3 rounded mb-4 overflow-x-auto">{children}</code>,
                blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>,
                a: ({children, href}) => <a href={href} className="text-blue-600 hover:text-blue-800 underline">{children}</a>,
                strong: ({children}) => <strong className="font-bold">{children}</strong>,
                em: ({children}) => <em className="italic">{children}</em>,
              }}
            >
              {noteContent}
            </ReactMarkdown>
          </div>
        </div>

        {/* PDF Viewer (Right) */}
        <div className="w-1/2 bg-gray-800 flex flex-col">
          <div className="p-4 pb-2 flex items-center justify-between">
            <h2 className="text-xl font-semibold">PDF: {currentPaper.id}</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Page {pageNumber} / {numPages || '?'}
              </span>
            </div>
          </div>
          <div ref={pdfContainerRef} className="flex-1 overflow-auto p-4 pt-2">
            <Document
              file={`/pdfs/${currentPaper.pdf}`}
              onLoadSuccess={onDocumentLoadSuccess}
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
                      // Update current page number based on scroll position
                      const container = pdfContainerRef.current
                      if (container) {
                        container.addEventListener('scroll', () => {
                          const pages = container.querySelectorAll('.react-pdf__Page')
                          const containerTop = container.scrollTop
                          const containerHeight = container.clientHeight
                          
                          pages.forEach((page, idx) => {
                            const pageTop = page.offsetTop - container.offsetTop
                            const pageBottom = pageTop + page.offsetHeight
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
        </div>
      </div>

      {/* Timer and Controls (Bottom) */}
      <div className="bg-gray-800 border-t border-gray-700 p-2">
        <div className="flex items-center justify-between">
          {/* Complete/Postpone Buttons (Far Left) */}
          <div className="flex items-center gap-2 pl-2">
            <button
              onClick={handleComplete}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-16 rounded-lg text-3xl transition-colors"
            >
              완료
            </button>
            
            <button
              onClick={handlePostpone}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-6 px-16 rounded-lg text-3xl transition-colors"
            >
              이따가
            </button>
          </div>

          {/* Timer Display (Center) */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <span className="text-sm text-gray-400">Current</span>
              <h3 className="text-lg font-bold text-blue-400">{currentPaper.id}</h3>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-400">Base Time</span>
              <p className="text-2xl font-mono font-bold text-green-400">
                {formatTime(baseTimeLeft)}
              </p>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-400">Buffer</span>
              <p className={`text-2xl font-mono font-bold ${bufferTime >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                {formatTime(bufferTime)}
              </p>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-400">Progress</span>
              <p className="text-lg">{currentIndex + 1} / {paperMapping.length}</p>
            </div>
          </div>

          {/* Start/Pause Button (Far Right) */}
          <div className="pr-2">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Start
              </button>
            ) : (
              <button
                onClick={handlePause}
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

export default App