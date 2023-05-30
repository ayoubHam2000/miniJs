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