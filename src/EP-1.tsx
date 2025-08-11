import {
  useEffect,
  useRef,
  type RefObject
} from "react"

import "./App.css"

import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three"

interface WindowSize {
  width: number,
  height: number
}

const App = () => {
  const canvasRef: RefObject<HTMLCanvasElement | null> = useRef<HTMLCanvasElement>(null)
  const is_start: RefObject<boolean> = useRef<boolean>(false)

  const get_window_size = (): WindowSize => {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current

    if (canvas && !is_start.current) {
      console.log("Canvas is available")
      is_start.current = true

      const windowSize: WindowSize = get_window_size()

      // Renderer setup

      const renderer: WebGLRenderer = new WebGLRenderer({
        canvas: canvas,
        antialias: true
      })

      renderer.setSize(windowSize.width, windowSize.height)

      // Scene setup

      const scene: Scene = new Scene()

      const boxGeometry: BoxGeometry = new BoxGeometry(1, 1, 1)

      const material: MeshBasicMaterial = new MeshBasicMaterial({
        color: 0xff0000
      })

      const box: Mesh = new Mesh(boxGeometry, material)

      scene.add(box)

      // Camera setup

      const camera: PerspectiveCamera = new PerspectiveCamera(
        60,
        windowSize.width / windowSize.height,
        0.1,
        1000.0
      )

      camera.position.set(3, 3, 3)
      camera.lookAt(0, 0, 0)

      // Render Loop

      renderer.setAnimationLoop((time: DOMHighResTimeStamp) => {
        time *= 0.001

        box.rotation.x = time
        box.rotation.y = time

        box.position.y = Math.sin(time)

        renderer.render(scene, camera)
      })

      // Handle window resize

      window.addEventListener("resize", () => {
        const windowSize: WindowSize = get_window_size()

        camera.aspect = windowSize.width / windowSize.height
        camera.updateProjectionMatrix()

        renderer.setSize(windowSize.width, windowSize.height)
      })
    }
  }, [])

  return (
    <main>
      <canvas ref={ canvasRef } />
    </main>
  )
}

export default App
