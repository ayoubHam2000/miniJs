import * as THREE from 'three'
import {params} from '../Utils/Params'

export class Racket extends THREE.Object3D {
    constructor(game) {
        super()

        this.game = game
        this.scene = game.scene
        this.camera = game.camera
        this.gameConst = game.gameConst
        this.ballObj = game.scene.ballObj
        this.rayMouseCamera = new THREE.Raycaster()

        this.clickInfo = {
            startX: -1,
            startY: -1,
            startTime: 0,
            counter: 0
        }

        const racket =  this.getObject()
        this.racketModel = racket.racketModel
        this.add(this.racketModel)
        game.scene.add(this)
    }

    getObject() {
        const racketModel = this.scene.racketModel
        racketModel.scale.set(0.15, 0.15, 0.15)
        racketModel.rotation.y = Math.PI / 2

        //let pos = this.game.guiParams.getVal("psss", {x:0, y:2, z:0}, -2, 4, 0.001)
        racketModel.position.y = 2
        return {
            racketModel
        }
    }

    racketPhy() {
        //Get mouse intersection with the plane coordinate
        
        const mousePosition = new THREE.Vector2(params.mousePosition.x, params.mousePosition.y)
        this.rayMouseCamera.setFromCamera(mousePosition, this.camera)
        const intersects = this.rayMouseCamera.intersectObject(this.scene.infinitePLaneObj)

        //If there is an intersection
        if (intersects.length) {
            // translating the plan so that p1 becomes the origin.
            const p = {
                x: intersects[0].point.x - this.gameConst.player.p1.x,
                y: intersects[0].point.z - this.gameConst.player.p1.y
            }
            
            //getCoefficient a, b of vec1 and vec2 of the plane
            const invMatrix = this.gameConst.player.invMatrix
            const a = p.x * invMatrix.a + p.y * invMatrix.c
            const b = p.x * invMatrix.b + p.y * invMatrix.d
            // this.a = a
            // this.b = b

            //move the racket my the position of the mouse
            this.position.z = intersects[0].point.z
            this.position.x = intersects[0].point.x

            //limit the racket in the plane
            if (b < 0)
                this.position.z = this.gameConst.player.p1.y
            else if (b > 1)
                this.position.z = this.gameConst.player.p2.y
        
            if (a < 0)
                this.position.x = this.gameConst.player.p1.x
            else if (a > 1)
                this.position.x = this.gameConst.player.p3.x
            
            
            //racket rotation
            const newAngle = - Math.PI * 1.5 * (b * 2 - 1)
            if (newAngle > - Math.PI / 2 && newAngle < Math.PI / 2){
                this.racketModel.rotation.x = newAngle
            }
        }
    }

   
    isInRange() {
        let xRange = 4
        let zRange = 2
        let xDist = this.position.x - this.ballObj.position.x
        let zDist = this.position.z - this.ballObj.position.z
        let value = false
        if (params.isClicked && Math.abs(xDist) < xRange && Math.abs(zDist) < zRange && xDist >= -0.1)
            value = true
        return {
            value,
            xDist,
            zDist
        }
    }

    hit(mouseVelocity) {
        mouseVelocity.y = Math.min(Math.abs(mouseVelocity.y) * 1.5, 1) * Math.sign(mouseVelocity.y)
        mouseVelocity.x = Math.min(Math.abs(mouseVelocity.x) * 0.5, 1) * Math.sign(mouseVelocity.x)

        let x = 0.5 + Math.abs(mouseVelocity.x / 2)
        let y = 0.5 + mouseVelocity.y / 2
        let dist = Math.sqrt(mouseVelocity.x ** 2 + mouseVelocity.y ** 2) / 2
        let v = (dist / mouseVelocity.diffTime) * 100
        console.log("d", dist, v)
        let speed = v * (params.planeDim.x * 1.1)

        let posX = params.planeDim.x * (0.5 - x)
        let posY = ((y * 2) - 1) * (params.planeDim.y / 2)
        this.ballObj.setVelocity(posX, posY, speed)
    }

    racketBallHit() {
        const rangeInfo = this.isInRange()
        //changing clickInfo
        if (!params.isClicked || (params.isClicked && performance.now() - this.clickInfo.startTime > 500)) {
            this.clickInfo.startX = rangeInfo.xDist
            this.clickInfo.startY = rangeInfo.zDist
            this.clickInfo.startTime = performance.now()
        }

        if (rangeInfo.value === true) {
            let diff = {
                x: this.clickInfo.startX - rangeInfo.xDist,
                y: this.clickInfo.startY - rangeInfo.zDist,
                time: performance.now() - this.clickInfo.startTime
            }
            diff.x = Math.min(3, diff.x)
            diff.y = Math.min(1.5, diff.y)
            diff.time = Math.max(100, diff.time)
            let mouseVelocity = {
                x: (diff.x / diff.time) * (100 / 3) * -1,
                y: (diff.y / diff.time) * (100 / 1.5) * -1,
                time: (100 / diff.time),
                diffTime : diff.time
            }
            if (diff.x > 0)
             this.hit(mouseVelocity)
            params.isClicked = false
        }
 
       
    }


    update() {
        this.racketPhy()
        this.racketBallHit()
    }
}