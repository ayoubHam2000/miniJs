import * as THREE from "three";
import { GuiParams } from "./GuiParams";
import { MyScene } from "./GameObj";
import { MyCamera } from './MyCamera'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import {params} from '../Utils/Params'
import { GameConst } from "./gameConst";

export class Game {
    constructor() {
        this.gameConst = new GameConst()
      
        this.renderer = this.#setUpRenderer()
        this.rayBall = new THREE.Raycaster()
        
        this.scene = new MyScene()
       
        this.camera = new MyCamera(params.vectorPos1.x, params.vectorPos1.y, params.vectorPos1.z)


        this.gameInfo = {
            turn: 0, //the player that will shot the ball
            initTurn: 0,
            scorePlayer1: 0,
            scorePlayer2: 0
        }

        this.guiParams = new GuiParams()
        this.#helpers()
        this.#events(this)
        //this.gameSetUp(this)
        
    }

    getTurn() {
        //0->player1 1->player2
        let a = this.gameInfo.initTurn + parseInt((this.gameInfo.scorePlayer1 + this.gameInfo.scorePlayer2) / 2)
        return (a % 2)
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
        
        //const gridHelper = new THREE.GridHelper(30, 30)
        //this.scene.add(gridHelper)
        
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        
        
    }

    #setUpRenderer() {
        //THREE.ColorManagement.enabled = true;
        const renderer = new THREE.WebGLRenderer()
        // renderer.setPixelRatio(window.devicePixelRatio * 1);
        //renderer.outputColorSpace = THREE.SRGBColorSpace;
        // THREE.SRGBColorSpace = "srgb"
        renderer.shadowMap.enabled = true; // Enable shadow map rendering
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Type of shadow map
        
        renderer.setSize(window.innerWidth, window.innerHeight)
        
        const documentRoot = document.getElementById("root")
        documentRoot?.appendChild(renderer.domElement)
        return renderer
    }

    async load3dObjects() {
        await this.scene.load3dObjects()
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
            // console.log(params.mousePosition)
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





