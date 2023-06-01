export const params = {
    //Used with gui
    sphereColor : "#00ff00",
    wireFrame : false,
    speed : 0.01,
    penumbra : 0.45,
    intensity : 1.6,
    angle : 1.1,
    x : 0,
    vectorPos1 : {
        x: 35,
        y: 11,
        z: 0,
    },
    vectorRot1 : {
        x: -Math.PI / 2,
        y: Math.PI / 2 - 0.4,
        z: Math.PI / 2,
    },

    enableOrbit : true,
    width: 160,
    height: 35,
    depth: 95,
    posY: 9.6,
    table_width: 5,
    table_height: 5,
    table_depth: 6.6,
    ambientLightIntensity: 0.38,

    //Not used
    //Window
    winWidth : window.innerWidth,
    winHeight : window.innerHeight,
    aspect : window.innerWidth /  window.innerHeight,



    //Other
    PLAYER_ID: 1,
    planeDim: {
        x: 27.4, //13.7
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
    gravityForce : 4,
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

    timeStep: 1/60,

    frame: 0,
}