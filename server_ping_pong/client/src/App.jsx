import { useEffect, useRef} from 'react'
import startGame from './PingPongGames/ClassicGame/js/game'
//import startGame from './PingPongGames/3dGame/js/game'
//import startGame from './PingPongGames/Test/js/game'
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
