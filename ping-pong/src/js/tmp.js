import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import nebula  from '../img/nebula.jpg'
import stars  from '../img/stars.jpg'

import * as CANNON from 'cannon-es'

function Basics()
{

/***********************************************

#################################################
########### renderer, camera, scene #############
#################################################

************************************************/

const renderer = new THREE.WebGLRenderer()
//renderer.shadowMap.enabled = true
renderer.shadowMap.enabled = true; // Enable shadow map rendering
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Type of shadow map

renderer.setSize(window.innerWidth, window.innerHeight)

const documentRoot = document.getElementById("root")
documentRoot?.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
)

/***********************************************

#################################################
################## dat.gui ######################
#################################################

************************************************/

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

/***********************************************

#################################################
################## helpers ######################
#################################################

************************************************/


const orbit = new OrbitControls(camera, renderer.domElement)

const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)

const gridHelper = new THREE.GridHelper()
scene.add(gridHelper)

camera.position.set(-10, 30, 30)
orbit.update()

/***********************************************

#################################################
################## Objects ######################
#################################################

************************************************/

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


/***********************************************

#################################################
################### Light #######################
#################################################

************************************************/

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

/***********************************************

#################################################
#################### Fog ########################
#################################################

************************************************/
//scene.fog = new THREE.Fog(0xFFFFFF, 0, 200)
//scene.fog = new THREE.FogExp2(0xffffff, 0.001)

/***********************************************

#################################################
################ Textures #######################
#################################################

************************************************/

const textureLoader = new THREE.TextureLoader()
// scene.background = textureLoader.load(stars)

const cubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoader.load([
    nebula, 
    nebula,
    stars,
    stars,
    stars,
    stars,
])

const boxWithTexGeometry = new THREE.BoxGeometry()
const boxWithTexMaterial = new THREE.MeshBasicMaterial({
    //color: 0xFF00FF,
    map: textureLoader.load(
        nebula
    )
})
const bexWithTexMultiMaterial = [
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
]
const boxWithTex = new THREE.Mesh(boxWithTexGeometry, bexWithTexMultiMaterial)
scene.add(boxWithTex)
boxWithTex.position.set(0, 15, 10)

/***********************************************

#################################################
################## Shadow #######################
#################################################

************************************************/

//plane.receiveShadow = true
//sphere.castShadow = true
//spotLight.castShadow = true

/***********************************************

#################################################
############### Select Object ###################
#################################################

************************************************/


const mousePosition = new THREE.Vector2()
const rayCaster = new THREE.Raycaster()

window.addEventListener('mousemove', function(e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
    //console.log(mousePosition.x, mousePosition.y)
})

boxWithTex.name = 'theBox'
function selectObject() {
    rayCaster.setFromCamera(mousePosition, camera)
    const intersects = rayCaster.intersectObjects(scene.children)
    //console.log(intersects)

    for (let item of intersects) {
        if (item.object.id === sphere.id)
            item.object.material.color.set(0xFF0000)
        if (item.object.name === boxWithTex.name) {
            item.object.rotation.x += 0.01;
            item.object.rotation.y += 0.01;
        }
    }

}

/***********************************************

* Changing the position of objects' vertices
* Adding the vertex shader & fragment shaders
#################################################
#################### /// #######################
#################################################

************************************************/

const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    wireframe: true
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);

const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
function animateChangingVertices() {
    plane2.geometry.attributes.position.array[0] = 10 * Math.random();
    plane2.geometry.attributes.position.array[1] = 10 * Math.random();
    plane2.geometry.attributes.position.array[2] = 10 * Math.random();
    plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random();
    plane2.geometry.attributes.position.needsUpdate = true;
}

//-------------------------------------------





/***********************************************

#################################################
################ 3D object ######################
#################################################

************************************************/

const monkeyUrl = new URL('../assets/tennis_ball.glb', import.meta.url)
const assetLoader = new GLTFLoader()
assetLoader.load(monkeyUrl.href, (gltf) => {
    const model = gltf.scene
    scene.add(model)
    model.position.set(0, 10, 0)
    model.scale.set(10, 10, 10)
}, undefined, (errors) => {
    console.log(errors)
})

/***********************************************

#################################################
############ Responsive canvas ##################
#################################################

************************************************/

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


/***********************************************

#################################################
#################### Loop #######################
#################################################

************************************************/



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

    selectObject()
    //animateChangingVertices()

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

}

















function Cannon_Js() {

/***********************************************

#################################################
########### renderer, camera, scene #############
#################################################

************************************************/

const renderer = new THREE.WebGLRenderer()
//renderer.shadowMap.enabled = true
renderer.shadowMap.enabled = true; // Enable shadow map rendering
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Type of shadow map

renderer.setSize(window.innerWidth, window.innerHeight)

const documentRoot = document.getElementById("root")
documentRoot?.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
)

/***********************************************

#################################################
################## dat.gui ######################
#################################################

************************************************/

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

/***********************************************

#################################################
################## helpers ######################
#################################################

************************************************/


const orbit = new OrbitControls(camera, renderer.domElement)

const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)

const gridHelper = new THREE.GridHelper()
scene.add(gridHelper)

camera.position.set(-10, 30, 30)
orbit.update()


/***********************************************

#################################################
################## Objects ######################
#################################################

************************************************/

const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshBasicMaterial({ 
	color: 0xffffff,
	side: THREE.DoubleSide,
	wireframe: true 
 });
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);

const boxGeo = new THREE.BoxGeometry(2, 2, 2);
const boxMat = new THREE.MeshBasicMaterial({
	color: 0x00ff00,
	wireframe: true
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);


const sphereGeo = new THREE.SphereGeometry(2);
const sphereMat = new THREE.MeshBasicMaterial({ 
	color: 0xff0000, 
	wireframe: true,
 });
const sphereMesh = new THREE.Mesh( sphereGeo, sphereMat);
scene.add(sphereMesh);


/***********************************************

#################################################
################### Cannon ######################
#################################################

************************************************/

//npm install cannon-es
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)

})

const groundBodyMaterial = new CANNON.Material()
const groundBody = new CANNON.Body({
    //shape: new CANNON.Plane(),
    shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
    //mass: 1,
    type: CANNON.Body.STATIC,
    material: groundBodyMaterial
})
world.addBody(groundBody)
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0 ,0)


const BoxBodyMaterial = new CANNON.Material()
const boxBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)), //half of the size of the box
    position: new CANNON.Vec3(6, 30, 0),
    material: BoxBodyMaterial
})
boxBody.angularVelocity.set(0, 10, 0);
boxBody.angularDamping = 0.5;
world.addBody(boxBody)

const spherePhysMat = new CANNON.Material();
const sphereBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Sphere(2), //same
    position: new CANNON.Vec3(3, 20, 0),
    material: spherePhysMat
})
sphereBody.linearDamping = 0.21
world.addBody(sphereBody)

/***********************************************

#################################################
######### Friction & restitution ################
#################################################

************************************************/

const groundBoxContactMat = new CANNON.ContactMaterial(
    groundBodyMaterial,
    BoxBodyMaterial,
    {
        friction: 0
    }
)
world.addContactMaterial(groundBoxContactMat)

const groundSphereContactMat = new CANNON.ContactMaterial(
    groundBodyMaterial,
    spherePhysMat,
    {
        restitution: 1,
        friction: 0
    }
)
world.addContactMaterial(groundSphereContactMat)

/***********************************************

#################################################
#################### Loop #######################
#################################################

************************************************/

const timeStep = 1 / 60

function animate()
{
    world.step(timeStep)

    groundMesh.position.copy(groundBody.position)
    groundMesh.quaternion.copy(groundBody.quaternion) //orientation

    boxMesh.position.copy(boxBody.position)
    boxMesh.quaternion.copy(boxBody.quaternion) //orientation

    sphereMesh.position.copy(sphereBody.position)
    sphereMesh.quaternion.copy(sphereBody.quaternion) //orientation

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

}

//Cannon_Js()
Basics()