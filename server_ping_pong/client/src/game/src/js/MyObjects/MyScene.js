import * as THREE from "three";
import {params} from '../Utils/Params'
import {loaderResult} from '../Utils/Loader'

import { AmbientLight } from "./AmbientLight";
import { Ball } from "./Ball";
import { Racket } from "./Racket";
import { Net } from "./Net";
import { Bot } from "./Bot";
import { SpotLight } from "./SpotLight";
import { Human } from "./Human";


export class MyScene extends THREE.Scene {
   
   
    constructor () {
        super()



        //const wallsObj = this.#wallsObj()
        const models = this.#modelsObj()

        if (params.loadTex) {
            this.environmentSceneObj = this.#environmentScene()
            this.add(this.environmentSceneObj)
        }
        
        this.tableModel = models.tableModel
        this.add(this.tableModel)

        //used
        this.racketModel = models.racketModel
    }

    init(game) {
        this.game = game
        this.game.scene = this
        this.ambientLightObj = new AmbientLight(game)
        this.spotLight = new SpotLight(game)
        this.netObj = new Net(game)
        this.ballObj = new Ball(game)
        this.racketObj = new Racket(game)

        if (game.gameInfo.isBot) {
            this.player2 = new Bot(game)
        } else {
            this.player2 = new Human(game)
        }
        
    } 

    #environmentScene() {
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
      
        const bexWithTexMultiMaterial = [
            new THREE.MeshStandardMaterial({
                side: THREE.BackSide,
                normalMap: loaderResult.tex.backWall.normalMap,
                map: loaderResult.tex.backWall.tex
            }),//back
            new THREE.MeshStandardMaterial({
                side: THREE.BackSide,
                normalMap: loaderResult.tex.frontWall.normalMap,
                map: loaderResult.tex.frontWall.tex
            }),//front
            new THREE.MeshStandardMaterial({
                side: THREE.BackSide, 
                normalMap: loaderResult.tex.floor.normalMap, 
                map: loaderResult.tex.floor.tex
            }),//up
            new THREE.MeshStandardMaterial({
                side: THREE.BackSide, 
                normalMap: loaderResult.tex.floor.normalMap, 
                map: loaderResult.tex.floor.tex
            }),//down
            new THREE.MeshStandardMaterial({
                side: THREE.BackSide, 
                normalMap: loaderResult.tex.leftWall.normalMap, 
                map: loaderResult.tex.leftWall.tex
            }),//left
            new THREE.MeshStandardMaterial({
                side: THREE.BackSide, 
                normalMap: loaderResult.tex.rightWall.normalMap, 
                map: loaderResult.tex.rightWall.tex
            }),//right
        ]   
        //console.log(bexWithTexMultiMaterial[0])
        const boxObj = new THREE.Mesh(boxGeometry, bexWithTexMultiMaterial)
        boxObj.scale.x = params.sceneBox.width
        boxObj.scale.y = params.sceneBox.height
        boxObj.scale.z = params.sceneBox.depth
        boxObj.position.y = params.sceneBox.posY
        
        return (boxObj)      
    }

    #modelsObj() {
        const tableModel = loaderResult.models.table.scene
        tableModel.traverse((node) => {
            if (node.isMesh) {
                node.receiveShadow = true;
            }
        });
        tableModel.position.y = params.table.posY
        tableModel.rotation.y = 0.5 * Math.PI
        tableModel.scale.set(params.table.width, params.table.height, params.table.depth)
    
        /***************************************** */

        const racketModel = loaderResult.models.racket.scene

        return {
            tableModel,
            racketModel
        }
    }


    update() {
        if (!this.game.gameInfo.start)
            return
        this.netObj.update()
        this.ballObj.update()
        this.racketObj.update()
        this.player2.update()
    }

}