import { useState } from 'react'
import logo from '/logo.svg'
import viteLogo from '/vite.svg'
import './App.css'

// TODO: generate PWA assets https://www.npmjs.com/package/pwa-asset-generator
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={logo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Kolektiv App</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 2)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App
