import * as THREE from "three";
import {params} from '../Utils/Params'

export class MyScene extends THREE.Scene {
   
    constructor () {
        super()
        const wallsObj = this.#wallsObj()
    
        this.lightObj = this.#lightObj()
        this.lightObjHelper = this.#lightHelper()
        this.planeObj = this.#planeObj()
        this.racketObj = this.#racketObj()
        this.ballObj = this.#ballObj()
        this.upWallObj = wallsObj.upWallObj
        this.downWallObj = wallsObj.downWallObj
        this.leftWallObj = wallsObj.leftWallObj
        this.rightWallObj = wallsObj.rightWallObj

        this.#addToScene()
    }

    #addToScene() {
        this.add(this.lightObj)
        this.add(this.planeObj)
        this.add(this.racketObj)
        this.add(this.ballObj)
        //this.add(this.upWallObj)
        //this.add(this.downWallObj)
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

    #planeObj() {
        const planeGeometry = new THREE.PlaneGeometry(params.planeDim.x, params.planeDim.y)
        const planeMaterial = new THREE.MeshStandardMaterial({
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

        const downWallMeshGeometry = new THREE.PlaneGeometry(params.planeDim.x, params.planeDim.y, 50)
        const downWallMeshMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            wireframe: true
        })
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

        const racketMeshGeometry = new THREE.PlaneGeometry(params.racketDim.x, params.racketDim.y, 1)
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
        const sphereGeo = new THREE.SphereGeometry(params.sphereDim);
        const sphereMat = new THREE.MeshBasicMaterial({ 
            color: 0xff0000, 
            wireframe: true,
        });
        const sphereObj = new THREE.Mesh(sphereGeo, sphereMat);
        return (sphereObj)
    }
}