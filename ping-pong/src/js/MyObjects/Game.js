import * as THREE from "three";
import * as MyMath from "../MyMath";
import { GuiParams } from "./GuiParams";
import { MyScene } from "./GameObj";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { WorldObj } from "./WorldObj";

export class Game {
    constructor() {
        this.worldObj = new WorldObj()

        this.mousePosition = new MyMath.Vector2D()
        this.renderer = this.#setUpRenderer()
        this.guiParams = new GuiParams()
        this.scene = new MyScene()
        this.world = worldObj.world
        this.camera = new MyCamera(this.guiParams.vectorPos1.x, this.guiParams.vectorPos1.y, this.guiParams.vectorPos1.z)

        this.#events()
        this.#helpers()
    }

    hidden() {
        this.world.step(timeStep)


        this.scene.lightObj.penumbra = this.guiParams.penumbra
        this.scene.lightObj.angle = this.guiParams.angle
        this.scene.lightObj.intensity = this.guiParams.intensity
        this.scene.lightObjHelper.update()
        
        this.#tie(this.scene.planeObj, this.worldObj.groundBody)
        this.#tie(this.scene.upWallObj, this.worldObj.upWallBody)
        this.#tie(this.scene.downWallObj, this.worldObj.downWallBody)
        this.#tie(this.scene.leftWallObj, this.worldObj.leftWallBody)
        this.#tie(this.scene.rightWallObj, this.worldObj.rightWallBody)
        this.#tie(this.scene.racketObj, this.worldObj.racketBody)
        this.#tie(this.scene.ballObj, this.worldObj.ballBody)

        if (false) {
            this.camera.position.x = guiParams.vectorPos1.x;
            this.camera.position.y = guiParams.vectorPos1.y;
            this.camera.position.z = guiParams.vectorPos1.z;
            this.camera.rotation.x = guiParams.vectorRot1.x;
            this.camera.rotation.y = guiParams.vectorRot1.y;
            this.camera.rotation.z = guiParams.vectorRot1.z;
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

    }

/*
##############################################
################# Private ####################
##############################################
*/

    #tie(obj, body) {
        obj.position.copy(body.position)
        obj.quaternion.copy(body.quaternion)
    }

//#region Other 
    #helpers() {
        const axesHelper = new THREE.AxesHelper(10)
        this.scene.add(axesHelper)
        
        const gridHelper = new THREE.GridHelper(30, 30)
        this.scene.add(gridHelper)
        
        const orbit = new OrbitControls(camera, renderer.domElement)
        orbit.update()
    }

    #setUpRenderer() {
        const renderer = new THREE.WebGLRenderer()
        renderer.shadowMap.enabled = true; // Enable shadow map rendering
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Type of shadow map
        
        renderer.setSize(window.innerWidth, window.innerHeight)
        
        const documentRoot = document.getElementById("root")
        documentRoot?.appendChild(renderer.domElement)
        return renderer
    }


    #events() {
        window.addEventListener('resize', function() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('mousemove', function(e) {
            this.mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
            //console.log(mousePosition.x, mousePosition.y)
        })
    }
//#endregion




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