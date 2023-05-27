import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as CANNON from 'cannon-es'
//dev
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"


import { MyCamera } from "./MyObjects";
import { GuiParams } from "./MyObjects";

function setUpRenderer() {
    const renderer = new THREE.WebGLRenderer()
    renderer.shadowMap.enabled = true; // Enable shadow map rendering
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Type of shadow map
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    
    const documentRoot = document.getElementById("root")
    documentRoot?.appendChild(renderer.domElement)
    return renderer
}

async function Game() {
    const mousePosition = new THREE.Vector2()
    const renderer = setUpRenderer()
    const scene = new THREE.Scene()
    const camera = new MyCamera()
    const guiParams = new GuiParams()


    
    // const axesHelper = new THREE.AxesHelper(10)
    // scene.add(axesHelper)
    
    const gridHelper = new THREE.GridHelper(30, 30)
    scene.add(gridHelper)
    
    //const orbit = new OrbitControls(camera, renderer.domElement)
    camera.position.set(guiParams.vectorPos1.x, guiParams.vectorPos1.y, guiParams.vectorPos1.z)
    //orbit.update()
    

    function events() {
        window.addEventListener('resize', function() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('mousemove', function(e) {
            mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
            mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
            //console.log(mousePosition.x, mousePosition.y)
        })
    }


    //==============================================

    

//region objects
//#############################################
//#############################################

const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(-50, 50, 0)
spotLight.castShadow = true
spotLight.angle = 0.2
scene.add(spotLight)
const sLightHelper = new THREE.SpotLightHelper(spotLight)
//scene.add(sLightHelper)

const planeDim = {x: 27.4, y: 15.25}
const planeGeometry = new THREE.PlaneGeometry(planeDim.x, planeDim.y)
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: false
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
//plane.rotation.x = 0.5 * Math.PI
scene.add(plane)

const upWallMeshGeometry = new THREE.PlaneGeometry(planeDim.x, planeDim.y, 50)
const upWallMeshMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true,
    
})
const upWallMesh = new THREE.Mesh(upWallMeshGeometry, upWallMeshMaterial)
//plane.rotation.x = 0.5 * Math.PI
//scene.add(upWallMesh)

const downWallMeshGeometry = new THREE.PlaneGeometry(planeDim.x, planeDim.y, 50)
const downWallMeshMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true
})
const downWallMesh = new THREE.Mesh(downWallMeshGeometry, downWallMeshMaterial)
//plane.rotation.x = 0.5 * Math.PI
//scene.add(downWallMesh)

const leftWallMeshGeometry = new THREE.PlaneGeometry(planeDim.x, planeDim.y, 50)
const leftWallMeshMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true
})
const leftWallMesh = new THREE.Mesh(leftWallMeshGeometry, leftWallMeshMaterial)
//plane.rotation.x = 0.5 * Math.PI
//scene.add(leftWallMesh)

const rightWallMeshGeometry = new THREE.PlaneGeometry(planeDim.x, planeDim.y, 50)
const rightWallMeshMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true
})
const rightWallMesh = new THREE.Mesh(rightWallMeshGeometry, rightWallMeshMaterial)
//plane.rotation.x = 0.5 * Math.PI
//scene.add(rightWallMesh)

const racketDim = {
    x: 1.5,
    y: 1.5
}
const racketMeshGeometry = new THREE.PlaneGeometry(racketDim.x, racketDim.y, 1)
const racketMeshMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff00,
    side: THREE.DoubleSide,
    wireframe: false
})
const racketMesh = new THREE.Mesh(racketMeshGeometry, racketMeshMaterial)
//plane.rotation.x = 0.5 * Math.PI
scene.add(racketMesh)

const sphereDim = 0.25
const sphereGeo = new THREE.SphereGeometry(sphereDim);
const sphereMat = new THREE.MeshBasicMaterial({ 
	color: 0xff0000, 
	wireframe: true,
 });
const sphere = new THREE.Mesh( sphereGeo, sphereMat);
scene.add(sphere);

//endregion


//region cannon
//#############################################
//#############################################

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9, 0)

})

const groundBodyMaterial = new CANNON.Material()
const groundBody = new CANNON.Body({
    //shape: new CANNON.Plane(),
    shape: new CANNON.Box(new CANNON.Vec3(planeDim.x / 2, planeDim.y / 2, 0.1)),
    //mass: 1,
    type: CANNON.Body.STATIC,
    material: groundBodyMaterial
})
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0 ,0)
world.addBody(groundBody)


const upWallMaterial = new CANNON.Material()
const upWall = new CANNON.Body({
    //shape: new CANNON.Plane(),
    shape: new CANNON.Box(new CANNON.Vec3(planeDim.x / 2, planeDim.y / 2, 0.1)),
    //mass: 1,
    type: CANNON.Body.STATIC,
    position: new CANNON.Vec3(planeDim.x / 2, 0, 0),
    material: upWallMaterial,
    
})
upWall.quaternion.setFromEuler(-Math.PI / 2, -Math.PI / 2 , 0)
//world.addBody(upWall)

const downWallMaterial = new CANNON.Material()
const downWall = new CANNON.Body({
    //shape: new CANNON.Plane(),
    shape: new CANNON.Box(new CANNON.Vec3(planeDim.x / 2, planeDim.y / 2, 0.1)),
    //mass: 1,
    type: CANNON.Body.STATIC,
    position: new CANNON.Vec3(-planeDim.x / 2, 0, 0),
    material: downWallMaterial
})
downWall.quaternion.setFromEuler(-Math.PI / 2, -Math.PI / 2 , 0)
world.addBody(downWall)

//======

const leftWallMaterial = new CANNON.Material()
const leftWall = new CANNON.Body({
    //shape: new CANNON.Plane(),
    shape: new CANNON.Box(new CANNON.Vec3(planeDim.x / 2, planeDim.y / 2, 0.1)),
    //mass: 1,
    type: CANNON.Body.STATIC,
    position: new CANNON.Vec3(0, 0, planeDim.y / 2),
    material: leftWallMaterial
})
leftWall.quaternion.setFromEuler(0, 0 , 0)
world.addBody(leftWall)

const rightWallMaterial = new CANNON.Material()
const rightWall = new CANNON.Body({
    //shape: new CANNON.Plane(),
    shape: new CANNON.Box(new CANNON.Vec3(planeDim.x / 2, planeDim.y / 2, 0.1)),
    //mass: 1,
    type: CANNON.Body.STATIC,
    position: new CANNON.Vec3(0, 0, -racketDim.y / 2),
    material: rightWallMaterial
})
rightWall.quaternion.setFromEuler(0, 0 , 0)
world.addBody(rightWall)

const racketMaterial = new CANNON.Material()
const racket = new CANNON.Body({
    //shape: new CANNON.Plane(),
    shape: new CANNON.Box(new CANNON.Vec3(racketDim.x / 2, racketDim.y / 2, 1)),
    //mass: 1,
    type: CANNON.Body.STATIC,
    position: new CANNON.Vec3(planeDim.x / 2 , 0, 0),
    material: racketMaterial
})
racket.quaternion.setFromEuler(0, -Math.PI / 2 , 0)
world.addBody(racket)


const spherePhysMat = new CANNON.Material();
const sphereBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Sphere(sphereDim), //same
    position: new CANNON.Vec3(-12, 5, 0),
    material: spherePhysMat
})
sphereBody.linearDamping = 0
// Apply force to the body
var force = new CANNON.Vec3(300, 0, 0); // Define the force vector
var offset = new CANNON.Vec3(0, 0, 0); // Offset from the center of mass to apply the force
sphereBody.applyForce(force, offset);
world.addBody(sphereBody)


/*
#################################################
######### Friction & restitution ################
#################################################
*/

const groundSphereContactMat = new CANNON.ContactMaterial(
    groundBodyMaterial,
    spherePhysMat,
    {
        restitution: 1,
        friction: 0
    }
)
world.addContactMaterial(groundSphereContactMat)


const upWallSphereContactMat = new CANNON.ContactMaterial(
    upWallMaterial,
    spherePhysMat,
    {
        restitution: 1,
        friction: 0
    }
)
world.addContactMaterial(upWallSphereContactMat)


const downWallSphereContactMat = new CANNON.ContactMaterial(
    downWallMaterial,
    spherePhysMat,
    {
        restitution: 1,
        friction: 0
    }
)
world.addContactMaterial(downWallSphereContactMat)

const rightWallSphereContactMat = new CANNON.ContactMaterial(
    rightWallMaterial,
    spherePhysMat,
    {
        restitution: 1,
        friction: 0
    }
)
world.addContactMaterial(rightWallSphereContactMat)

const racketSphereContactMat = new CANNON.ContactMaterial(
    racketMaterial,
    spherePhysMat,
    {
        restitution: 1,
        friction: 0
    }
)
world.addContactMaterial(racketSphereContactMat)

const leftWallSphereContactMat = new CANNON.ContactMaterial(
    leftWallMaterial,
    spherePhysMat,
    {
        restitution: 1,
        friction: 0
    }
)
world.addContactMaterial(leftWallSphereContactMat)


//endregion


  
const racket2DPosition = new THREE.Vector2(0, 0)
window.addEventListener('keydown', function(event) {
    const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"

    if (key == 'ArrowRight') {
        racket2DPosition.x += 0.1
    }
    else if (key == 'ArrowLeft') {
        racket2DPosition.x -= 0.1
    }
    if (key == 'ArrowUp') {
        racket2DPosition.y += 0.1
    }
    else if (key == 'ArrowDown') {
        racket2DPosition.y -= 0.1
    }
});

const timeStep = 1 / 30
let run = true

function dist3D(a, b) {
    let arr = [
        (a.x - b.x),
        (a.y - b.y),
        (a.z - b.z),
    ]
    return arr.map((item) => item ** 2).reduce((res, b) => res + b)
}

function dist2D(a, b) {
    let arr = [
        (a.x - b.x),
        (a.y - b.y)
    ]
    return arr.map((item) => item ** 2).reduce((res, b) => res + b)
}





function lineEquation(p1, p2) {
    let a = (p1.y - p2.y) / (p1.x - p1.y)
    let b = p1.y - p1.x * a
    return {
        a, b
    }
}

function test() {
    let p1 = new THREE.Vector2(- planeDim.z / 2, - planeDim.x / 2)
    let p2 = new THREE.Vector2(+ planeDim.z / 2, + planeDim.x / 2)
    let {a, b} =  lineEquation(p1, p2)

}

sphereBody.addEventListener("collide", function (event) {
    const collidedBody = event.body; // The body that collided with bodyA
    if (collidedBody.id == groundBody.id){
        //console.log("Collision detected between bodyA and", collidedBody);
        sphereBody.velocity.y = -4
        //console.log(sphereBody.velocity)
    }
  });

function animate()
{
    world.step(timeStep)
    //if (scene?.children[4])
        //   scene.children[4].position.y += 0.1
    //racketModel?.position?.y += 0.01
    spotLight.penumbra = guiParams.penumbra
    spotLight.angle = guiParams.angle
    spotLight.intensity = guiParams.intensity
    sLightHelper.update()
    

    plane.position.copy(groundBody.position)
    plane.quaternion.copy(groundBody.quaternion) //orientation

    upWallMesh.position.copy(upWall.position)
    upWallMesh.quaternion.copy(upWall.quaternion) //orientation

    downWallMesh.position.copy(downWall.position)
    downWallMesh.quaternion.copy(downWall.quaternion) //orientation

    leftWallMesh.position.copy(leftWall.position)
    leftWallMesh.quaternion.copy(leftWall.quaternion) //orientation

    rightWallMesh.position.copy(rightWall.position)
    rightWallMesh.quaternion.copy(rightWall.quaternion) //orientation

    racketMesh.position.copy(racket.position)
    racketMesh.quaternion.copy(racket.quaternion) //orientation

    sphere.position.copy(sphereBody.position)
    sphere.quaternion.copy(sphereBody.quaternion) //orientation

/*
x
: 
27.224015644774738
y
: 
9.5590092365367
z
: 
-0.0030220727265528576

_x
: 
-1.5645562237068398
_y
: 
1.193182409961608
_z
: 
1.5640832826035491

*/
    //console.log(racket2DPosition)
    //console.log(camera.position)

    //console.log(racket.position)
  




    function getSign(x){
        return x < 0 ? -1 : 1 
    }
    //((x + 1) / 2) * (b - a) + a
    const linePers = ((-mousePosition.x + 1) / 2) * (planeDim.y) + (- planeDim.y / 2)
    const theDimX = 35;
    const intheX = ((-mousePosition.y + 1) / 2) * (theDimX) + (- theDimX / 2) + 10
    //racket.position.z = linePers;
    //racket.position.x = intheX
    //console.log(linePers)

    let sphereVelocity = sphereBody.velocity
    let sphereVelocitySign = {
        x: getSign(sphereVelocity.x),
        y: getSign(sphereVelocity.y),
        z: getSign(sphereVelocity.z)
    }
    let sphereVelocityForce = {
        x: 8,
        y: 5,
        z: 1
    }

    if (sphereBody.position.y > 5) {
        sphereVelocitySign.y = -1;
    }

    sphereBody.velocity.x = sphereVelocitySign.x * sphereVelocityForce.x
    //sphere.velocity.y = sphereVelocitySign.x * sphereVelocityForce.x
    //sphereBody.velocity.y = sphereVelocitySign.y * sphereVelocityForce.y

    

    if (sphereBody.position.y <= -20) {
        sphereBody.position = new CANNON.Vec3(-12, 5, 0)
        sphereBody.velocity = new CANNON.Vec3(0, 0, 0)
    }


    if (false) {
        camera.position.x = guiParams.vectorPos1.x;
        camera.position.y = guiParams.vectorPos1.y;
        camera.position.z = guiParams.vectorPos1.z;
        camera.rotation.x = guiParams.vectorRot1.x;
        camera.rotation.y = guiParams.vectorRot1.y;
        camera.rotation.z = guiParams.vectorRot1.z;
    }

    if (run) {
        camera.rotation.x = -Math.PI / 2;
        camera.rotation.y = Math.PI / 2 - 0.4;
        camera.rotation.z = Math.PI / 2;
        camera.position.x = 40;
        camera.position.y = 16;
        camera.position.z = 0;
        run = !run 
    }
    renderer.render(scene, camera)
}

events()

renderer.setAnimationLoop(animate)



}

/*
async function load3dObjects() {
    const assetLoader = new GLTFLoader()
    const tableUrl = new URL('../assets/table_tennis_table.glb', import.meta.url)
    const racketUrl = new URL('../assets/tennis_racket_wilson_blade.glb', import.meta.url)
    const ballUrl = new URL('../assets/tennis_ball.glb', import.meta.url)
    const table = await assetLoader.loadAsync(tableUrl.href)
    const racket = await assetLoader.loadAsync(racketUrl.href)
    const ball = await assetLoader.loadAsync(ballUrl.href)
    return [table, racket, ball]
   }
   //[table, racket, ball] = await load3dObjects()
    //const model = table.scene
    //scene.add(model)
    //model.position.set(0, 0, 0)
    //model.scale.set(1, 1, 1)
*/


Game()