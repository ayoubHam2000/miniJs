import * as THREE from 'three'
import { params } from '../Utils/Params'

export class Bot extends THREE.Object3D {

 
    constructor (game) {
        super()
        this.game = game
        this.scene = game.scene
        this.camera = game.camera
        this.ballObj = this.scene.ballObj
        this.velocity = new THREE.Vector3()
        this.timeStep = params.timeStep
        this.gravityForce = params.gravityForce
        this.target = new THREE.Vector3(0, 0, 0)
        this.botTarget = new THREE.Vector3(0, 0, 0)
        this.step = 0
        this.performInit = false

        this.moveToInfo = {
            status : 0,
            lose : false
        }


        this.limit = {
            x: {
                a : - params.planeDim.x * 0.8,
                b : - params.planeDim.x * 0.4
            },
            y : {
                a: - params.planeDim.y * 0.7,
                b: + params.planeDim.y * 0.7
            }
        }

        const racket =  this.getObject()
        this.racketModel = racket.racketModel
        this.racketParent = racket.racketParent
        this.add(this.racketParent)
        this.scene.add(this)
    }

    getObject() {
        const racketModel = this.scene.racketModel.clone()
        racketModel.scale.set(0.15, 0.15, 0.3)
        racketModel.rotation.y = - Math.PI / 2

        const racketParent = new THREE.Group()
        racketParent.add(racketModel)

        racketModel.position.y = -1.5
        racketParent.position.set(0, 2.5, 0)

       
        this.position.set(-18, 0, 0)
        return {
            racketModel,
            racketParent
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


    determineMaxPossibleHeight() {
        let gv = this.ballObj.groundInfo.v
        let gp = this.ballObj.groundInfo.p
        
        let xMax = ((gv.y * gv.x) / this.gravityForce + gp.x)
        let zMax = ((gv.y * gv.z) / this.gravityForce + gp.z) 
        xMax = Math.min(Math.abs(xMax), Math.abs(this.limit.x.a)) * Math.sign(xMax)
        zMax = Math.min(Math.abs(zMax), Math.abs(this.limit.y.a)) * Math.sign(zMax)

        let tx = (xMax - gp.x) / gv.x
        let tz = (zMax - gp.z) / gv.z
        let zx = gv.z * tx + gp.z
        let xz = gv.x * tz + gp.x

        if (Math.abs(zx) <= Math.abs(zMax)) {
            let y = - 0.5 * this.gravityForce * (tx ** 2) + gv.y * tx + gp.y
            let res = new THREE.Vector3(xMax, y, zx)
            //console.log("z", res)
            return (res)
        } else {
            let y = - 0.5 * this.gravityForce * (tz ** 2) + gv.y * tz + gp.y
            let res = new THREE.Vector3(xz, y, zMax)
            //console.log("x", res)
            return (res)
        }
    }

    moveTo(time) {
        if (this.moveToInfo.status === 1) {
            this.botTarget.y += -2
            this.velocity = new THREE.Vector3().copy(this.botTarget).sub(this.position).multiplyScalar(1 / time)
            this.moveToInfo.status++
        }
        if (this.moveToInfo.status === 2) {
            let d = this.velocity.clone().multiplyScalar(this.timeStep)
            let dist = this.botTarget.clone().sub(this.position)
            if (d.length() >= dist.length()) {
                console.log("Done")
                this.position.add(dist)
            } else {
                this.position.add(d)
            }
            this.rotateObj()
        }
    }

    hitTheBall() {
        let diff = new THREE.Vector3().copy(this.target).sub(this.ballObj.position)
        let dist = diff.length()
        if (dist < 0.6) {
            if (this.moveToInfo.lose === false) {
                const newPos = this.ballObj.randomPos()
                this.ballObj.setVelocity(newPos.x, newPos.y, newPos.speed)
                let dir = this.ballObj.velocity.clone().normalize()
                const limit = this.ballObj.limit
                let m = 0.1
                let lm = 0.7
                if (dir.z > m && newPos.y > limit.botY.b * lm) {
                    this.camera.cameraMovement.state = 0
                }
                else if (dir.z < -m && newPos.y < limit.botY.a * lm) {
                    this.camera.cameraMovement.state = 2
                }
            } else {
                setTimeout((obj) => {
                    obj.moveToInfo.lose = false
                }, 200, this)
            }
        }
        if (dist < 4) {
            this.moveTo(0.1)
        }
    }


    randomLose() {
        let r = Math.random()
        if (r > 1) {
            //console.log("Lose")
            let z = (Math.random() * 2 - 1) * 2
            let y = (Math.random() * 2 - 1) * 2
            z += 1 * Math.sign(z)
            y += 1 * Math.sign(z)
            this.moveToInfo.lose = true
            return (new THREE.Vector3(0, y, z))
        }
        return (new THREE.Vector3(0, 0, 0))
    }

    ballInit() {
        if (this.performInit === true)
            return 
        
        function perform(obj) {
            let r = (Math.random() * 2 - 1) * params.planeDim.y * 0.2
            obj.ballObj.initialize = false
            obj.performInit = false
            obj.ballObj.velocity.set(12, 3, r)
            obj.ballObj.changeTurn(0)
        }

        this.position.set(-18, 0, 0)
        this.ballObj.position.x = - params.planeDim.x / 2 + 1
        this.ballObj.position.z = this.position.z
        this.ballObj.position.y = 3

        this.performInit = true
        setTimeout(perform, 1200, this)
    }

    update() {
        //console.log(this.ballObj)
        if (this.ballObj.initialize && this.game.getTurn() === 1) {
            this.ballInit()
        }
        else if (this.ballObj.netLose === false && this.game.gameInfo.turn === 1){
            if (this.ballObj.groundInfo.v.x < 0 && this.step === 0 && this.ballObj.bounce === 1) {
                let r = this.randomLose()
                this.target = this.determineMaxPossibleHeight()
                this.botTarget = this.target.clone().add(r)
                this.moveToInfo.status = 1
                this.ballObj.groundInfo.v.x *= -1
                this.step = 1
            }
            if (this.ballObj.groundInfo.v.x > 0 && this.step === 1) {
                this.step = 0
            }
            if (this.ballObj.groundInfo.v.x > 0 && this.step === 0) {
                this.hitTheBall()
            }
        }

    }
}