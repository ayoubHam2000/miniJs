import { Game } from "./MyObjects";
import {params} from './Utils/Params'
import { getSign } from "./MyMath/Utils";
import * as CANNON from 'cannon-es'
import * as MyMath from './MyMath'
import * as THREE from "three";


async function startGame() {
    const game = new Game()

    function hiddenCodeStart() {
        game.world.step(params.timeStep)


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

        //sphereBody.velocity.x = sphereVelocitySign.x * sphereVelocityForce.x
        //sphere.velocity.y = sphereVelocitySign.x * sphereVelocityForce.x
        //sphereBody.velocity.y = sphereVelocitySign.y * sphereVelocityForce.y

        
       

        if (params.frame  === 0) {
            console.log("s")
            sphereBody.velocity.x = 12
        }

        if (sphereBody.position.y <= -10) {
            sphereBody.position = new CANNON.Vec3(-12, 5, 0)
            sphereBody.velocity = new CANNON.Vec3(12, 2, 0)
        }
    }

 

    let areaPoints = [
        new THREE.Vector3(params.planeDim.x / 2, 0, +params.planeDim.y / 2),
        new THREE.Vector3(params.planeDim.x / 2, 0, -params.planeDim.y / 2),
        new THREE.Vector3(1, 0, +params.planeDim.y / 2),
        new THREE.Vector3(1, 0, -params.planeDim.y / 2),
    ]


   

    function racketPhy() {

        function planeInvMatrix() {
            //p1, p2, p3 are 2d point
            let p1 = {
                x: 7.625,
                y: 13.7
            }
            let p2 = {
                x: -7.625,
                y: 13.7
            }
            let p3 = {
                x: 7.625,
                y: 0
            }
            //console.log(p1, p2, p3)
            let vector1 = {
                x: p3.y - p1.y,
                y: p3.x - p1.x
    
            }
            let vector2 = {
                x: p2.y - p1.y,
                y: p2.x - p1.x
            }
            //console.log(vector1, vector2)
            let matrix = {
                a: vector1.x, b: vector2.x,
                c: vector1.y, d: vector2.y
            }
            let det = 1 / (matrix.a * matrix.d - matrix.b * matrix.c)
            let invMatrix = {
                a: matrix.d * det, b: - matrix.b * det,
                c: - matrix.c * det, d: matrix.a * det
            }
            return invMatrix
        }
        invMatrix = planeInvMatrix()
    
        function getCoefficient(p) {
            let a = p.x * invMatrix.a + p.y * invMatrix.c
            let b = p.x * invMatrix.b + p.y * invMatrix.d
            return {
                x: a,
                y: b
            }
        }

        let camera = game.camera
        let object = game.scene.racketObj
        let objectWrd = game.worldObj.racketBody
        // let p = new THREE.Vector3()
        // p.setFromMatrixPosition(b.matrixWorld)
        // let ndcCoordinates = p.project(a);
        //let dist = MyMath.dist3D(a, b)
        //console.log(p)
        //console.log(b.position)

        let ballWd = game.worldObj.ballBody
        let aspect = window.innerWidth / window.innerHeight


        let iq = params.frame % 3
        //ballWd.position.set(areaPoints[iq].x, areaPoints[iq].y, areaPoints[iq].z)
        

        let perspectivePoints = [
            areaPoints[0].clone().applyMatrix4(camera.matrixWorldInverse),
            areaPoints[1].clone().applyMatrix4(camera.matrixWorldInverse),
            areaPoints[2].clone().applyMatrix4(camera.matrixWorldInverse),
            areaPoints[3].clone().applyMatrix4(camera.matrixWorldInverse),
        ]

        let a = [
            perspectivePoints[0].x / Math.abs(perspectivePoints[0].z),
            perspectivePoints[0].y / Math.abs(perspectivePoints[0].z),
            params.mousePosition.x,
            params.mousePosition.y
        ]
        a[0] = a[0] * 2
        a[1] = a[1] * 2
        a[1] = a[1] * (aspect)
        //console.log(a)

        const mousePosition = new THREE.Vector2(params.mousePosition.x, params.mousePosition.y)
        game.rayCaster.setFromCamera(mousePosition, game.camera)
        const intersects = game.rayCaster.intersectObject(game.scene.infinitePLaneObj)
        if (intersects[0]) {
            intersects[0].point.y = 0
            let thePoint = {
                x: intersects[0].point.x - areaPoints[0].x,
                y: intersects[0].point.z - areaPoints[0].z
            }
            let p = getCoefficient(thePoint)
            //console.log(intersects[0].point, p)
            if (p.y >= 0 && p.y <= 1)
                objectWrd.position.z = intersects[0].point.z
            else if (p.y < 0)
                objectWrd.position.z = 7.625
            else if (p.y > 1)
                objectWrd.position.z = -7.625
            
            /*p.y = objectWrd.position.z
            if (p.y <= 7.625 && p.y >= -7.625)
                objectWrd.position.z = intersects[0].point.z
            else if (p.y > 7.625)
                objectWrd.position.z = 7.625
            else if (p.y < -7.625)
                objectWrd.position.z = -7.625*/

            if (p.x >= 0 && p.x <= 1)
                objectWrd.position.x = intersects[0].point.x
            else if (p.x < 0)
                objectWrd.position.x = 13.7
            else if (p.x > 1)
                objectWrd.position.x = 0
            // else if (p.x >= 0)
            //     objectWrd.position.x = areaPoints[1].x
            // else if (p.x <= 1)
            //     objectWrd.position.x = areaPoints[0].x
            //objectWrd.position.y = intersects[0].point.y
            //objectWrd.position.z = intersects[0].point.z
        }

        let x1 = params.planeDim.x / 2 - 1
        let x2 = 1
        

        let tmpObj = new THREE.Object3D();
        tmpObj.position = new THREE.Vector3(params.planeDim.x / 2 , 0, 0);
        let objectPosition = new THREE.Vector3();
        objectPosition.setFromMatrixPosition(tmpObj.matrixWorld);
        let objectPositionCamera = objectPosition.clone().applyMatrix4(camera.matrixWorldInverse);
        let distanceToCameraPlane = Math.abs(objectPositionCamera.z);
        let distanceToCameraPlane2 = camera.position.x - objectWrd.position.x
        //objectWrd.position.z = -params.mousePosition.x * distanceToCameraPlane2
        
        
        
        //objectWrd.position.x = params.planeDim.x / 2 - params.mousePosition.y * (distanceToCameraPlane / 2)
        /*if (objectWrd.position.x <= 1)
            objectWrd.position.x = 1
        else if (objectWrd.position.x >= params.planeDim.x / 2 + 1)
            objectWrd.position.x = params.planeDim.x / 2 + 1*/
        //console.log()
        //console.log()

        let mx1 = x1 * (aspect / distanceToCameraPlane)
        let mx2 = x2 * (aspect / distanceToCameraPlane)
        //objectWrd.position.x = -params.mousePosition.y * distanceToCameraPlane / aspect
    }


    function getForceInX(mouseVelocityY) {
        mouseVelocityY = Math.abs(mouseVelocityY)
        if (mouseVelocityY > 0 && mouseVelocityY < 6)
            return (9)
        else if (mouseVelocityY < 18)
            return (12)
        return (15)
    } 

    function getForceInZ(mouseVelocityX) {
       
        return -(mouseVelocityX)
        if (mouseVelocityX > 0 && mouseVelocityX < 1.5)
            return (1)
        else if (mouseVelocityX < 6)
            return (2)
        return (3)       
    }

    function racketBallHit() {
        if (params.isClicked === false)
            return
        let circleDim = 1.75
        let hitDepthDim = 0.3
        let racketBody = game.worldObj.racketBody
        let ballBody = game.worldObj.ballBody
        let horizontalDist = Math.abs(racketBody.position.z - ballBody.position.z)
        // ballBody.position.x = 12
        // ballBody.position.z = 0
        // ballBody.position.y = 2
        let depthDist = racketBody.position.x - ballBody.position.x
        //console.log(horizontalDist, depthDist)
        //console.log(ballBody.velocity.x)
        if (horizontalDist < circleDim && depthDist < hitDepthDim) {
            const endMousePos = params.mousePosition
            const startMousePos = params.mouseClickPos
            const diff = {
                x: endMousePos.x - startMousePos.x,
                y: endMousePos.y - startMousePos.y
            }
            params.mouseVelocity.x *= 1000
            params.mouseVelocity.y *= 1000
            if (params.mouseVelocity.x !== 0 && params.mouseVelocity.y !== 0 && params.mouseVelocity.y > 0){
                ballBody.velocity.x = getForceInX(params.mouseVelocity.y) * getSign(params.mouseVelocity.y) * -2
                ballBody.velocity.z = getForceInZ(params.mouseVelocity.x);
                
                
                let newV = ballBody.velocity.clone()
                newV.normalize()
                ballBody.velocity = newV.scale(40)
                ballBody.velocity.y = 2

                console.log(params.mouseVelocity, horizontalDist, depthDist, ballBody.velocity, ballBody.velocity.clone().normalize())
                params.isClicked = false
            }
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
