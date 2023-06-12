function dist3D(a, b) {
    let arr = [
        (a.x - b.x),
        (a.y - b.y),
        (a.z - b.z),
    ]
    return arr.map((item) => item ** 2).reduce((res, b) => res + b)
}

function dist2D(a, b) {
    let arr = [
        (a.x - b.x),
        (a.y - b.y)
    ]
    return arr.map((item) => item ** 2).reduce((res, b) => res + b)
}

function lineEquation(p1, p2) {
    let a = (p1.y - p2.y) / (p1.x - p1.y)
    let b = p1.y - p1.x * a
    return {
        a, b
    }
}

function getSign(x){
    return x < 0 ? -1 : 1 
}

export {
    dist2D,
    dist3D,
    lineEquation,
    getSign,
}