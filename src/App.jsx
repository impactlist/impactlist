import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">React + Tailwind Template</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={() => setCount(count => count + 1)}
        >
          Count is {count}
        </button>
      </div>
    </div>
  )
}

export default App