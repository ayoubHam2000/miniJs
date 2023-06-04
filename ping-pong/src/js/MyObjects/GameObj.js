import * as THREE from "three";
import {params} from '../Utils/Params'
import {loaderResult} from '../Utils/Loader'



export class MyScene extends THREE.Scene {
   
   
    constructor () {
        super()
        const wallsObj = this.#wallsObj()
        const models = this.#modelsObj()
    
        this.lightObj = this.#spotLightObj()
        this.lightObjHelper = this.#lightHelper()
        this.ambientLightObj = this.#ambientLightObj()

        this.planeObj = this.#planeObj()
        this.infinitePLaneObj = this.#infinitePlane()
        this.racketObj = this.#racketObj()
        this.ballObj = this.#ballObj()
        this.upWallObj = wallsObj.upWallObj
        this.downWallObj = wallsObj.downWallObj
        this.leftWallObj = wallsObj.leftWallObj
        this.rightWallObj = wallsObj.rightWallObj

        this.environmentSceneObj = this.#environmentScene()

        this.tableModel = models.tableModel
        this.racketModel = models.racketObj.model
        this.racketParent = models.racketObj.parentObj

        this.#addToScene()
    }

    #addToScene() {
        this.add(this.lightObj)
        this.add(this.ambientLightObj)

        this.add(this.planeObj)
        this.add(this.infinitePLaneObj)
        this.add(this.racketObj)
        this.add(this.ballObj)
        //this.add(this.upWallObj)
        this.add(this.downWallObj)
        //this.add(this.leftWallObj)
        //this.add(this.rightWallObj)

        this.add(this.environmentSceneObj)

        this.add(this.tableModel)
        this.add(this.racketParent)
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
        tableModel.position.y = -7.2
        tableModel.rotation.y = 0.5 * Math.PI
        tableModel.scale.set(5, 5, 5)
    
        /*********************************/

        const racketModel = loaderResult.models.racket.scene
        racketModel.scale.set(0.15, 0.15, 0.15)
        racketModel.rotation.y = Math.PI / 2

        /*
        const infinitePlaneGeometry = new THREE.PlaneGeometry(2, 2)
        const infinitePlaneMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            side: THREE.DoubleSide,
            wireframe: false
        })
        const pivotRacket = new THREE.Mesh(infinitePlaneGeometry, infinitePlaneMaterial);
        */
       const pivotRacket = new THREE.Group()
       //pivotRacket.position.y = 2
        //pivotRacket.position.set( 0,0,0 );
        //pivotRacket.position.z = 0.1;
        pivotRacket.add(racketModel)
        
        return {
            tableModel,
            racketObj : {
                model: racketModel,
                parentObj: pivotRacket
            }
        }
    }

    #lightHelper() {
        const sLightHelper = new THREE.SpotLightHelper(this.lightObj)
        return (sLightHelper)
    }

    #infinitePlane() {
        const infinitePlaneGeometry = new THREE.PlaneGeometry(50, 50)
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
        // plane.rotation.x = 0.5 * Math.PI
        return (plane)
    }

    #wallsObj() {
        const upWallMeshGeometry = new THREE.PlaneGeometry(params.planeDim.x, params.planeDim.y, 50)
        const upWallMeshMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            wireframe: true,
            
        })
        const upWallObj = new THREE.Mesh(upWallMeshGeometry, upWallMeshMaterial)
        //plane.rotation.x = 0.5 * Math.PI
        //this.scene.add(upWallMesh)

        const downWallMeshGeometry = new THREE.PlaneGeometry(params.planeDim.x, params.planeDim.y, 10)
        const downWallMeshMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            wireframe: true
        })
        downWallMeshMaterial.visible = false
        const downWallObj = new THREE.Mesh(downWallMeshGeometry, downWallMeshMaterial)
        //plane.rotation.x = 0.5 * Math.PI
        //this.scene.add(downWallMesh)

        const leftWallMeshGeometry = new THREE.PlaneGeometry(params.planeDim.x, params.planeDim.y, 50)
        const leftWallMeshMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            wireframe: true
        })
        const leftWallObj = new THREE.Mesh(leftWallMeshGeometry, leftWallMeshMaterial)
        //plane.rotation.x = 0.5 * Math.PI
        //this.scene.add(leftWallMesh)

        const rightWallMeshGeometry = new THREE.PlaneGeometry(params.planeDim.x, params.planeDim.y, 50)
        const rightWallMeshMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            wireframe: true
        })
        const rightWallObj = new THREE.Mesh(rightWallMeshGeometry, rightWallMeshMaterial)
        //plane.rotation.x = 0.5 * Math.PI
        //this.scene.add(rightWallMesh)
        return  {
            upWallObj,
            downWallObj,
            leftWallObj,
            rightWallObj
        }
    }

    #racketObj() {

        const racketMeshGeometry = new THREE.CircleGeometry(params.racketCircleDim, 50)
        const racketMeshMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff00,
            side: THREE.DoubleSide,
            wireframe: false
        })
        const racketObj = new THREE.Mesh(racketMeshGeometry, racketMeshMaterial)
        racketObj.visible = false
        //plane.rotation.x = 0.5 * Math.PI
        return (racketObj)
    }

    #ballObj() {
        const sphereGeo = new THREE.SphereGeometry(params.ballDim);
        const sphereMat = new THREE.MeshStandardMaterial({ 
            color: 0xff0000, 
            wireframe: false,
        });
        const sphereObj = new THREE.Mesh(sphereGeo, sphereMat);
        
        return (sphereObj)
    }
}