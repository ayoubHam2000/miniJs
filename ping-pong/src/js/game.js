import { Game } from "./MyObjects";
import {params} from './Utils/Params'
import { getSign } from "./MyMath/Utils";
import * as CANNON from 'cannon-es'

async function startGame() {
    const game = new Game()

    function hiddenCode() {
        game.world.step(params.timeStep)


        game.scene.lightObj.penumbra = params.penumbra
        game.scene.lightObj.angle = params.angle
        game.scene.lightObj.intensity = params.intensity
        game.scene.lightObjHelper.update()
        

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

    }

    function gameLoop()
    {

        hiddenCode()

        const sphereBody = game.worldObj.ballBody
        let sphereVelocity = sphereBody.velocity
        let sphereVelocitySign = {
            x: getSign(sphereVelocity.x),
            y: getSign(sphereVelocity.y),
            z: getSign(sphereVelocity.z)
        }
        let sphereVelocityForce = {
            x: 8,
            y: 5,
            z: 1
        }

        if (sphereBody.position.y > 5) {
            sphereVelocitySign.y = -1;
        }

        sphereBody.velocity.x = sphereVelocitySign.x * sphereVelocityForce.x
        //sphere.velocity.y = sphereVelocitySign.x * sphereVelocityForce.x
        //sphereBody.velocity.y = sphereVelocitySign.y * sphereVelocityForce.y

        

        if (sphereBody.position.y <= -20) {
            sphereBody.position = new CANNON.Vec3(-12, 5, 0)
            sphereBody.velocity = new CANNON.Vec3(0, 0, 0)
        }



        game.renderer.render(game.scene, game.camera)
    }


    game.renderer.setAnimationLoop(gameLoop)
}

startGame()
