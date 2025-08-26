import { useState, useEffect } from 'react'
import useTimerStore from '../stores/timerStore'

function GeneralTimer() {
  const [totalTimeInput, setTotalTimeInput] = useState('60')
  const [taskCountInput, setTaskCountInput] = useState('5')
  const [currentTime, setCurrentTime] = useState(0)
  const [playedChime, setPlayedChime] = useState(false)
  
  const {
    taskCount,
    timePerTask,
    currentTaskNumber,
    isRunning,
    showSetup,
    taskIntervals,
    completedTasks,
    totalTime,
    startSession,
    toggleTimer,
    switchToTask,
    completeTask,
    resetSession,
    getTaskTimeSpent,
    getCurrentTaskTimeLeft,
    getActualBuffer
  } = useTimerStore()

  // Update current time every second when running
  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime(Date.now())
      }, 100) // Update every 100ms for smoother display
    }
    return () => clearInterval(interval)
  }, [isRunning])

  // Calculate current task's remaining time
  const timeLeft = getCurrentTaskTimeLeft()

  // Calculate actual buffer
  const bufferTime = getActualBuffer()

  // Play chime when timer hits 0
  useEffect(() => {
    if (timeLeft === 0 && isRunning && !playedChime) {
      playChime()
      setPlayedChime(true)
    } else if (timeLeft !== 0) {
      setPlayedChime(false)
    }
  }, [timeLeft, isRunning, playedChime])

  const playChime = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
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

  const handleStartSession = () => {
    const count = parseInt(taskCountInput)
    if (count <= 0) {
      alert('작업 개수를 1개 이상 입력해주세요!')
      return
    }
    startSession(count, parseInt(totalTimeInput))
  }

  const formatTime = (seconds) => {
    const absSeconds = Math.abs(seconds)
    const hours = Math.floor(absSeconds / 3600)
    const minutes = Math.floor((absSeconds % 3600) / 60)
    const secs = absSeconds % 60
    const sign = seconds < 0 ? '-' : ''
    
    if (hours > 0) {
      return `${sign}${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${sign}${minutes}:${secs.toString().padStart(2, '0')}`
  }

  if (showSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700">Sprint Timer</h1>
          
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">설정</h2>
            
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-2">
                작업 개수
              </label>
              <input
                type="number"
                value={taskCountInput}
                onChange={(e) => setTaskCountInput(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 text-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="1"
                placeholder="몇 개의 작업을 하시나요?"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-2">
                총 작업 시간 (분)
              </label>
              <input
                type="number"
                value={totalTimeInput}
                onChange={(e) => setTotalTimeInput(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 text-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="1"
              />
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg mb-6">
              <p className="text-lg text-center">
                {taskCountInput}개 작업을 {totalTimeInput}분 동안
              </p>
              <p className="text-sm text-gray-600 text-center mt-2">
                작업당 약 {taskCountInput > 0 ? Math.floor((parseInt(totalTimeInput) * 60) / parseInt(taskCountInput)) : 0}초
              </p>
            </div>
            
            <button
              onClick={handleStartSession}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
            >
              타이머 시작
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-700">Sprint Timer</h1>
          <button
            onClick={resetSession}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
          >
            재설정
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-4xl w-full">
          {/* Current Task Display */}
          <div className="mb-12">
            <p className="text-gray-600 text-lg mb-2">작업 진행</p>
            <h2 className="text-6xl font-bold mb-4 text-gray-800">
              {currentTaskNumber} / {taskCount}
            </h2>
            <p className="text-gray-600">번째 작업 중</p>
          </div>

          {/* Timer Display */}
          <div className="mb-12">
            <div className={`text-8xl font-mono font-bold mb-4 ${
              timeLeft < 0 ? 'text-red-500 animate-pulse' :
              timeLeft === 0 ? 'text-red-500' : 
              timeLeft < 60 ? 'text-amber-500' : 
              'text-emerald-500'
            }`}>
              {formatTime(timeLeft)}
            </div>
            <p className="text-gray-600">{timeLeft < 0 ? '초과 시간' : '남은 시간'}</p>
          </div>

          {/* Buffer Time Display */}
          <div className="mb-8">
            <div className={`text-3xl font-mono ${
              bufferTime >= 0 ? 'text-blue-600' : 'text-red-500'
            }`}>
              {formatTime(bufferTime)}
            </div>
            <p className="text-gray-600 text-sm">버퍼 시간</p>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4 justify-center mb-8">
            <button
              onClick={completeTask}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-bold text-xl transition-all transform hover:scale-105 shadow-lg"
            >
              완료
            </button>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={toggleTimer}
            className={`px-12 py-4 ${
              isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'
            } text-white rounded-lg font-bold text-xl transition-all transform hover:scale-105 shadow-lg`}
          >
            {isRunning ? '일시정지' : '시작'}
          </button>
        </div>
      </div>

      {/* Task Progress Sidebar */}
      <div className="fixed right-0 top-20 w-80 bg-white shadow-xl p-4 rounded-l-xl max-h-[80vh] overflow-y-auto">
        <h3 className="font-semibold mb-3 text-gray-700">진행 상황</h3>
        <div className="space-y-2">
          {Array.from({ length: taskCount }, (_, i) => i + 1).map((taskNum) => {
            const completed = completedTasks.find(t => t.taskNumber === taskNum)
            const isCurrent = taskNum === currentTaskNumber
            const taskTimeSpent = getTaskTimeSpent(taskNum)
            const taskTimeLeft = timePerTask - taskTimeSpent
            
            return (
              <div 
                key={taskNum} 
                onClick={() => !completed && switchToTask(taskNum)}
                className={`p-3 rounded-lg ${
                  isCurrent ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' :
                  completed ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 hover:bg-gray-200 cursor-pointer text-gray-700'
                } transition-all`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${completed ? 'line-through opacity-60' : ''}`}>
                    작업 {taskNum}
                  </span>
                  {completed ? (
                    <span className="text-xs">
                      {formatTime(completed.timeSpent)}
                    </span>
                  ) : isCurrent ? (
                    <span className="text-xs text-white">현재</span>
                  ) : (
                    <span className="text-xs text-gray-500">
                      {formatTime(taskTimeLeft)}
                    </span>
                  )}
                </div>
                {/* Show time intervals for debugging */}
                {!completed && taskIntervals[taskNum]?.length > 0 && (
                  <div className="text-xs mt-1 opacity-70">
                    세션: {taskIntervals[taskNum].length}회
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            완료: {completedTasks.length}/{taskCount}
          </p>
          <p className="text-sm text-gray-600">
            총 시간: {formatTime(totalTime)}
          </p>
          <p className="text-sm text-gray-600">
            작업당: {formatTime(timePerTask)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default GeneralTimer