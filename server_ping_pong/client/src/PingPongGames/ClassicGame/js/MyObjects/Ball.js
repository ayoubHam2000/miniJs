import { params } from "../Utils/Params"
import * as THREE from 'three'

export class Ball extends THREE.Object3D{
    
   
    constructor(game) {
        super()
        this.game = game
        this.scene = game.scene
        this.camera = game.camera
        this.timeStep = params.timeStep
        this.ballDim = params.ballDim
      
        this.velocity = new THREE.Vector3(0, 0, 0)
        this.speed = 2
       
        this.init()

        const objs = this.#getObjects()

        this.ballObj = objs.ballObj
        this.trailObj = [this.createNewObj(this.position)]
        this.add(this.ballObj)


        this.scene.add(this)
    }


    #getObjects() {
       return {
            ...this.#getBallObj()
       }
    }

    #getBallObj() {
        const sphereGeo = new THREE.CircleGeometry(params.ballDim);
        const sphereMat = new THREE.MeshBasicMaterial({ 
            color: 0xffffff
        });
        const sphereObj = new THREE.Mesh(sphereGeo, sphereMat);
        return {
            ballObj: sphereObj
        }
    }

    createNewObj(pos) {
        const sphereGeo = new THREE.CircleGeometry(params.ballDim);
        const sphereMat = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            blending: THREE.MultiplyBlending,
            opacity: 0.5
        });
        const sphereObj = new THREE.Mesh(sphereGeo, sphereMat);
        sphereObj.position.set(pos.x, pos.y, 0)
        this.scene.add(sphereObj)
        return (sphereObj)
    }

   

    init() {
        this.position.set(0, 0, 0)
        this.velocity.set(-1, 0, 0)
    }

   

    move() {
        let nextX = this.position.x + this.velocity.x * this.timeStep * this.speed
        let nextY = this.position.y + this.velocity.y * this.timeStep * this.speed
        
        this.position.x = nextX
        this.position.y = nextY
    }


    socketGetBallInfo(data) {
        const position = data.position
        const velocity = data.velocity
        this.position.set(position.x, position.y, 0)
        this.velocity.set(velocity.x, velocity.y, 0)
        this.speed = data.speed
    }

    update() {
        //this.move()
        // this.reset()
    }
}