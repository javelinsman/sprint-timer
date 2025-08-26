import { create } from 'zustand'

const useTimerStore = create((set, get) => ({
  // Basic configuration
  taskCount: 5,
  totalTime: 3600, // seconds
  timePerTask: 0,
  bufferTime: 0,
  
  // Current session state
  currentTaskNumber: 1,
  isRunning: false,
  showSetup: true,
  
  // Task tracking - each task has array of intervals
  // Format: { taskId: [{ start: timestamp, end: timestamp }, ...] }
  taskIntervals: {},
  
  // Completed tasks
  completedTasks: [],
  
  // Initialize session
  startSession: (taskCount, totalMinutes) => {
    const totalSeconds = totalMinutes * 60
    const perTask = Math.floor(totalSeconds / taskCount)
    
    // Initialize empty intervals for each task
    const intervals = {}
    for (let i = 1; i <= taskCount; i++) {
      intervals[i] = []
    }
    
    set({
      taskCount,
      totalTime: totalSeconds,
      timePerTask: perTask,
      bufferTime: 0,  // Start buffer at 0
      currentTaskNumber: 1,
      taskIntervals: intervals,
      completedTasks: [],
      showSetup: false,
      isRunning: false
    })
  },
  
  // Start/pause timer
  toggleTimer: () => {
    const state = get()
    const now = Date.now()
    
    if (!state.isRunning) {
      // Starting timer - add new interval start
      const currentIntervals = state.taskIntervals[state.currentTaskNumber] || []
      set({
        isRunning: true,
        taskIntervals: {
          ...state.taskIntervals,
          [state.currentTaskNumber]: [...currentIntervals, { start: now, end: null }]
        }
      })
    } else {
      // Pausing timer - close current interval
      const currentIntervals = state.taskIntervals[state.currentTaskNumber] || []
      if (currentIntervals.length > 0 && currentIntervals[currentIntervals.length - 1].end === null) {
        const updatedIntervals = [...currentIntervals]
        updatedIntervals[updatedIntervals.length - 1].end = now
        set({
          isRunning: false,
          taskIntervals: {
            ...state.taskIntervals,
            [state.currentTaskNumber]: updatedIntervals
          }
        })
      } else {
        set({ isRunning: false })
      }
    }
  },
  
  // Switch to a different task
  switchToTask: (taskNumber) => {
    const state = get()
    
    // Don't switch to completed tasks
    if (state.completedTasks.find(t => t.taskNumber === taskNumber)) {
      return
    }
    
    // If currently running, close current task interval
    if (state.isRunning) {
      const now = Date.now()
      const currentIntervals = state.taskIntervals[state.currentTaskNumber] || []
      
      if (currentIntervals.length > 0 && currentIntervals[currentIntervals.length - 1].end === null) {
        const updatedCurrentIntervals = [...currentIntervals]
        updatedCurrentIntervals[updatedCurrentIntervals.length - 1].end = now
        
        // Start new interval for the target task
        const targetIntervals = state.taskIntervals[taskNumber] || []
        
        set({
          currentTaskNumber: taskNumber,
          taskIntervals: {
            ...state.taskIntervals,
            [state.currentTaskNumber]: updatedCurrentIntervals,
            [taskNumber]: [...targetIntervals, { start: now, end: null }]
          }
        })
      }
    } else {
      set({ currentTaskNumber: taskNumber })
    }
  },
  
  // Complete current task
  completeTask: () => {
    const state = get()
    const now = Date.now()
    
    // Close current interval if running
    let finalIntervals = { ...state.taskIntervals }
    if (state.isRunning) {
      const currentIntervals = state.taskIntervals[state.currentTaskNumber] || []
      if (currentIntervals.length > 0 && currentIntervals[currentIntervals.length - 1].end === null) {
        const updatedIntervals = [...currentIntervals]
        updatedIntervals[updatedIntervals.length - 1].end = now
        finalIntervals[state.currentTaskNumber] = updatedIntervals
      }
    }
    
    // Calculate total time spent on this task
    const timeSpent = get().getTaskTimeSpent(state.currentTaskNumber)
    
    // Add to completed tasks
    const updatedCompleted = [...state.completedTasks, {
      taskNumber: state.currentTaskNumber,
      timeSpent,
      completedAt: now
    }]
    
    // Find next incomplete task
    let nextTask = null
    for (let i = 1; i <= state.taskCount; i++) {
      if (!updatedCompleted.find(t => t.taskNumber === i)) {
        nextTask = i
        break
      }
    }
    
    if (nextTask) {
      // If we were running, start interval for next task
      if (state.isRunning) {
        const nextIntervals = finalIntervals[nextTask] || []
        finalIntervals[nextTask] = [...nextIntervals, { start: now, end: null }]
      }
      
      set({
        currentTaskNumber: nextTask,
        completedTasks: updatedCompleted,
        taskIntervals: finalIntervals
      })
    } else {
      // All tasks completed
      set({
        completedTasks: updatedCompleted,
        taskIntervals: finalIntervals,
        isRunning: false
      })
    }
  },
  
  // Get total time spent on a specific task (in seconds)
  getTaskTimeSpent: (taskNumber) => {
    const intervals = get().taskIntervals[taskNumber] || []
    let totalMs = 0
    const now = Date.now()
    
    intervals.forEach(interval => {
      if (interval.start) {
        const end = interval.end || now
        totalMs += end - interval.start
      }
    })
    
    return Math.floor(totalMs / 1000)
  },
  
  // Get remaining time for current task (in seconds)
  getCurrentTaskTimeLeft: () => {
    const state = get()
    const timeSpent = state.getTaskTimeSpent(state.currentTaskNumber)
    return state.timePerTask - timeSpent
  },
  
  // Get actual buffer considering completed tasks and current task only (in seconds)
  getActualBuffer: () => {
    const state = get()
    let bufferAdjustment = 0
    
    // Calculate buffer adjustment from completed tasks
    state.completedTasks.forEach(task => {
      const timeDifference = state.timePerTask - task.timeSpent
      bufferAdjustment += timeDifference  // Positive if finished early, negative if overtime
    })
    
    // Add current task's impact on buffer (only if overtime)
    if (!state.completedTasks.find(t => t.taskNumber === state.currentTaskNumber)) {
      const currentTimeSpent = state.getTaskTimeSpent(state.currentTaskNumber)
      const currentTimeDifference = state.timePerTask - currentTimeSpent
      
      // Only affect buffer if current task is overtime (timeDifference is negative)
      if (currentTimeDifference < 0) {
        bufferAdjustment += currentTimeDifference
      }
      // If time remaining (positive), treat as 0 - no effect on buffer
    }
    
    return state.bufferTime + bufferAdjustment
  },
  
  // Reset session
  resetSession: () => {
    set({
      taskCount: 5,
      totalTime: 3600,
      timePerTask: 0,
      bufferTime: 0,
      currentTaskNumber: 1,
      isRunning: false,
      showSetup: true,
      taskIntervals: {},
      completedTasks: []
    })
  }
}))

export default useTimerStore