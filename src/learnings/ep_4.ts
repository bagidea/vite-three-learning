import {
    ACESFilmicToneMapping,
    BoxGeometry,
    Clock,
    DataTexture,
    FogExp2,
    //DirectionalLight,
    MathUtils,
    Mesh,
    MeshPhysicalMaterial,
    //MeshBasicMaterial,
    MeshStandardMaterial,
    PCFShadowMap,
    PerspectiveCamera,
    PlaneGeometry,
    PMREMGenerator,
    RepeatWrapping,
    //PointLight,
    Scene,
    SphereGeometry,
    Texture,
    TextureLoader,
    WebGLRenderer,
    WebGLRenderTarget
} from "three"

import {
    OrbitControls,
    RGBELoader
} from "three/examples/jsm/Addons.js"

class EP4 {
    private canvas: HTMLCanvasElement = null!

    private renderer: WebGLRenderer = null!
    private scene: Scene = null!
    private camera: PerspectiveCamera = null!

    private controls: OrbitControls = null!

    ///////////////////

    private textureLoader: TextureLoader = null!

    private rgbeLoader: RGBELoader = null!

    ///////////////////

    //private pointlight: PointLight = null!
    private tmr: number = 0

    private clock: Clock = null!

    constructor(canvas: HTMLCanvasElement) {
        console.log("EP4 initialized")

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
        this.renderer.toneMapping = ACESFilmicToneMapping // Tone mapping

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

    private load_tile_texture = (url: string): Texture => {
        return this.textureLoader.load(url, (data: Texture) => {
            data.wrapS = RepeatWrapping
            data.wrapT = RepeatWrapping
            data.repeat.set(20, 20)
        })
    }

    create = () => {
        // Environment setup

        const pmrem_generator = new PMREMGenerator(this.renderer)
        pmrem_generator.compileEquirectangularShader()

        this.rgbeLoader = new RGBELoader()

        this.rgbeLoader.load("hdri/env.hdr", (data: DataTexture) => {
            const hdr_map: WebGLRenderTarget<Texture> = pmrem_generator.fromEquirectangular(data)

            pmrem_generator.dispose()
            data.dispose()

            this.scene.environment = hdr_map.texture
            this.scene.background = hdr_map.texture
            this.scene.fog = new FogExp2(0xB69D86, 0.025)
        })

        // Sun

        /*const directionalLight: DirectionalLight = new DirectionalLight(0xffffff, 0.2)
        directionalLight.castShadow = true
        directionalLight.position.set(5, 10, 7.5)

        this.scene.add(directionalLight)*/

        // Point light

        /*this.pointlight = new PointLight(0xffffff, 3)
        this.pointlight.castShadow = true

        this.scene.add(this.pointlight)*/

        // Floor setup

        const planeGeometry: PlaneGeometry = new PlaneGeometry(200, 200)

        /*const floorMaterial: MeshBasicMaterial = new MeshBasicMaterial({
            color: 0xffffff,
            map: this.textureLoader.load("/floorTexture.jpg")
        })*/

        const floorMaterial: MeshStandardMaterial = new MeshStandardMaterial({
            color: 0xffffff,
            map: this.load_tile_texture("textures/concrete_rock_path_diff_1k.jpg"),
            normalMap: this.load_tile_texture("textures/concrete_rock_path_nor_gl_1k.jpg"),
            aoMap: this.load_tile_texture("textures/concrete_rock_path_ao_1k.jpg"),
            roughnessMap: this.load_tile_texture("textures/concrete_rock_path_rough_1k.jpg"),
            //roughness: 0.2
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
            map: this.textureLoader.load("textures/wooden_gate_diff_1k.jpg"),
            normalMap: this.textureLoader.load("textures/wooden_gate_nor_gl_1k.jpg"),
            aoMap: this.textureLoader.load("textures/wooden_gate_ao_1k.jpg"),
            roughnessMap: this.textureLoader.load("textures/wooden_gate_rough_1k.jpg"),
            //roughness: 0.35
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
            map: this.textureLoader.load("textures/rusty_metal_04_diff_1k.jpg"),
            normalMap: this.textureLoader.load("textures/rusty_metal_04_nor_gl_1k.jpg"),
            aoMap: this.textureLoader.load("textures/rusty_metal_04_ao_1k.jpg"),
            metalnessMap: this.textureLoader.load("textures/rusty_metal_04_metal_1k.jpg"),
            roughnessMap: this.textureLoader.load("textures/rusty_metal_04_rough_1k.jpg"),
            //metalness: 0.8,
            roughness: 0.2
        })

        const ball: Mesh = new Mesh(sphereGeometry, ballMaterial)
        ball.castShadow = true
        ball.receiveShadow = true
        ball.position.y = 1.5

        this.scene.add(ball)

        // Ball 2 setup

        /*const lightMaterial: MeshStandardMaterial = new MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 1
        })

        const ballLight: Mesh = new Mesh(sphereGeometry, lightMaterial)
        ballLight.scale.set(0.5, 0.5, 0.5)
        ballLight.position.copy(ball.position)
        ballLight.position.x += 1.5

        this.scene.add(ballLight)*/
    }

    start = () => {
        this.renderer.setAnimationLoop(this.render)
    }

    private render = (/*time: DOMHighResTimeStamp*/) => {
        const delta: number = this.clock.getDelta()
        this.tmr += delta

        this.controls.update()

        /*this.pointlight.position.set(
            Math.sin(this.tmr) * 3,
            2,
            Math.cos(this.tmr) * 3
        )*/

        this.renderer.render(this.scene, this.camera)
    }
}

export default EP4