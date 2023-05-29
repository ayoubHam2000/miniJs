export const params = {
    //Used with gui
    sphereColor : "#00ff00",
    wireFrame : false,
    speed : 0.01,
    penumbra : 0,
    intensity : 1,
    angle : 0.2,
    x : 0,
    vectorPos1 : {
        x: 40,
        y: 16,
        z: 0,
    },
    vectorRot1 : {
        x: -Math.PI / 2,
        y: Math.PI / 2 - 0.4,
        z: Math.PI / 2,
    },

    enableOrbit : false,

    //Not used

    ballPosition : {
        x : -12,
        y : 3,
        z : 0,
    },

    planeDim: {
        x: 27.4, //13.7
        y: 15.25 //7.625
    },

    racketDim : {
        x: 3.5,
        y: 6.5
    },

    sphereDim : 0.25,
    gravity : -4,
    timeToFall : 1,
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

    timeStep: 1/30,

    frame: 0,
}