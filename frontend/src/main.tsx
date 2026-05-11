import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import ThemeProvider from './components/ThemeProvider'
import SplashScreen from './components/SplashScreen'
import './index.css'

function App() {
  const [entered, setEntered] = useState(() => sessionStorage.getItem('splash_entered') === 'true')

  const handleEnter = () => {
    sessionStorage.setItem('splash_entered', 'true')
    setEntered(true)
  }

  if (!entered) {
    return <SplashScreen onEnter={handleEnter} />
  }

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
