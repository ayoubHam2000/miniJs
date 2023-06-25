import { params } from './Utils/Params'
import { load } from './Utils/Loader'
import { io } from 'socket.io-client'
import { Game } from './MyObjects/Game'
import * as THREE from "three";

function getSocket(game) {
    let token = ""
    
    //localStorage.setItem("lastname", "Smith");
    let a = localStorage.getItem("token");
    if (a) {
        console.log(a)
        token = a
    }

    const socket = io("http://10.12.5.9:3001" , {
        extraHeaders: {
            Authorization: `Bearer ${token}`
        }
    })
    
    socket.on("connect", () => {
        console.log("Client is connected")
    
        //after connecting
        socket.emit("join_game", ({
            isBotMode : params.botSocket,
            isClassic : false,
        }))
    
        // socket.on('disconnected', () => {
        //     socket.emit('leave', "aaa");
        // });
    })

    
    socket.on("start", (data) => {
        // data.turn
        console.log(data)
        game.start(data)
    })

    socket.on("end_game", () => {
        console.log("end-game")
        game.gameInfo.start = false
        //!end game
    })
    
    socket.on("ballInfo", (data) => {
        game.scene.ballObj.socketGetBallInfo(data)
    })

    socket.on("player2Event", (data) => {
        //data.ballPosition
        //data.ballVelocity
        game.scene.player2.socketReceive(data)
    })

    socket.on("moveRacket", (data) => {
        //data.position
        //console.log(data)
        game.scene.player2.socketMoveRacket(data)
    })

    socket.on("gameScore", (data) => {
        game.gameInfo.scorePlayer1 = data.score[0]
        game.gameInfo.scorePlayer2 = data.score[1]
        console.log("game score", game.gameInfo)
    })

    socket.on("turn", (data) => {
        game.gameInfo.turn = data.turn
    })

    socket.on("loseEvent", (data) => {
        game.scene.ballObj.socketLose(data)
    })

    socket.on("opponentLeft", (data) => {
        console.log("opponentLeft ", data)
        game.gameInfo.start = false
        alert("Game End!!!")
    })

    return (socket)
}

class SocketManager {
    constructor(socket) {
        this.socket = socket
    }

    hitBall(data) {
        if (!this.socket)
            return
        //data.distX
        //data.distY
        this.socket.emit("hitBall", data)
    }

    lose(data) {
        if (!this.socket)
            return
        this.socket.emit("lose", data)
    }

    racketMove(data) {
        if (!this.socket)
            return
        //data.position
        
        data.position = data.position.clone()
        data.position.z *= -1
        data.position.x *= -1
        this.socket.emit("moveRacket", data)
    }
}




async function startGame() {
    await load()
    const game = new Game()

    //socket
    const socket = getSocket(game)
    game.socketMgr = new SocketManager(socket)

    //game init
    window.game = game
    game.scene.init(game)

    //loop
    function guiChangeValues() {
        game.orbit.enabled = params.enableOrbit

        let bloom = game.guiParams.getVal("bloom", {threshold: 0.6, strength:0.35, radius:0}, 0, 10, 0.01)
        game.bloomPass.threshold = bloom.threshold;
        game.bloomPass.strength = bloom.strength;
        game.bloomPass.radius = bloom.radius;

        //light
        let light = game.guiParams.getVal("light", {
            spotIntensity: 1.6, 
            penumbra:0.45,
            angle:0,
            amIntensity: 1,
        }, 0, 10, 0.01)
    
        //game.gameInfo.start = true; game.scene.ballObj.position.y = 0; game.scene.ballObj.velocity.y = 15
        game.scene.tableColor.material.color = new THREE.Color(params.color)

        game.scene.spotLight.intensity = light.spotIntensity
        game.scene.spotLight.penumbra = light.penumbra
        game.scene.spotLight.angle = light.angle
        game.scene.ambientLightObj.intensity = light.amIntensity
    }


    function interpolateColors(ratio, color1, color2) {
        let rgb1 = {
            r : (color1 >> 16) & 255,
            g : (color1 >> 8) & 255,
            b : (color1) & 255,
        }
        let rgb2 = {
            r : (color2 >> 16) & 255,
            g : (color2 >> 8) & 255,
            b : (color2) & 255,
        }
        let r = Math.round((1 - ratio) * rgb1.r + ratio * rgb2.r);
        let g = Math.round((1 - ratio) * rgb1.g + ratio * rgb2.g);
        let b = Math.round((1 - ratio) * rgb1.b + ratio * rgb2.b);
      
        return (r << 16 | g << 8 | b);
    }

    function getHexColor(color) {
        return (color.r << 16 | color.g << 8 | color.b)
    }

    function racketEffect() {
        //console.log( game.scene.racketMat)
        let ratio = (params.changeable.value + 1) / 2
        ratio = ratio * ratio
        //game.scene.racketMat.emissiveIntensity = 4
        let newColor = interpolateColors(ratio, 0x003898, 0xe8a115)
        game.scene.racketMat.color.set(newColor)
        game.scene.racketMat.emissive.set(newColor)
        //this.getHexColor(this.interpolateColors(item.scale.x))
        params.changeable.value += params.changeable.speed
        if (Math.abs(params.changeable.value) > 1) {
            params.changeable.value = 1 * Math.sign(params.changeable.value)
            params.changeable.speed *= -1
        }
    }

    function gameLoop()
    {
        guiChangeValues()
        game.scene.update()
        // racketEffect()

        // let p = game.guiParams.getVal("pos", {x: 0, y:5, z:0}, -20, 20, 0.1)
        // game.scene.spotLight.position.set(p.x, p.y, p.z)

        params.frame++
        game.renderer.render(game.scene, game.camera)
        //game.bloomComposer.render()
    }


    game.renderer.setAnimationLoop(gameLoop)
}

export default startGame
