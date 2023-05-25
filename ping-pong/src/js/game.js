import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as CANNON from 'cannon-es'
//dev
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from 'dat.gui'


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
    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
    )


    const cameraPosition = {
        x: 15,
        y: 10,
        z: 9
      };

    function helpers() {
        const gui = new dat.GUI()
    
        const options = {
            sphereColor: "#00ff00",
            wireFrame: false,
            speed: 0.01,
            penumbra: 0,
            intensity: 1,
            angle: 0.2,
        }
    
       

        const vectorFolder = gui.addFolder('cameraPosition');

        // Add controls for each component (x, y, z)
        vectorFolder.add(cameraPosition, 'x', -10, 10).step(0.1).name('cameraX')
        vectorFolder.add(cameraPosition, 'y', -10, 10).step(0.1).name('cameraY')
        vectorFolder.add(cameraPosition, 'z', -10, 10).step(0.1).name('cameraZ')
        
       

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
    
        const orbit = new OrbitControls(camera, renderer.domElement)
    
        const axesHelper = new THREE.AxesHelper(10)
        scene.add(axesHelper)
    
        const gridHelper = new THREE.GridHelper()
        scene.add(gridHelper)
    
        camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
        
        orbit.update()
        return options
    }
    const options = helpers()

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
scene.add(sLightHelper)

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
    wireframe: true
})
const upWallMesh = new THREE.Mesh(upWallMeshGeometry, upWallMeshMaterial)
//plane.rotation.x = 0.5 * Math.PI
scene.add(upWallMesh)

const downWallMeshGeometry = new THREE.PlaneGeometry(planeDim.x, planeDim.y, 50)
const downWallMeshMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true
})
const downWallMesh = new THREE.Mesh(downWallMeshGeometry, downWallMeshMaterial)
//plane.rotation.x = 0.5 * Math.PI
scene.add(downWallMesh)

const leftWallMeshGeometry = new THREE.PlaneGeometry(planeDim.x, planeDim.y, 50)
const leftWallMeshMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true
})
const leftWallMesh = new THREE.Mesh(leftWallMeshGeometry, leftWallMeshMaterial)
//plane.rotation.x = 0.5 * Math.PI
scene.add(leftWallMesh)

const rightWallMeshGeometry = new THREE.PlaneGeometry(planeDim.x, planeDim.y, 50)
const rightWallMeshMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true
})
const rightWallMesh = new THREE.Mesh(rightWallMeshGeometry, rightWallMeshMaterial)
//plane.rotation.x = 0.5 * Math.PI
scene.add(rightWallMesh)

const racketDim = {
    x: planeDim.x / 8,
    y: planeDim.y
}
const racketMeshGeometry = new THREE.PlaneGeometry(racketDim.x, racketDim.y, 1)
const racketMeshMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    side: THREE.DoubleSide,
    wireframe: false
})
const racketMesh = new THREE.Mesh(racketMeshGeometry, racketMeshMaterial)
//plane.rotation.x = 0.5 * Math.PI
scene.add(racketMesh)

const sphereDim = 0.5
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
    gravity: new CANNON.Vec3(0, -9.81, 0)

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
    material: upWallMaterial
})
upWall.quaternion.setFromEuler(-Math.PI / 2, -Math.PI / 2 , 0)
world.addBody(upWall)

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
    position: new CANNON.Vec3(0, 0, -planeDim.y / 2),
    material: rightWallMaterial
})
rightWall.quaternion.setFromEuler(0, 0 , 0)
world.addBody(rightWall)

const racketMaterial = new CANNON.Material()
const racket = new CANNON.Body({
    //shape: new CANNON.Plane(),
    shape: new CANNON.Box(new CANNON.Vec3(racketDim.x / 2, racketDim.y / 2, 0.1)),
    //mass: 1,
    type: CANNON.Body.STATIC,
    position: new CANNON.Vec3(planeDim.x / 2 - 1, 0, 0),
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


  

   

const timeStep = 1 / 30
 
function animate()
{
    world.step(timeStep)
    //if (scene?.children[4])
        //   scene.children[4].position.y += 0.1
    //racketModel?.position?.y += 0.01
    spotLight.penumbra = options.penumbra
    spotLight.angle = options.angle
    spotLight.intensity = options.intensity
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

    racket.position.z = -mousePosition.x * planeDim.x;
    racket.quaternion.setFromEuler(0, mousePosition.y, 0);
    racket.position.x = (planeDim.x / 2 - 1) - mousePosition.y / 2;

    racketMesh.position.copy(racket.position)
    racketMesh.quaternion.copy(racket.quaternion) //orientation

    sphere.position.copy(sphereBody.position)
    sphere.quaternion.copy(sphereBody.quaternion) //orientation

    //camera.rotation.x = cameraPosition.x;
    //camera.rotation.y = cameraPosition.y;
    //camera.rotation.z = cameraPosition.z;

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