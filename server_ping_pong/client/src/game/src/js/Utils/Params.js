export const params = {
//Used with gui
    enableOrbit : false,



//Not used
    //params
    loadTex : false,
    netCollision : true,

    //window
    winWidth : window.innerWidth,
    winHeight : window.innerHeight,
    aspect : window.innerWidth /  window.innerHeight,

    //spotLight
    penumbra : 0.45,
    intensity : 1.6,
    angle : 1.1,

    //light
    ambientLightIntensity: 0.38,

    //scene box
    sceneBox: {
        width: 160,
        height: 35,
        depth: 95,
        posY: 9.4,
    },

    //table
    table : {
        width: 5,
        height: 5,
        depth: 6.6,
        posY: -7.4,
    },

    //camera
    cameraPos : {
        x: 36,
        y: 10,
        z: 0,
    },
    cameraRotation : {
        x: -Math.PI / 2,
        y: Math.PI / 2 - 0.4,
        z: Math.PI / 2,
    },
    



    

   
    //Other
    PLAYER_ID: 1,
    planeDim: {
        x: 36.17, //18.085
        y: 15.25 //7.625
    },


    racketDim : {
        x: 3.5,
        y: 6.5
    },

    racketCircleDim: 1.5,
    racketHeight : 2.5,

    ballPosition : {
        x : 0,
        y : 5,
        z : 0,
    },
    ballDim : 0.2,
    //We assume that the ball falls to the ground within a time frame of `timeToFall` second."
    //We assume that the ball max height is `maxHeight` unit
    //We assume that the gravitational force is `gravityForce`
    // x_f = - 0.5 g.t^2 + v_0.t + x_0
    // v_f ^ 2 = v_s ^ 2 + 2.g.h
    // => `minVx` < V.x < `maxVx`
    // => `minVz` < V.z < `maxVz`
    maxHeight : 4,
    timeToFall : 0.75,
    //changed
    gravityForce : 20,
    groundVelocity: 4,
    minVx: 13.7,
    maxVx: 27.4,
    minVz: 0,
    maxVz: 7.625,
    
    time : 0,
    mousePosition : {
        x: 0,
        y: 0,
        oldX: 0,
        oldY: 0,
    },

    mouseVelocity : {
        x: -1,
        y: -1
    },

    mouseClickPos : {
        x: -1,
        y: -1
    },

    isClicked : false,

    timeStep: 1/50,

    frame: 0,
}



function playerInfo () {
    function getPlaneProperties(points) {
        const p1 = points.p1
        const p2 = points.p2
        const p3 = points.p3
    
        const vector1 = {
            x: p3.x - p1.x,
            y: p3.y - p1.y
        }
        const vector2 = {
            x: p2.x - p1.x,
            y: p2.y - p1.y
        }
     
        const matrix = {
            a: vector1.x, b: vector2.x,
            c: vector1.y, d: vector2.y
        }
    
        const det = 1 / (matrix.a * matrix.d - matrix.b * matrix.c)
    
        const invMatrix = {
            a: matrix.d * det, b: - matrix.b * det,
            c: - matrix.c * det, d: matrix.a * det
        }
        return {
            matrix, invMatrix
        }
    }

    const hOffset = 12
    const wOffset = 3
    const planePoints = {
        p1 : new Vector2(params.planeDim.x / 2 + hOffset, +params.planeDim.y / 2 + wOffset),
        p2 : new Vector2(params.planeDim.x / 2 + hOffset, -params.planeDim.y / 2 - wOffset),
        p3 : new Vector2(1, +params.planeDim.y / 2 + wOffset),
    }

    if (params.PLAYER_ID === 2) {
        planePoints.p1 = new Vector2(params.planeDim.x / 2, +params.planeDim.y / 2)
        planePoints.p2 = new Vector2(params.planeDim.x / 2, +params.planeDim.y / 2)
        planePoints.p3 = new Vector2(params.planeDim.x / 2, +params.planeDim.y / 2)
    }

    const planeProperties = getPlaneProperties(planePoints)

    return {
        p1: planePoints.p1,
        p2: planePoints.p2,
        p3: planePoints.p3,
        matrix: planeProperties.matrix,
        invMatrix: planeProperties.invMatrix
    }
}

// ======================================= 
// ======================================= 
// ======================================= 
// ======================================= 

params.player = playerInfo()
