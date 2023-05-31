import { Game } from "./MyObjects";
import {params} from './Utils/Params'
import { getSign } from "./MyMath/Utils";
import * as CANNON from 'cannon-es'
import * as MyMath from './MyMath'
import * as THREE from "three";


async function startGame() {
    const game = new Game()
    const gameConst = game.gameConst
    const camera = game.camera
    const ballBody = game.worldObj.ballBody
    const ballObj = game.scene.ballObj
    const racketBody = game.worldObj.racketBody
    const racketObj = game.scene.racketObj

    function hiddenCodeStart() {
        let a = game.worldObj.ballBody.position.x
        game.world.step(params.timeStep)
        let b = game.worldObj.ballBody.position.x
        //console.log((b - a), game.worldObj.ballBody.velocity.x, game.worldObj.ballBody.velocity.x / (b-a))


        game.scene.lightObj.penumbra = params.penumbra
        game.scene.lightObj.angle = params.angle
        game.scene.lightObj.intensity = params.intensity
        game.scene.lightObjHelper.update()
        game.orbit.enabled = params.enableOrbit
    }

    function hiddenCodeEnd() {
        game.tie(game.scene.planeObj, game.worldObj.groundBody)
        game.tie(game.scene.upWallObj, game.worldObj.upWallBody)
        game.tie(game.scene.downWallObj, game.worldObj.downWallBody)
        game.tie(game.scene.leftWallObj, game.worldObj.leftWallBody)
        game.tie(game.scene.rightWallObj, game.worldObj.rightWallBody)
        game.tie(game.scene.racketObj, game.worldObj.racketBody)
        game.tie(game.scene.ballObj, game.worldObj.ballBody)

        if (params.frame === 0) {
            game.camera.position.x = params.vectorPos1.x;
            game.camera.position.y = params.vectorPos1.y;
            game.camera.position.z = params.vectorPos1.z;
            game.camera.rotation.x = params.vectorRot1.x;
            game.camera.rotation.y = params.vectorRot1.y;
            game.camera.rotation.z = params.vectorRot1.z;
        }

        params.frame++
        game.renderer.render(game.scene, game.camera)
    }


    function limitVelocityZ(ballBody, newVelocityZ) {
        let dist = params.planeDim.y / 2 - Math.abs(ballBody.position.z)
        let maxV = dist / params.timeToFall
        let vz = Math.min(maxV, Math.abs(newVelocityZ))
        return (vz)
    }


    function ballPhy() {
        function randomVelocityZ(ballBody) {
            let range = params.planeDim.y / 2
            let r = Math.random()
            let sign = (parseInt(Math.random() * 2) * 2 - 1)
            let vz = sign * limitVelocityZ(ballBody, r * range)
            return vz
        }

        const rayCaster = game.rayBall
        if (params.frame  === 1) {
            ballBody.velocity.x = -20
        }
        if (ballBody.position.y <= -1) {
            ballBody.position = new CANNON.Vec3(params.ballPosition.x, params.ballPosition.y, params.ballPosition.z)
            ballBody.velocity = new CANNON.Vec3(-30, 0, 0)
        }

        let pos = new THREE.Vector3().copy(ballBody.position)
        let velocity = new THREE.Vector3().copy(ballBody.velocity.clone().unit())
        rayCaster.set(pos, velocity)
        rayCaster.far = (ballBody.velocity.length() * params.timeStep) + params.ballDim
        
        const arr = rayCaster.intersectObjects([game.scene.downWallObj, game.scene.planeObj])
        if (arr.length) {
           
            const normalizedVelocity = ballBody.velocity.clone().unit()
            const newPos = arr[0].point
            newPos.x -= normalizedVelocity.x * params.ballDim
            newPos.y -= normalizedVelocity.y * params.ballDim
            newPos.z -= normalizedVelocity.z * params.ballDim
            ballBody.position.copy(newPos)
            if (arr[0].object.id === game.scene.downWallObj.id) {
                ballBody.velocity.x = (Math.random() * (params.planeDim.x / 2) + params.planeDim.x * 0.5) / params.timeToFall
                //move upword and down in time = fallTime
                ballBody.velocity.y = 0.5 * params.gravityForce * params.timeToFall - ballBody.position.y / params.timeToFall
                ballBody.velocity.z = randomVelocityZ(ballBody)
            } else {
                ballBody.velocity.y = params.groundVelocity
            }
        }
    }

    
 
    function racketPhy() {
        //Get mouse intersection with the plane coordinate
        const mousePosition = new THREE.Vector2(params.mousePosition.x, params.mousePosition.y)
        game.rayMouseCamera.setFromCamera(mousePosition, game.camera)
        const intersects = game.rayMouseCamera.intersectObject(game.scene.infinitePLaneObj)

        //If there is an intersection
        if (intersects.length) {
            //intersects[0].point.y = 0

            // translating the plan so that p1 becomes the origin.
            const p = {
                x: intersects[0].point.x - gameConst.player.p1.x,
                y: intersects[0].point.z - gameConst.player.p1.y
            }
            
            //getCoefficient a, b of vec1 and vec2 of the plane
            const invMatrix = gameConst.player.invMatrix
            const a = p.x * invMatrix.a + p.y * invMatrix.c
            const b = p.x * invMatrix.b + p.y * invMatrix.d

            //move the racket my the position of the mouse
            racketBody.position.z = intersects[0].point.z
            racketBody.position.x = intersects[0].point.x

            //limit the racket in the plane
            if (b < 0)
                racketBody.position.z = gameConst.player.p1.y
            else if (b > 1)
                racketBody.position.z = gameConst.player.p2.y
        
            if (a < 0)
                racketBody.position.x = gameConst.player.p1.x
            else if (a > 1)
                racketBody.position.x = gameConst.player.p3.x
            racketBody.position.y = intersects[0].point.y
           
        }


        // let racketRange = (params.planeDim.y + 6)
        // let pos = - racketBody.position.z + racketRange / 2
        // console.log(pos, racketRange - pos)
        
    }



    function racketBallHit() {

        function getForceInX(mouseVelocityY) {
            mouseVelocityY = Math.abs(mouseVelocityY) * 55
            if (mouseVelocityY > 1)
                mouseVelocityY = 1 
           let x = racketBody.position.x + mouseVelocityY * (params.planeDim.x / 2)
           console.log(mouseVelocityY)
           return (x)
        } 
    
        function getForceInZ(mouseVelocityX) {
           
            return -(mouseVelocityX)
            if (mouseVelocityX > 0 && mouseVelocityX < 1.5)
                return (1)
            else if (mouseVelocityX < 6)
                return (2)
            return (3)       
        }

        //if (params.isClicked === false)
          //  return
        // ballBody.position.x = 12
        // ballBody.position.z = racketBody.position.z - (params.racketCircleDim * 1)
        // ballBody.position.y = 2
        let circleDim = params.racketCircleDim * 1 + params.ballDim
        let hitDepthDim = 2.5
        let verticalDist = Math.abs(racketBody.position.y - ballBody.position.y)
        let horizontalDist = Math.abs(racketBody.position.z - ballBody.position.z)
  
        let depthDist = racketBody.position.x - ballBody.position.x
        //console.log(depthDist)
        //console.log(horizontalDist, depthDist)
        //console.log(ballBody.velocity.x)
        //console.log(horizontalDist < circleDim, horizontalDist, verticalDist < circleDim)
        //console.log(ballBody.position, racketBody.position)
        // racketBody.position.y = ballBody.position.y * 0.25 + params.racketHeight
        if (horizontalDist < circleDim  && depthDist <= hitDepthDim && depthDist > - params.ballDim * 1.5 && params.isClicked) {
            const endMousePos = params.mousePosition
            const startMousePos = params.mouseClickPos
            const diff = {
                x: endMousePos.x - startMousePos.x,
                y: endMousePos.y - startMousePos.y
            }
            console.log(diff)
            params.mouseVelocity.x *= -0
            params.mouseVelocity.y *= 40
            //if (params.mouseVelocity.y > 0){
                //console.log(ballBody.velocity, params.mouseVelocity, horizontalDist, depthDist)
                let newPosZ = racketBody.position.z + params.mouseVelocity.x
                let hoz = newPosZ - ballBody.position.z
                let maxHoz = circleDim
                let force = hoz / maxHoz

                let racketRange = (params.planeDim.y + 6)
                let pos = - newPosZ + racketRange / 2
                let scale = (hoz > 0 ? pos : racketRange - pos) / racketRange
                scale = scale * (params.planeDim.y)
                let zVel = force * scale / params.timeToFall
                // console.log("hoz", hoz, pos, zVel, "Pos", pos, "Scale ", scale)
                // console.log(params.mouseVelocity.x)
                ballBody.velocity.x = - getForceInX(diff.y)
                ballBody.velocity.z = - diff.x * 30 * params.planeDim.y / 2;
                //ballBody.velocity.z = getSign(ballBody.velocity.z) * limitVelocityZ(ballBody, ballBody.velocity.z)
                
                
                //let newV = ballBody.velocity.clone()
                //newV.normalize()
                //ballBody.velocity = newV.scale(50)
                ballBody.velocity.y = 0.5 * params.gravityForce * params.timeToFall - ballBody.position.y / params.timeToFall

                //console.log(params.mouseVelocity, horizontalDist, depthDist, ballBody.velocity)
                params.isClicked = false
            //}
        }
       
    }

    function gameLoop()
    {
        hiddenCodeStart()
        ballPhy()
        racketPhy()
        racketBallHit()
        hiddenCodeEnd()
    }


    game.renderer.setAnimationLoop(gameLoop)
}

startGame()
