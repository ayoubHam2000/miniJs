import * as THREE from "three";
import * as MyMath from "../MyMath";
import { GuiParams } from "./GuiParams";
import { MyScene } from "./GameObj";
import { MyCamera } from './MyCamera'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { WorldObj } from "./WorldObj";
import {params} from '../Utils/Params'

export class Game {
    constructor() {
        this.worldObj = new WorldObj()
        this.renderer = this.#setUpRenderer()
        this.rayCaster = new THREE.Raycaster()
        
        this.scene = new MyScene()
        this.world = this.worldObj.world
        this.camera = new MyCamera(params.vectorPos1.x, params.vectorPos1.y, params.vectorPos1.z)

        new GuiParams()
        this.#helpers()
        this.#events(this)
        this.gameSetUp(this)
        
    }

    gameSetUp(obj) {
        obj.worldObj.ballBody.addEventListener("collide", function (event) {
            const collidedBody = event.body; // The body that collided with bodyA
            if (collidedBody.id == obj.worldObj.groundBody.id){
                //console.log("Collision detected between bodyA and", collidedBody);
                obj.worldObj.ballBody.velocity.y = -4
                //console.log(sphereBody.velocity)
                //params.time = new Date().getTime() - params.time
                //console.log(obj.worldObj.ballBody.position.x + params.planeDim.x / 2, params.time)
            }
          });
    }



    tie(obj, body) {
        obj.position.copy(body.position)
        obj.quaternion.copy(body.quaternion)
    }



/*
##############################################
################# Private ####################
##############################################
*/


//#region Other 
    #helpers() {
        //const axesHelper = new THREE.AxesHelper(10)
        //this.scene.add(axesHelper)
        
        const gridHelper = new THREE.GridHelper(30, 30)
        this.scene.add(gridHelper)
        
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        
        
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


    #events(obj) {
        window.addEventListener('resize', function() {
            obj.camera.aspect = window.innerWidth / window.innerHeight;
            obj.camera.updateProjectionMatrix();
            obj.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('mousemove', function(e) {
            params.mousePosition.oldX = params.mousePosition.x;
            params.mousePosition.oldY = params.mousePosition.y;
            params.mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
            params.mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
            params.mouseVelocity.x = params.mousePosition.x - params.mousePosition.oldX;
            params.mouseVelocity.y = params.mousePosition.y - params.mousePosition.oldY; 
            // console.log(params.mouseVelocity)
        })

        window.addEventListener('mousedown', function(e) {
            params.mouseClickPos.x = (e.clientX / window.innerWidth) * 2 - 1;
            params.mouseClickPos.y = - (e.clientY / window.innerHeight) * 2 + 1;
            params.isClicked = true
            //console.log("onmousedown", params.mouseClickPos)
        })

        window.addEventListener('mouseup', function(e) {
            params.isClicked = false
            //console.log("onmouseup", params.mouseClickPos)
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