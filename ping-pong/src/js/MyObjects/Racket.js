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

        this.maxMV = {
            x : 0,
            y : 0
        }
    
        this.maxTest = {
            x: 0,
            y: 0,
            minX: 0,
            minY: 0
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

   
  

    racketBallHit() {

        // function getForceInX(mouseVelocityY) {
        //     let tmp = Math.min(0.04, Math.max(0.02, Math.abs(mouseVelocityY)))
        //     tmp = tmp / 0.04
        //     if (tmp > 0.5) {
        //         console.log(tmp)
        //         game.gameConst.setTimeToFall(0.5, game.worldObj.world)
        //     }
        //     let speed = (Math.sign(mouseVelocityY) * tmp * params.planeDim.x * -0.5 - params.planeDim.x * 0.5)
        //     return (speed / params.timeToFall)
        // } 
    
        // function getForceInZ(mouseVelocityX) {
        //     let tmp = Math.min(0.04, Math.max(0, Math.abs(mouseVelocityX)))
        //     tmp = tmp / 0.04

        //     let sign = Math.sign(mouseVelocityX)
        //     let r = params.planeDim.y
        //     let pos = - ballBody.position.z + r / 2
        //     let hoz = racketBody.position.z - ballBody.position.z
        //     let scale = (sign < 0 ? pos : r - pos)
        //     // console.log(scale)
        //     let speed = (sign * scale * -1 * tmp)
        //     return speed / params.timeToFall

        // }

        // //if (params.isClicked === false)
        //   //  return
        // // ballBody.position.x = 12
        // // ballBody.position.z = racketBody.position.z - (params.racketCircleDim * 1)
        // // ballBody.position.y = 2
        // let circleDim = params.racketCircleDim * 1 + params.ballDim
        // let hitDepthDim = 2.5
        // let verticalDist = Math.abs(racketBody.position.y - ballBody.position.y)
        // let horizontalDist = Math.abs(racketBody.position.z - ballBody.position.z)
  
        // let depthDist = racketBody.position.x - ballBody.position.x
        // //console.log(depthDist)
        // //console.log(horizontalDist, depthDist)
        // //console.log(ballBody.velocity.x)
        // //console.log(horizontalDist < circleDim, horizontalDist, verticalDist < circleDim)
        // //console.log(ballBody.position, racketBody.position)
        // // racketBody.position.y = ballBody.position.y * 0.25 + params.racketHeight
       
        
        
        // if (params.isClicked) {
        //     maxMV.x += params.mouseVelocity.x * 10
        //     maxMV.y += params.mouseVelocity.y
        //     maxTest.x += 1
        //     //maxMV.x = Math.max(maxMV.x, params.mouseVelocity.x)
        //     //maxMV.y = Math.max(maxMV.y, params.mouseVelocity.y)
        // } else {
        //     maxTest.x = 0
        //     maxMV.x = 0
        //     maxMV.y = 0
        // }
        // //console.log(maxMV.x, maxMV.y)
        // if (horizontalDist < circleDim  && depthDist <= hitDepthDim && depthDist > - params.ballDim * 1.5 && params.isClicked) {
        //     const endMousePos = params.mousePosition
        //     const startMousePos = params.mouseClickPos
        //     const diff = {
        //         x: endMousePos.x - startMousePos.x,
        //         y: endMousePos.y - startMousePos.y
        //     }
        //     //console.log(diff)
        //     params.mouseVelocity.x *= -0
        //     params.mouseVelocity.y *= 40
        //     console.log(maxMV.y / maxTest.x, maxMV.x / maxTest.x)
        //     //if (params.mouseVelocity.y > 0){
        //         //console.log(ballBody.velocity, params.mouseVelocity, horizontalDist, depthDist)
        //         let newPosZ = racketBody.position.z + params.mouseVelocity.x
        //         let hoz = newPosZ - ballBody.position.z
        //         let maxHoz = circleDim
        //         let force = hoz / maxHoz

        //         let racketRange = (params.planeDim.y + 6)
        //         let pos = - newPosZ + racketRange / 2
        //         let scale = (hoz > 0 ? pos : racketRange - pos) / racketRange
        //         scale = scale * (params.planeDim.y)
        //         let zVel = force * scale / params.timeToFall
        //         // console.log("hoz", hoz, pos, zVel, "Pos", pos, "Scale ", scale)
        //         // console.log(params.mouseVelocity.x)
        //         ballBody.velocity.x = getForceInX(maxMV.y / maxTest.x)
        //         ballBody.velocity.z = getForceInZ(maxMV.x / maxTest.x)
        //         //ballBody.velocity.z = - diff.x * 30 * params.planeDim.y / 2;
        //         //ballBody.velocity.z = getSign(ballBody.velocity.z) * limitVelocityZ(ballBody, ballBody.velocity.z)
                
                
        //         //let newV = ballBody.velocity.clone()
        //         //newV.normalize()
        //         //ballBody.velocity = newV.scale(50)
        //         ballBody.velocity.y = 0.5 * params.gravityForce * params.timeToFall - ballBody.position.y / params.timeToFall

        //         //console.log(params.mouseVelocity, horizontalDist, depthDist, ballBody.velocity)
        //         params.isClicked = false
        //     //}
        // }
       
    }


    update() {
        this.racketPhy()
    }
}