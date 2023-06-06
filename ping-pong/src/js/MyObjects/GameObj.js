import * as THREE from "three";
import {params} from '../Utils/Params'
import {loaderResult} from '../Utils/Loader'



export class MyScene extends THREE.Scene {
   
   
    constructor () {
        super()
        const wallsObj = this.#wallsObj()
        const models = this.#modelsObj()
    
        this.lightObj = this.#spotLightObj()
        this.add(this.lightObj)

        this.lightObjHelper = this.#lightHelper()
        // this.add(this.lightObjHelper)
        
        this.ambientLightObj = this.#ambientLightObj()
        this.add(this.ambientLightObj)
        
        this.planeObj = this.#planeObj()
        this.add(this.planeObj)
        
        this.infinitePLaneObj = this.#infinitePlane()
        this.add(this.infinitePLaneObj)
        
        this.downWallObj = wallsObj.downWallObj
        this.add(this.downWallObj)

        // this.environmentSceneObj = this.#environmentScene()
        // this.add(this.environmentSceneObj)
        
        this.tableModel = models.tableModel
        this.add(this.tableModel)

        //used
        this.racketModel = models.racketModel
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
        boxObj.scale.x = params.width
        boxObj.scale.y = params.height
        boxObj.scale.z = params.depth
        boxObj.position.y = params.posY
        
        return (boxObj)      
    }


    #ambientLightObj() {
        const ambientLight = new THREE.AmbientLight(0xcccccc, params.ambientLightIntensity)
        return ambientLight
    }

    #spotLightObj() {
        const spotLight = new THREE.SpotLight(0xffffff)
        spotLight.position.set(-50, 50, 0)
        spotLight.castShadow = true
        spotLight.angle = 0.2
        return (spotLight)
    }

    #modelsObj() {
        const tableModel = loaderResult.models.table.scene
        tableModel.traverse((node) => {
            if (node.isMesh) {
                node.receiveShadow = true;
            }
        });
        tableModel.position.y = -7.4
        tableModel.rotation.y = 0.5 * Math.PI
        tableModel.scale.set(5, 5, 5)
    
        /***************************************** */

        const racketModel = loaderResult.models.racket.scene

        return {
            tableModel,
            racketModel
        }
    }

    #lightHelper() {
        const sLightHelper = new THREE.SpotLightHelper(this.lightObj)
        return (sLightHelper)
    }

    #infinitePlane() {
        const infinitePlaneGeometry = new THREE.PlaneGeometry(100, 100)
        const infinitePlaneMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            side: THREE.DoubleSide,
            wireframe: true
        })
        const infinitePlaneObj = new THREE.Mesh(infinitePlaneGeometry, infinitePlaneMaterial)
        infinitePlaneObj.rotation.x = 0.5 * Math.PI
        infinitePlaneObj.position.y = params.racketHeight
        infinitePlaneObj.visible = false
        return (infinitePlaneObj)
    }

    #planeObj() {
        const planeGeometry = new THREE.PlaneGeometry(params.planeDim.x, params.planeDim.y)
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            wireframe: false
        })
        const plane = new THREE.Mesh(planeGeometry, planeMaterial)
        plane.rotation.x = - 0.5 * Math.PI
        return (plane)
    }

    #wallsObj() {
       

        const downWallMeshGeometry = new THREE.PlaneGeometry(params.planeDim.x, params.planeDim.y, 10)
        const downWallMeshMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            wireframe: false
        })
        downWallMeshMaterial.visible = false
        const downWallObj = new THREE.Mesh(downWallMeshGeometry, downWallMeshMaterial)
        downWallObj.position.set(-params.planeDim.x / 2, 0, 0)
        downWallObj.rotation.set(-Math.PI / 2, -Math.PI / 2, 0)
        //this.scene.add(downWallMesh)

       
        return  {
            downWallObj
        }
    }

   
}