import * as THREE from "three";
import { GuiParams } from "./GuiParams";
import { MyScene } from "./MyScene";
import { MyCamera } from './MyCamera'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import {params} from '../Utils/Params'

export class Game {
    constructor() {
      
        this.renderer = this.#setUpRenderer()
        this.scene = new MyScene()
        this.camera = new MyCamera()


        this.gameInfo = {
            turn: 0, //the player that will shot the ball
            scorePlayer1: 0,
            scorePlayer2: 0,
            start: false
        }

        this.guiParams = new GuiParams()
        this.#helpers()
        this.#events(this)

    }

    start(data) {
        console.log("Game is started ...")
        this.gameInfo.turn = data.turn
        this.gameInfo.start = true
    }

    getTurn() {
        return this.gameInfo.turn
    }


    //===========================================
    //===========================================

    #helpers() {
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
            params.mouse.oldX = params.mouse.x;
            params.mouse.oldY = params.mouse.y;
            params.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            params.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
            params.mouse.vx = params.mouse.x - params.mouse.oldX;
            params.mouse.vy = params.mouse.y - params.mouse.oldY; 
        })

        window.addEventListener('mousedown', function(e) {
            params.mouse.cx = (e.clientX / window.innerWidth) * 2 - 1;
            params.mouse.cy = - (e.clientY / window.innerHeight) * 2 + 1;
            params.mouse.isClicked = true
            //console.log("onmousedown", params.mouseClickPos)
        })

        window.addEventListener('mouseup', function(e) {
            params.mouse.isClicked = false
            //console.log("onmouseup", params.mouseClickPos)
        })
    }

}





