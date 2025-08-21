import {
  useEffect,
  useRef,
  type RefObject
} from "react"

import "./App.css"

//import EP2 from "./learnings/ep_2"
//import EP3 from "./learnings/ep_3"
import EP4 from "./learnings/ep_4"

const App = () => {
  const canvasRef: RefObject<HTMLCanvasElement | null> = useRef<HTMLCanvasElement>(null)
  const is_start: RefObject<boolean> = useRef<boolean>(false)

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current

    if (canvas && !is_start.current) {
      console.log("Canvas is available")
      is_start.current = true

      //const ep: EP2 = new EP2(canvas)
      //const ep: EP3 = new EP3(canvas)
      const ep: EP4 = new EP4(canvas)

      ep.init()
      ep.create()
      ep.start()
    }
  }, [])

  return (
    <main>
      <canvas ref={ canvasRef } />
    </main>
  )
}

export default App