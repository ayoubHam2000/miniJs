function From3DTo2D(){
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
            game.gameConst.setTimeToFall(0.75, game.worldObj.world)
            spot.hit(newPos)
            console.log(spot.position)
        }
    }


    
  
}
