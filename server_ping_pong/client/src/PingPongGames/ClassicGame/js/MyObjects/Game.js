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
            scorePlayer1: 0,
            scorePlayer2: 0,
            start: false
        }

        this.#events(this)
    }

    isStarted() {
        return this.gameInfo.start === true
    }

    start(data) {
        console.log("Game is started ...")
        this.gameInfo.turn = data.turn
        this.gameInfo.start = true
    }

    changeScore(data) {
        let p = data.score
        this.gameInfo.scorePlayer1 = p[0]
        this.gameInfo.scorePlayer2 = p[1]
        this.scene.scoreP1.set(this.gameInfo.scorePlayer1)
        this.scene.scoreP2.set(this.gameInfo.scorePlayer2)
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
            if (e.key === "ArrowUp" || e.key === "w")
                params.event.x = 1
        })

        window.addEventListener('keyup', function(e) {
            if (e.key === "ArrowDown" || e.key === "s" || e.key === "ArrowUp" || e.key === "w")
                params.event.x = 0
        })

    }

}





