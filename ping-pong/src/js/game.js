import { Game } from "./MyObjects";
import {params} from './Utils/Params'
import { getSign } from "./MyMath/Utils";
import * as CANNON from 'cannon-es'
import * as MyMath from './MyMath'
import * as THREE from "three";

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

    function ballPhy() {
        const sphereBody = game.worldObj.ballBody
        let sphereVelocity = sphereBody.velocity
        let sphereVelocitySign = {
            x: getSign(sphereVelocity.x),
            y: getSign(sphereVelocity.y),
            z: getSign(sphereVelocity.z)
        }
        let sphereVelocityForce = {
            x: 8,
            y: 3,
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
    }

    function racketPhy() {
        let camera = game.camera
        let object = game.scene.racketObj
        let objectWrd = game.worldObj.racketBody
        // let p = new THREE.Vector3()
        // p.setFromMatrixPosition(b.matrixWorld)
        // let ndcCoordinates = p.project(a);
        //let dist = MyMath.dist3D(a, b)
        //console.log(p)
        //console.log(b.position)

        let x1 = params.planeDim.x / 2 - 1
        let x2 = 1
        let aspect = window.innerWidth / window.innerHeight

        let tmpObj = new THREE.Object3D();
        tmpObj.position = new THREE.Vector3(params.planeDim.x / 2 , 0, 0);
        let objectPosition = new THREE.Vector3();
        objectPosition.setFromMatrixPosition(object.matrixWorld);
        let objectPositionCamera = objectPosition.clone().applyMatrix4(camera.matrixWorldInverse);
        let distanceToCameraPlane = Math.abs(objectPositionCamera.z);
        objectWrd.position.z = -params.mousePosition.x * distanceToCameraPlane / 2
        
        
        
        //objectWrd.position.x = params.planeDim.x / 2 - params.mousePosition.y * (distanceToCameraPlane / 2)
        /*if (objectWrd.position.x <= 1)
            objectWrd.position.x = 1
        else if (objectWrd.position.x >= params.planeDim.x / 2 + 1)
            objectWrd.position.x = params.planeDim.x / 2 + 1*/
        console.log(distanceToCameraPlane)

        let mx1 = x1 * (aspect / distanceToCameraPlane)
        let mx2 = x2 * (aspect / distanceToCameraPlane)
        objectWrd.position.x = -params.mousePosition.y * distanceToCameraPlane / aspect
    }

    function gameLoop()
    {
        hiddenCode()
        ballPhy()
        racketPhy()
        game.renderer.render(game.scene, game.camera)
    }


    game.renderer.setAnimationLoop(gameLoop)
}

startGame()
