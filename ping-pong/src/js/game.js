import { Game } from "./MyObjects";
import {params} from './Utils/Params'
import { getSign } from "./MyMath/Utils";
import * as CANNON from 'cannon-es'
import * as MyMath from './MyMath'
import * as THREE from "three";
import {load, loaderResult} from './Utils/Loader'
import  {TrailRenderer}  from "./Utils/Trail";

async function startGame() {
    await load()
    console.log(loaderResult)
    const game = new Game()
    const gameConst = game.gameConst
    const camera = game.camera
    const ballBody = game.worldObj.ballBody
    const ballObj = game.scene.ballObj
    const racketBody = game.worldObj.racketBody
    const racketObj = game.scene.racketObj

  
    const trail = new TrailRenderer(game, game.scene, game.scene.ballObj)


    
    function changing1() {
        // const boxObj = game.scene.environmentSceneObj
        const light = game.scene.ambientLightObj
        
        game.scene.lightObj.position.set(3, 15, 0)
        light.intensity = params.ambientLightIntensity
        game.scene.lightObj.penumbra = params.penumbra
        game.scene.lightObj.angle = params.angle
        game.scene.lightObj.intensity = params.intensity
        game.scene.lightObj.castShadow = true
        game.scene.ballObj.castShadow = true
        game.scene.lightObjHelper.update()
        game.orbit.enabled = params.enableOrbit


        //console.log(params.width)
        //console.log(boxObj.scale)
        //console.log(camera.position, camera.rotation)
        // boxObj.scale.x = params.width
        // boxObj.scale.y = params.height
        // boxObj.scale.z = params.depth
        // boxObj.position.y = params.posY


        racketValues = game.guiParams.getVal("racketPosY", {posY: -2, posX: 0, posZ : 0}, -5, 5, 0.1)
        game.scene.racketModel.position.x = racketValues.posX
        game.scene.racketModel.position.y = racketValues.posY
        game.scene.racketModel.position.z = racketValues.posZ

        game.scene.tableModel.scale.x = params.table_width
        game.scene.tableModel.scale.y = params.table_height
        game.scene.tableModel.scale.z = params.table_depth
        //boxObj.position.y = params.posY
    }


    function hiddenCodeStart() {
    
        game.world.step(params.timeStep)
  
        changing1()

       
    
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
        if (ballBody.position.y <= -1 || ballBody.position.x < -10) {
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
                game.gameConst.setTimeToFall(0.75, game.worldObj.world)
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

            let distBall = racketBody.position.x - ballBody.position.x
            let distBallY = racketBody.position.y - ballBody.position.y
            let distInter = racketBody.position.y - (intersects[0].point.y + 1)

            let m = 4
            let rr = (Math.abs(distBall) < m ? 1 : 0)
            let dist = (Math.abs(distBall) < m ? distBallY : distInter)
            let to = (Math.abs(distBall) < m ? ballBody.position.y  : (intersects[0].point.y + 1))
            //console.log(rr)
            if (Math.abs(dist) > 0.1)
                racketBody.position.y -= 0.1 * Math.sign(dist)
            else
                racketBody.position.y = to
            //console.log(dist, to)

            const newAngle = - Math.PI * 1.5 * (b * 2 - 1)
            if (newAngle > - Math.PI / 2 && newAngle < Math.PI / 2){
                game.scene.racketParent.rotation.x = newAngle
            }
            /*
            1 -> posY
            x 0 -> p/2 // 1/p/2
            x 0 -> 1 
            x 0 -> posY + 1 // (posY + 1) / (p /2)
            x 1 -> posY // (posY + 1) / (p /2) - 1
            
            */
            
        }
        
        // console.log(params.racketRot)
        game.scene.racketModel.rotation.z = params.racketRot.z
        
        //game.scene.racketModel.rotation.y = params.racketRot.y

        // let racketRange = (params.planeDim.y + 6)
        // let pos = - racketBody.position.z + racketRange / 2
        // console.log(pos, racketRange - pos)
        
    }



    let maxMV = {
        x : 0,
        y : 0
    }

    let maxTest = {
        x: 0,
        y: 0,
        minX: 0,
        minY: 0
    }

    function racketBallHit() {

        function getForceInX(mouseVelocityY) {
            let tmp = Math.min(0.04, Math.max(0.02, Math.abs(mouseVelocityY)))
            tmp = tmp / 0.04
            if (tmp > 0.5) {
                console.log(tmp)
                game.gameConst.setTimeToFall(0.5, game.worldObj.world)
            }
            let speed = (Math.sign(mouseVelocityY) * tmp * params.planeDim.x * -0.5 - params.planeDim.x * 0.5)
            return (speed / params.timeToFall)
        } 
    
        function getForceInZ(mouseVelocityX) {
            let tmp = Math.min(0.04, Math.max(0, Math.abs(mouseVelocityX)))
            tmp = tmp / 0.04

            let sign = Math.sign(mouseVelocityX)
            let r = params.planeDim.y
            let pos = - ballBody.position.z + r / 2
            let hoz = racketBody.position.z - ballBody.position.z
            let scale = (sign < 0 ? pos : r - pos)
            // console.log(scale)
            let speed = (sign * scale * -1 * tmp)
            return speed / params.timeToFall

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
       
        
        
        if (params.isClicked) {
            maxMV.x += params.mouseVelocity.x * 10
            maxMV.y += params.mouseVelocity.y
            maxTest.x += 1
            //maxMV.x = Math.max(maxMV.x, params.mouseVelocity.x)
            //maxMV.y = Math.max(maxMV.y, params.mouseVelocity.y)
        } else {
            maxTest.x = 0
            maxMV.x = 0
            maxMV.y = 0
        }
        //console.log(maxMV.x, maxMV.y)
        if (horizontalDist < circleDim  && depthDist <= hitDepthDim && depthDist > - params.ballDim * 1.5 && params.isClicked) {
            const endMousePos = params.mousePosition
            const startMousePos = params.mouseClickPos
            const diff = {
                x: endMousePos.x - startMousePos.x,
                y: endMousePos.y - startMousePos.y
            }
            //console.log(diff)
            params.mouseVelocity.x *= -0
            params.mouseVelocity.y *= 40
            console.log(maxMV.y / maxTest.x, maxMV.x / maxTest.x)
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
                ballBody.velocity.x = getForceInX(maxMV.y / maxTest.x)
                ballBody.velocity.z = getForceInZ(maxMV.x / maxTest.x)
                //ballBody.velocity.z = - diff.x * 30 * params.planeDim.y / 2;
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
        trail.update()

        game.scene.racketParent.position.copy(racketBody.position)
      
    }


    game.renderer.setAnimationLoop(gameLoop)
}

startGame()
