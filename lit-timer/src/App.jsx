import { useState } from 'react'
import Dashboard from './components/Dashboard'
import QueryManager from './components/QueryManager'
import Gating from './components/Gating'
import PaperList from './components/PaperList'
import Viewer from './components/Viewer'

function App() {
  const [activeView, setActiveView] = useState('dashboard')

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between px-6 py-3">
          <h1 className="text-xl font-bold">Literature Manager</h1>
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-4 py-2 rounded transition-colors ${
                activeView === 'dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('queries')}
              className={`px-4 py-2 rounded transition-colors ${
                activeView === 'queries' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              Queries
            </button>
            <button
              onClick={() => setActiveView('gating')}
              className={`px-4 py-2 rounded transition-colors ${
                activeView === 'gating' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              Gating
            </button>
            <button
              onClick={() => setActiveView('papers')}
              className={`px-4 py-2 rounded transition-colors ${
                activeView === 'papers' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              Papers
            </button>
            <button
              onClick={() => setActiveView('viewer')}
              className={`px-4 py-2 rounded transition-colors ${
                activeView === 'viewer' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              Viewer
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'queries' && <QueryManager />}
        {activeView === 'gating' && <Gating />}
        {activeView === 'papers' && <PaperList />}
        {activeView === 'viewer' && <Viewer />}
      </main>
    </div>
  )
}

export default App