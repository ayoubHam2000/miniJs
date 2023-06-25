import { Game } from "./Game"
import { TrailRenderer } from "./Trail"
import { Spot } from "./Spot"
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
      
        this.velocity = new THREE.Vector3()
        this.netObj = this.scene.netObj
        this.gravityForce = params.gravityForce
      

    
        // OBJ
        this.trail = new TrailRenderer(game, this)
        
        this.spot = new Spot()
        this.scene.add(this.spot)
        
        const objs = this.#getObjects()

        this.ballObj = objs.ballObj
        this.add(this.ballObj)

        this.scene.add(this)
    }


    #getObjects() {
       return {
            ...this.#getBallObj()
       }
    }

    #getBallObj() {
        const sphereGeo = new THREE.SphereGeometry(params.ballDim);
        const sphereMat = new THREE.MeshStandardMaterial({ 
            color: 0xff0000, 
            wireframe: false,
            emissive: 0xff0000,
            emissiveIntensity: 4
        });
        const sphereObj = new THREE.Mesh(sphereGeo, sphereMat);
        sphereObj.castShadow = true
        return {
            ballObj: sphereObj
        }
    }

    move() {
        this.position.x += this.velocity.x * this.timeStep
        this.position.y += this.velocity.y * this.timeStep
        this.position.z += this.velocity.z * this.timeStep
        this.velocity.y = - this.gravityForce * this.timeStep + this.velocity.y
    }

    changeColor() {
        let t = (this.game.getTurn()) % 2
        if (t === 0)
            this.ballObj.material.color.set(0x00ff00)
        else if (t === 1)
            this.ballObj.material.color.set(0x0000ff)
        else
            this.ballObj.material.color.set(0xff0000)
    }

    socketGetBallInfo(data) {
        const position = data.position
        const velocity = data.velocity
        this.position.set(position.x, position.y, position.z)
        this.velocity.set(velocity.x, velocity.y, velocity.z)
        this.trail.stop = data.init
        if (data.spotPos)
            this.spot.hit(data.spotPos)
        if (data.net)
            this.game.scene.netObj.hit()
    }

    update() {
        this.changeColor()
        this.trail.update()
        this.spot.update()
        if (this.trail.stop === false)
            this.move()
    }
}