import * as THREE from 'three'
import { params } from '../Utils/Params'

export class Bot extends THREE.Object3D {
    constructor (game) {
        super()
        this.game = game
        this.scene = game.scene
        this.ballObj = this.scene.ballObj
        this.velocity = new THREE.Vector3()
        this.timeStep = params.timeStep
        this.step = 0

        const racket =  this.getObject()
        this.racketModel = racket.racketModel
        this.racketParent = racket.racketParent
        this.add(this.racketParent)
        this.scene.add(this)
    }

    getObject() {
        const racketModel = this.scene.racketModel.clone()
        racketModel.scale.set(0.15, 0.15, 0.15)
        racketModel.rotation.y = - Math.PI / 2

        const racketParent = new THREE.Group()
        racketParent.add(racketModel)

        racketModel.position.y = -1.5
        racketParent.position.set(-18, 2.5, 0)

       
        return {
            racketModel,
            racketParent
        }
    }

    move() {
        this.position.x += this.velocity.x * this.timeStep
        this.position.y += this.velocity.y * this.timeStep
        this.position.z += this.velocity.z * this.timeStep
        //this.velocity.y = - this.gravityForce * this.timeStep + this.velocity.y
    }

    getRangeInfo() {
        let x = this.ballObj.position.x - this.position.x
        let y = this.ballObj.position.y - this.position.y
        let z = this.ballObj.position.z - this.position.z
        let valuePlane = false
        let valueY = false

        let planeDist = Math.sqrt(x ** 2 + z ** 2)
        let maxDistToFollow = 5
        if (planeDist < maxDistToFollow)
            valuePlane = true
        return {
            x, y, z, valuePlane, valueY
        }
    }

    rotateObj() {
        //racket rotation
        let b = (this.position.z / params.planeDim.y * 2 + 1) * 0.5
        const newAngle =  Math.PI * 1.5 * (b * 2 - 1)
        if (newAngle > - Math.PI / 2 && newAngle < Math.PI / 2){
            this.racketParent.rotation.x = newAngle
        }
    }

    fallow() {
        let rangeInfo = this.getRangeInfo()
       
        if (Math.abs(rangeInfo.z) > 0 && Math.abs(rangeInfo.x) < 4){
            console.log(this.position.z, this.ballObj.position.z)
            this.velocity.set(0, 0, 30 * Math.sign(rangeInfo.z))
        }
        else {
            this.velocity.set(0, 0, 0)
        }
        
    }

    update() {
        if (this.ballObj.groundVelocity.x < 0) {
            this.step = 1
        }
        if (this.step === 1) {
            let speedY = this.ballObj.groundVelocity.y
            console.log(speedY)
            let maxH = speedY ** 2 / (2 * params.gravityForce)
            console.log(maxH)
            console.log(this.ballObj.position.y)
        }
    }
}