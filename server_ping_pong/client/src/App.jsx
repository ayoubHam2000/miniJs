import { useState, useEffect, useRef} from 'react'
import startGame from './game/src/js/game'
import './gameStyple.css'

function App() {

 
  
  const isLoaded = useRef(false)
   
  useEffect(() => {
    if (!isLoaded.current) {
      startGame()
      isLoaded.current = true;
    }
  }, [])

  return (
    <>

      

    </>
  )
}

export default App
