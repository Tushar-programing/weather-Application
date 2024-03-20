import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Search from './component/search'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      < Search />
    </>
  )
}

export default App
