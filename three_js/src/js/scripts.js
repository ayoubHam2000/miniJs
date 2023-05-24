import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from 'dat.gui '

import nebula  from '../img/nebula.jpg'
import stars  from '../img/stars.jpg'

function test2()
{
// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow map rendering
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Type of shadow map
document.body.appendChild(renderer.domElement);

// Create a cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true; // Enable shadow casting
scene.add(cube);

// Create a floor
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.receiveShadow = true; // Enable shadow receiving
floor.rotation.x = -Math.PI / 2; // Rotate the floor to be horizontal
scene.add(floor);

// Create a directional light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 0);
light.castShadow = true; // Enable shadow casting for the light
light.shadow.mapSize.width = 1024; // Shadow map width
light.shadow.mapSize.height = 1024; // Shadow map height
light.shadow.camera.near = 0.5; // Near plane of the shadow camera
light.shadow.camera.far = 500; // Far plane of the shadow camera
scene.add(light);

// Create a helper to visualize the light's position and target
const lightHelper = new THREE.DirectionalLightHelper(light);
scene.add(lightHelper);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();




}

function test1()
{

const renderer = new THREE.WebGLRenderer()
//renderer.shadowMap.enabled = true
renderer.shadowMap.enabled = true; // Enable shadow map rendering
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Type of shadow map

renderer.setSize(window.innerWidth, window.innerHeight)

const documentRoot = document.getElementById("root")
documentRoot?.appendChild(renderer.domElement)

const scene = new THREE.Scene()

//dat.gui
const gui = new dat.GUI()

const options = {
    sphereColor: "#00ff00",
    wireFrame: false,
    speed: 0.01,
    penumbra: 0,
    intensity: 1,
    angle: 0.2
}

gui.addColor(options, 'sphereColor').onChange((e) => {
    sphere.material.color.set(e)
})

gui.add(options, 'wireFrame').onChange((e) => {
    sphere.material.wireframe = e
})

gui.add(options, 'speed', 0, 1, 0.01);
gui.add(options, 'penumbra', 0, 5, 0.01);
gui.add(options, 'intensity', 0, 5, 0.01);
gui.add(options, 'angle', 0, 1, 0.01);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
)

const orbit = new OrbitControls(camera, renderer.domElement)


const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)

const gridHelper = new THREE.GridHelper()
scene.add(gridHelper)

camera.position.set(-10, 30, 30)
orbit.update()

const boxGeometry = new THREE.BoxGeometry()
const boxMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00
})
const box = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(box)

//Plane
const planeGeometry = new THREE.PlaneGeometry(30, 30)
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = 0.5 * Math.PI
plane.receiveShadow = true
scene.add(plane)

//Sphere
//Lambert and Standard mash material need light
const sphereGeometry = new THREE.SphereGeometry(1, 50, 50);
// const sphereMaterial = new THREE.MeshBasicMaterial({
//     color: 0x0000ff,
//     wireframe: true
// })
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000ff,
    wireframe: false
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.castShadow = true
scene.add(sphere)


//Light
// const light = new THREE.AmbientLight(0xffffffff)
// scene.add(light)

// const directionLight = new THREE.DirectionalLight(0xffffff, 0.8)
// directionLight.position.set(-30, 50, 0)
// directionLight.castShadow = true
// scene.add(directionLight)
// const dCameraHelper = new THREE.CameraHelper(directionLight.shadow.camera)
// scene.add(dCameraHelper)
// const dLightHelper = new THREE.DirectionalLightHelper(directionLight, 5)
// scene.add(dLightHelper)
//Set up shadow properties for the light
// directionLight.shadow.mapSize.width = 512; // default
// directionLight.shadow.mapSize.height = 512; // default
// directionLight.shadow.camera.near = 0.5; // default
// directionLight.shadow.camera.far = 500; // default

const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(-50, 50, 0)
spotLight.castShadow = true
spotLight.angle = 0.2
scene.add(spotLight)
const sLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(sLightHelper)

let step = 0;

//Fog
//scene.fog = new THREE.Fog(0xFFFFFF, 0, 200)
//scene.fog = new THREE.FogExp2(0xffffff, 0.001)


//textures
const textureLoader = new THREE.TextureLoader()
scene.background = textureLoader.load(stars)

//shadow

//plane.receiveShadow = true
//sphere.castShadow = true
//spotLight.castShadow = true

function animate()
{
    box.rotation.z += 0.01
    box.rotation.x += 0.01

    step += options.speed
    sphere.position.y = 5 * Math.sin(step)

    spotLight.penumbra = options.penumbra
    spotLight.angle = options.angle
    spotLight.intensity = options.intensity
    sLightHelper.update()

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

}


//test2()
test1()