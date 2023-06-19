import * as THREE from "three";
import { MyScene } from "./MyScene";
import { MyCamera } from './MyCamera'
import { params } from '../Utils/Params'
 
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

        this.#events(this)
        this.start({
            turn: 0
        })
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


    #setUpRenderer() {
        const renderer = new THREE.WebGLRenderer()

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

        window.addEventListener('keydown', function(e) {
            if (e.key === "ArrowDown" || e.key === "s")
                params.event.x = -1
            else if (e.key === "ArrowUp" || e.key === "w")
                params.event.x = 1
            if (e.key === "d")
                params.event.y = -1
            else if (e.key === "e")
                params.event.y = 1
        })

        window.addEventListener('keyup', function(e) {
            if (e.key === "ArrowDown" || e.key === "s" || e.key === "ArrowUp" || e.key === "w")
                params.event.x = 0
            if (e.key === "d" || e.key === "e")
                params.event.y = 0
        })

    }

}





