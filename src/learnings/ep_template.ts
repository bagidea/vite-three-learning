import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from "three"

import { OrbitControls } from "three/examples/jsm/Addons.js"

class EPTemplate {
    private canvas: HTMLCanvasElement = null!

    private renderer: WebGLRenderer = null!
    private scene: Scene = null!
    private camera: PerspectiveCamera = null!

    private controls: OrbitControls = null!

    ///////////////////

    constructor(canvas: HTMLCanvasElement) {
        console.log("EP Template")

        this.canvas = canvas
    }

    init = () => {
        const w: number = window.innerWidth
        const h: number = window.innerHeight

        // Renderer setup

        this.renderer = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })

        this.renderer.setSize(w, h)

        // Scene setup

        this.scene = new Scene()

        // Camera setup

        this.camera = new PerspectiveCamera(60, w / h, 0.1, 1000)
        this.camera.position.set(3, 3, 3)
        this.camera.lookAt(0, 0, 0)

        this.controls = new OrbitControls(this.camera, this.canvas)

        ////////////////////

        window.addEventListener("resize", this.window_resize)
    }

    private window_resize = () => {
        const w: number = window.innerWidth
        const h: number = window.innerHeight

        this.camera.aspect = w / h
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(w, h)
    }

    create = () => {
    }

    start = () => {
        this.renderer.setAnimationLoop(this.render)
    }

    private render = (/*time: DOMHighResTimeStamp*/) => {
        this.controls.update()

        this.renderer.render(this.scene, this.camera)
    }
}

export default EPTemplate