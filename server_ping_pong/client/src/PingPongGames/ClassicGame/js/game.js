import { params } from './Utils/Params'
import { io } from 'socket.io-client'
import { Game } from './MyObjects/Game'
import * as THREE from 'three'

function getSocket(game) {
    const socket = io("http://10.12.5.9:3000")
    
    socket.on("connect", () => {
        console.log("Client is connected")
    
        //after connecting
        socket.emit("join", ({
            botMode : params.botSocket
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

    socket.on("ballInfo", (data) => {
        game.scene.ballObj.socketGetBallInfo(data)
    })

    // socket.on("player2Event", (data) => {
    //     //data.ballPosition
    //     //data.ballVelocity
    //     game.scene.player2.socketReceive(data)
    // })

    socket.on("paddleMove", (data) => {
        //data.e
        //data.id
        if (data?.id === 1)
            game.scene.player1.receivePos(data)
        else if (data?.id === 2)
            game.scene.player2.receivePos(data)
    })

    socket.on("gameScore", (data) => {
        console.log("game score", game.gameInfo)
        game.changeScore(data)
    })

    // socket.on("turn", (data) => {
    //     game.gameInfo.turn = data.turn
    // })

    // socket.on("loseEvent", (data) => {
    //     game.scene.ballObj.socketLose(data)
    // })

    // socket.on("opponentLeft", (data) => {
    //     console.log("opponentLeft ", data)
    //     game.gameInfo.start = false
    //     alert("Game End!!!")
    // })

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
        //data.e
        //data.id
        this.socket.emit("movePaddle", data)
    }
}




async function startGame() {
    const game = new Game()

    //socket
    const socket = getSocket(game)
    game.socketMgr = new SocketManager(socket)

    //!game init
    window.game = game
    game.scene.init(game)

    function gameLoop()
    {
        game.scene.update()
        params.frame++
        game.renderer.render(game.scene, game.camera)
    }


    function frame() {
        game.scene.update()
        params.frame++
        game.renderer.render(game.scene, game.camera)
    }

    let clock = new THREE.Clock();
    let delta = 0;
    let interval = 1 / 60;

    function update() {
        requestAnimationFrame(update);
        delta += clock.getDelta();

        if (delta  > interval) {
            frame()
            delta = delta % interval;
        }
    }

    update()
    //game.renderer.setAnimationLoop(update)
}

export default startGame
