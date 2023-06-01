import * as THREE from "three";
import {params} from '../Utils/Params'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class MyScene extends THREE.Scene {
   
    constructor () {
        super()
        const wallsObj = this.#wallsObj()
    
        this.lightObj = this.#lightObj()
        this.lightObjHelper = this.#lightHelper()
        this.planeObj = this.#planeObj()
        this.infinitePLaneObj = this.#infinitePlane()
        this.racketObj = this.#racketObj()
        this.ballObj = this.#ballObj()
        this.upWallObj = wallsObj.upWallObj
        this.downWallObj = wallsObj.downWallObj
        this.leftWallObj = wallsObj.leftWallObj
        this.rightWallObj = wallsObj.rightWallObj
        this.tableModel = undefined
        this.ballModel = undefined
        this.racketModel = undefined

        this.#addToScene()
    }

    async load3dObjects() {
        const assetLoader = new GLTFLoader()
        const tableUrl = new URL('../../assets/table_tennis_table.glb', import.meta.url)
        const racketUrl = new URL('../../assets/tennis_racket_wilson_blade.glb', import.meta.url)
        const ballUrl = new URL('../../assets/tennis_ball.glb', import.meta.url)
        const table = await assetLoader.loadAsync(tableUrl.href)
        //const racket = await assetLoader.loadAsync(racketUrl.href)
        //const ball = await assetLoader.loadAsync(ballUrl.href)
        console.log("Done")
        this.tableModel = table.scene
        //this.racketModel = racket.scene
        //this.ballModel = ball.scene
        
       
        //const directionLight = new THREE.DirectionalLight(0xffffff, 9.8)
        //directionLight.position.set(-50, 10, 30)
        //directionLight.castShadow = true
        //this.add(directionLight)

        // const bbox = new THREE.Box3().setFromObject(this.tableModel);

        // // Calculate the dimensions
        // const height = bbox.max.y - bbox.min.y;
        // const width = bbox.max.x - bbox.min.x;
        // const depth = bbox.max.z - bbox.min.z;

        this.tableModel.position.y = -7.2
        this.tableModel.rotation.y = 0.5 * Math.PI
        //console.log(width, height, depth)
        this.tableModel.scale.set(5, 5, 5)
        this.add(this.tableModel)
        //return [table, racket, ball]
        //[table, racket, ball] = await load3dObjects()
        //const model = table.scene
        //scene.add(model)
        //model.position.set(0, 0, 0)
        //model.scale.set(1, 1, 1)
    }

    #addToScene() {
        this.add(this.lightObj)
        this.add(this.planeObj)
        this.add(this.infinitePLaneObj)
        this.add(this.racketObj)
        this.add(this.ballObj)
        //this.add(this.upWallObj)
        this.add(this.downWallObj)
        //this.add(this.leftWallObj)
        //this.add(this.rightWallObj)
    }

    #lightObj() {
        const spotLight = new THREE.SpotLight(0xffffff)
        spotLight.position.set(-50, 50, 0)
        spotLight.castShadow = true
        spotLight.angle = 0.2
        return (spotLight)
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
        //plane.rotation.x = 0.5 * Math.PI
        return (racketObj)
    }

    #ballObj() {
        const sphereGeo = new THREE.SphereGeometry(params.ballDim);
        const sphereMat = new THREE.MeshBasicMaterial({ 
            color: 0xff0000, 
            wireframe: true,
        });
        const sphereObj = new THREE.Mesh(sphereGeo, sphereMat);
        return (sphereObj)
    }
}