import { Game } from "./MyObjects";
import { params } from './Utils/Params'
import { load } from './Utils/Loader'
import { io } from 'socket.io-client'


function getSocket(game) {
    if (!params.withSocket) {
        game.setPlayer2ToBotMode()
        return undefined
    }
    const socket = io("http://10.12.6.8:3000")
    
    socket.on("connect", () => {
        console.log("Client is connected")
    
        //after connecting
        socket.emit("join")
    
        // socket.on('disconnected', () => {
        //     socket.emit('leave', "aaa");
        // });
    })

    socket.on("start", (data) => {
        // data.turn
        console.log(data)
        game.start(data)
    })

    socket.on("player2Event", (data) => {
        //data.ballPosition
        //data.ballVelocity
        game.scene.player2.socketReceive(data)
    })

    socket.on("moveRacket", (data) => {
        //data.position
        game.scene.player2.socketMoveRacket(data)
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

    sendData(data) {
        if (!this.socket)
            return
        //data.position
        //data.velocity
        data.position = data.position.clone()
        data.velocity = data.velocity.clone()
        data.position.z *= -1
        data.position.x *= -1

        data.velocity.x *= -1
        data.velocity.z *= -1
        console.log("send data the other player: ", data)
        this.socket.emit("event", data)
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
        this.socket.emit("racketMove", data)
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
        params.frame++
        game.renderer.render(game.scene, game.camera)
    }


    game.renderer.setAnimationLoop(gameLoop)
}

export default startGame
