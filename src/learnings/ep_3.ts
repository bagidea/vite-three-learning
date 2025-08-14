import {
    BoxGeometry,
    Clock,
    DirectionalLight,
    MathUtils,
    Mesh,
    MeshPhysicalMaterial,
    //MeshBasicMaterial,
    MeshStandardMaterial,
    PCFShadowMap,
    PerspectiveCamera,
    PlaneGeometry,
    PointLight,
    Scene,
    SphereGeometry,
    TextureLoader,
    WebGLRenderer
} from "three"

import { OrbitControls } from "three/examples/jsm/Addons.js"

class EP3 {
    private canvas: HTMLCanvasElement = null!

    private renderer: WebGLRenderer = null!
    private scene: Scene = null!
    private camera: PerspectiveCamera = null!

    private controls: OrbitControls = null!

    private textureLoader: TextureLoader = null!

    ///////////////////

    private pointlight: PointLight = null!
    private tmr: number = 0

    private clock: Clock = null!

    constructor(canvas: HTMLCanvasElement) {
        console.log("EP3 initialized")

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
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = PCFShadowMap

        // Scene setup

        this.scene = new Scene()

        // Camera setup

        this.camera = new PerspectiveCamera(60, w / h, 0.1, 1000)
        this.camera.position.set(3, 3, 5)
        this.camera.lookAt(0, 0, 0)

        this.controls = new OrbitControls(this.camera, this.canvas)

        this.textureLoader = new TextureLoader()

        ////////////////////

        this.clock = new Clock()

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
        // Sun

        const directionalLight: DirectionalLight = new DirectionalLight(0xffffff, 0.2)
        directionalLight.castShadow = true
        directionalLight.position.set(5, 10, 7.5)

        this.scene.add(directionalLight)

        // Point light

        this.pointlight = new PointLight(0xffffff, 3)
        this.pointlight.castShadow = true

        this.scene.add(this.pointlight)

        // Floor setup

        const planeGeometry: PlaneGeometry = new PlaneGeometry(10, 10)

        /*const floorMaterial: MeshBasicMaterial = new MeshBasicMaterial({
            color: 0xffffff,
            map: this.textureLoader.load("/floorTexture.jpg")
        })*/

        const floorMaterial: MeshStandardMaterial = new MeshStandardMaterial({
            color: 0xffffff,
            map: this.textureLoader.load("/floorTexture.jpg"),
            roughness: 0.2
        })

        const floor: Mesh = new Mesh(planeGeometry, floorMaterial)
        floor.castShadow = true
        floor.receiveShadow = true
        floor.rotation.x = MathUtils.degToRad(-90)

        this.scene.add(floor)

        // Box setup

        const boxGeometry: BoxGeometry = new BoxGeometry(5, 1, 5)

        //const boxMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: 0x0000ff })

        const boxMaterial: MeshStandardMaterial = new MeshStandardMaterial({
            color: 0xffffff,
            map: this.textureLoader.load("/boxTexture.jpg"),
            roughness: 0.35
        })

        const box: Mesh = new Mesh(boxGeometry, boxMaterial)
        box.castShadow = true
        box.receiveShadow = true
        box.position.y = 0.5

        this.scene.add(box)

        // Ball setup

        const sphereGeometry: SphereGeometry = new SphereGeometry(0.5)

        //const ballMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: 0x00ff00 })

        const ballMaterial: MeshPhysicalMaterial = new MeshPhysicalMaterial({
            color: 0x999999,
            map: this.textureLoader.load("/ironTexture.jpg"),
            metalness: 0.8,
            roughness: 0.2
        })

        const ball: Mesh = new Mesh(sphereGeometry, ballMaterial)
        ball.castShadow = true
        ball.receiveShadow = true
        ball.position.y = 1.5

        this.scene.add(ball)

        // Ball 2 setup

        const lightMaterial: MeshStandardMaterial = new MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 1
        })

        const ballLight: Mesh = new Mesh(sphereGeometry, lightMaterial)
        ballLight.scale.set(0.5, 0.5, 0.5)
        ballLight.position.copy(ball.position)
        ballLight.position.x += 1.5

        this.scene.add(ballLight)
    }

    start = () => {
        this.renderer.setAnimationLoop(this.render)
    }

    private render = (/*time: DOMHighResTimeStamp*/) => {
        const delta: number = this.clock.getDelta()
        this.tmr += delta

        this.controls.update()

        this.pointlight.position.set(
            Math.sin(this.tmr) * 3,
            2,
            Math.cos(this.tmr) * 3
        )

        this.renderer.render(this.scene, this.camera)
    }
}

export default EP3