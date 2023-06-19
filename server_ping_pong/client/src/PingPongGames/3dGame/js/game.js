import { params } from './Utils/Params'
import { load } from './Utils/Loader'
import { io } from 'socket.io-client'
import { Game } from './MyObjects/Game'


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
        console.log("game score", game.gameInfo)
        game.gameInfo.scorePlayer1 = data.score[0]
        game.gameInfo.scorePlayer2 = data.score[1]
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
    }

    function gameLoop()
    {
        guiChangeValues()
        game.scene.update()

        // let p = game.guiParams.getVal("pos", {x: 0, y:5, z:0}, -20, 20, 0.1)
        // game.scene.spotLight.position.set(p.x, p.y, p.z)

        params.frame++
        game.renderer.render(game.scene, game.camera)
    }


    game.renderer.setAnimationLoop(gameLoop)
}

export default startGame
