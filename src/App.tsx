import {
  useEffect,
  useRef,
  type RefObject
} from "react"

import "./App.css"

import EP2 from "./learnings/ep_2"

const App = () => {
  const canvasRef: RefObject<HTMLCanvasElement | null> = useRef<HTMLCanvasElement>(null)
  const is_start: RefObject<boolean> = useRef<boolean>(false)

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current

    if (canvas && !is_start.current) {
      console.log("Canvas is available")
      is_start.current = true

      const ep2: EP2 = new EP2(canvas)
      ep2.init()
      ep2.create()
      ep2.start()
    }
  }, [])

  return (
    <main>
      <canvas ref={ canvasRef } />
    </main>
  )
}

export default App