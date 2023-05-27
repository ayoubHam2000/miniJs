import { Scene } from "three";

export class MyScene extends Scene {
   
    constructor () {
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
        this.add(lightObj)
        this.add(planeObj)
        this.add(racketObj)
        this.add(ballObj)
        this.add(upWallObj)
        this.add(downWallObj)
        this.add(leftWallObj)
        this.add(rightWallObj)
    }

    #lightObj() {
        const spotLight = new THREE.SpotLight(0xffffff)
        spotLight.position.set(-50, 50, 0)
        spotLight.castShadow = true
        spotLight.angle = 0.2
        return (spotLight)
    }

    #lightHelper() {
        const sLightHelper = new THREE.SpotLightHelper(this.#lightObj)
        return (sLightHelper)
    }

    #planeObj() {
        const planeDim = {x: 27.4, y: 15.25}
        const planeGeometry = new THREE.PlaneGeometry(planeDim.x, planeDim.y)
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
        const upWallMeshGeometry = new THREE.PlaneGeometry(planeDim.x, planeDim.y, 50)
        const upWallMeshMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            wireframe: true,
            
        })
        const upWallObj = new THREE.Mesh(upWallMeshGeometry, upWallMeshMaterial)
        //plane.rotation.x = 0.5 * Math.PI
        //this.scene.add(upWallMesh)

        const downWallMeshGeometry = new THREE.PlaneGeometry(planeDim.x, planeDim.y, 50)
        const downWallMeshMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            wireframe: true
        })
        const downWallObj = new THREE.Mesh(downWallMeshGeometry, downWallMeshMaterial)
        //plane.rotation.x = 0.5 * Math.PI
        //this.scene.add(downWallMesh)

        const leftWallMeshGeometry = new THREE.PlaneGeometry(planeDim.x, planeDim.y, 50)
        const leftWallMeshMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            wireframe: true
        })
        const leftWallObj = new THREE.Mesh(leftWallMeshGeometry, leftWallMeshMaterial)
        //plane.rotation.x = 0.5 * Math.PI
        //this.scene.add(leftWallMesh)

        const rightWallMeshGeometry = new THREE.PlaneGeometry(planeDim.x, planeDim.y, 50)
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
        const racketDim = {
            x: 1.5,
            y: 1.5
        }
        const racketMeshGeometry = new THREE.PlaneGeometry(racketDim.x, racketDim.y, 1)
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
        const sphereDim = 0.25
        const sphereGeo = new THREE.SphereGeometry(sphereDim);
        const sphereMat = new THREE.MeshBasicMaterial({ 
            color: 0xff0000, 
            wireframe: true,
        });
        const sphereObj = new THREE.Mesh( sphereGeo, sphereMat);
        return (sphereObj)
    }
}