import * as THREE from 'three'
import { params } from '../Utils/Params'
import { Player2 } from './Player2'

export class Bot extends Player2 {

 
    constructor (game) {
        super(game)
        
        this.gravityForce = params.gravityForce
        this.target = new THREE.Vector3(0, 0, 0)
        this.step = 0
        this.performInit = false
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
            this.game.changeTurn()
        }

        this.game.changeTurn(1)
        this.position.set(-18, 0, 0)
        this.ballObj.position.x = - params.planeDim.x / 2 + 1
        this.ballObj.position.z = this.position.z
        this.ballObj.position.y = 3

        this.performInit = true
        setTimeout(perform, 1200, this)
    }

    update() {
        if (this.ballObj.initialize && this.game.getTurnInit() === 1) {
            this.ballInit()
        }
        else if (this.ballObj.netLose === false && this.game.getTurn() === 1){
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