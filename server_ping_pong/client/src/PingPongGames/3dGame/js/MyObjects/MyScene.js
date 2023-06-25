import * as THREE from "three";
import {params} from '../Utils/Params'
import {loaderResult} from '../Utils/Loader'

import { AmbientLight } from "./AmbientLight";
import { Ball } from "./Ball";
import { Racket } from "./Racket";
import { Net } from "./Net";
import { SpotLight } from "./SpotLight";
import { Player2 } from "./Player2";


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
        this.player2 = new Player2(game)
    } 

    #environmentScene() {
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
        //const boxGeometry = new THREE.SphereGeometry(50, 100)
      
        const bexWithTexMultiMaterial = [
            new THREE.MeshStandardMaterial({
                side: THREE.DoubleSide,
                // normalMap: loaderResult.tex.backWall.normalMap,
                map: loaderResult.tex.backWall.tex
            }),//back
            new THREE.MeshStandardMaterial({
                side: THREE.BackSide,
                // normalMap: loaderResult.tex.frontWall.normalMap,
                map: loaderResult.tex.frontWall.tex,
                // displacementMap : loaderResult.tex.frontWall.displacementMap
            }),//front
            new THREE.MeshStandardMaterial({
                side: THREE.BackSide, 
                // normalMap: loaderResult.tex.floor.normalMap, 
                map: loaderResult.tex.floor.tex
            }),//up
            new THREE.MeshStandardMaterial({
                side: THREE.BackSide, 
                // normalMap: loaderResult.tex.floor.normalMap, 
                map: loaderResult.tex.floor.tex
            }),//down
            new THREE.MeshStandardMaterial({
                side: THREE.BackSide, 
                // normalMap: loaderResult.tex.leftWall.normalMap, 
                map: loaderResult.tex.leftWall.tex
            }),//left
            new THREE.MeshStandardMaterial({
                side: THREE.BackSide, 
                // normalMap: loaderResult.tex.rightWall.normalMap, 
                map: loaderResult.tex.rightWall.tex
            }),//right
        ]
        //console.log(bexWithTexMultiMaterial[0])
        const boxObj = new THREE.Mesh(boxGeometry, bexWithTexMultiMaterial)
        //boxObj.receiveShadow = true
        boxObj.scale.x = params.sceneBox.width
        boxObj.scale.y = params.sceneBox.height
        boxObj.scale.z = params.sceneBox.depth
        boxObj.position.y = params.sceneBox.posY
        
        return (boxObj)      
    }

    #modelsObj() {
        const tableModel = loaderResult.models.table.scene
        //console.log(loaderResult.models.table)
        this.tableColor = undefined
        tableModel.traverse((node) => {
            if (node.isMesh) {
                node.receiveShadow = true;
                // node.material.emissiveIntensity = 0
                
                if (node.id === 16) {
                    //lines
                    node.material.emissive = new THREE.Color("#0000FF")
                    node.material.emissiveIntensity = 6
                } else if (node.id === 23) {
                    //legs
                    node.position.y = -0.3
                } else if (node.id === 15) {
                    //table color
                    node.material.color = new THREE.Color("#C824B4")
                    this.tableColor = node
                }
                
                
            }
        });
        tableModel.position.y = params.table.posY
        tableModel.rotation.y = 0.5 * Math.PI
        tableModel.scale.set(params.table.width, params.table.height, params.table.depth)
    
        /***************************************** */

        //console.log(loaderResult.models.racket)
        const racketModel = loaderResult.models.racket.scene
        const racketMat = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0,
            side: THREE.DoubleSide
        })
        this.racketMat = racketMat
        racketModel.traverse((node) => {
            //console.log(node)
            if (node.isMesh) {
                node.castShadow = true;
                //node.material.depthFunc = 3
                if (node.material.name === "Back.Rubber.Material") {
                    //node.material = racketMat.clone()
                    node.material.color.set(0xff0000)
                    //console.log(node)
                } else if (node.material.name === "Front.Rubber.Material") {
                    //node.material = racketMat.clone()
                    node.material.color.set(0x0000ff)
                    //node.material.depthFunc = 2 
                    //console.log(node)
                }
            }
        });
        racketModel.scale.set(1, 1, 1)
        racketModel.rotation.set(0, 0, 0)
        racketModel.position.y = 0


        // const geo = new THREE.CircleGeometry(5, 34)
        // const mat = new THREE.MeshStandardMaterial({
        //     color: 0xffffff,
        //     emissive: 0xff0000,
        //     emissiveIntensity: 6,
        //     side: THREE.DoubleSide
        // })
        // const mesh = new THREE.Mesh(geo, mat)
        // mesh.rotation.set(-Math.PI / 2, 0, 0)
        // this.add(mesh)

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