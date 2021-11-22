import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

const gui = new dat.GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

var animation = null

const loader = new FBXLoader()
loader.load("dance.fbx", (mesh) => {
    mesh.scale.set(0.0005, 0.0005, 0.0005)
    scene.add(mesh)
    animation = new THREE.AnimationMixer(mesh)
    const dancing = animation.clipAction(mesh.animations[0])
    dancing.play()
})

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 3
camera.position.z = 2
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()

const tick = () => {

    const elapsedTime = clock.getElapsedTime()

    renderer.render(scene, camera)
    controls.update()
    window.requestAnimationFrame(tick)

    const delta = clock.getDelta()
    if (animation) {
        animation.update(delta * 20)
    }
}

tick()