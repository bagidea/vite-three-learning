import {
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    SphereGeometry,
    WebGLRenderer
} from "three"

import { OrbitControls } from "three/examples/jsm/Addons.js"

class EP2 {
    private canvas: HTMLCanvasElement = null!

    private renderer: WebGLRenderer = null!
    private scene: Scene = null!
    private camera: PerspectiveCamera = null!

    private controls: OrbitControls = null!

    ///////////////////

    private sun: Mesh = null!
    private earth: Mesh = null!
    private moon: Mesh = null!

    constructor(canvas: HTMLCanvasElement) {
        console.log("EP2 initialized")

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
        // Box

        const box_geometry: BoxGeometry = new BoxGeometry(1, 1, 1)
        const red_material: MeshBasicMaterial = new MeshBasicMaterial({ color: 0xff0000 })

        const box: Mesh = new Mesh(box_geometry, red_material)
        box.position.x = -1
        box.position.y = 0.5

        this.scene.add(box)

        // Plane

        const plane_geometry: PlaneGeometry = new PlaneGeometry(10, 10)
        const green_material: MeshBasicMaterial = new MeshBasicMaterial({ color: 0x00ff00 })

        const plane: Mesh = new Mesh(plane_geometry, green_material)
        plane.rotation.x = -Math.PI / 2

        this.scene.add(plane)

        // Sphere

        const sphere_geometry: SphereGeometry = new SphereGeometry(0.5)
        const blue_material: MeshBasicMaterial = new MeshBasicMaterial({ color: 0x0000ff })

        const sphere: Mesh = new Mesh(sphere_geometry, blue_material)
        sphere.position.x = 1
        sphere.position.y = 0.5

        this.scene.add(sphere)

        ////// Solar system //////
    
        // Sun

        this.sun = new Mesh(
            new SphereGeometry(0.5),
            new MeshBasicMaterial({ color: 0xffff00 })
        )

        this.sun.position.set(0, 2, 0)

        this.scene.add(this.sun)

        // Earth

        this.earth = new Mesh(
            new BoxGeometry(0.5, 0.5, 0.5),
            new MeshBasicMaterial({ color: 0x00ffff})
        )

        this.earth.position.x = 2

        this.sun.add(this.earth)

        // Moon
        
        this.moon = new Mesh(
            new BoxGeometry(0.15, 0.15, 0.15),
            new MeshBasicMaterial({ color: 0xffffff })
        )

        this.moon.position.x = 1

        this.earth.add(this.moon)
    }

    start = () => {
        this.renderer.setAnimationLoop(this.render)
    }

    private render = (time: DOMHighResTimeStamp) => {
        time *= 0.001

        this.controls.update()

        this.sun.position.y = 2 + (Math.sin(time) * 0.5)
        this.sun.rotation.y = time

        this.earth.rotation.y = time

        this.moon.rotation.y = time * 2

        this.renderer.render(this.scene, this.camera)
    }
}

export default EP2