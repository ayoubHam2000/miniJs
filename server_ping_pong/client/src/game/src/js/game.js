import { Game } from "./MyObjects";
import { params } from './Utils/Params'
import { load } from './Utils/Loader'
import { Ball } from "./MyObjects/Ball";
import { Racket } from "./MyObjects/Racket";
import { GameConst } from "./MyObjects/gameConst";
import { Net } from "./MyObjects/Net";
import { Bot } from "./MyObjects/Bot";
import { io } from 'socket.io-client'

function getSocket(game) {
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
        game.scene.botObj.player2SocketReceive(data)
    })

    socket.on("moveRacket", (data) => {
        //data.position
        game.scene.botObj.player2SocketMoveRacket(data)
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

    game.gameConst = new GameConst()
    game.scene.netObj = new Net(game)
    game.scene.ballObj = new Ball(game)
    game.scene.racketObj = new Racket(game)
    game.scene.botObj = new Bot(game)
    window.game = game
    
    const socket = getSocket(game)
    game.socketMgr = new SocketManager(socket)
  
    function changing1() {
        // const boxObj = game.scene.environmentSceneObj
        const light = game.scene.ambientLightObj
        
        game.scene.lightObj.position.set(3, 15, 0)
        light.intensity = params.ambientLightIntensity
        game.scene.lightObj.penumbra = params.penumbra
        game.scene.lightObj.angle = params.angle
        game.scene.lightObj.intensity = params.intensity
        game.scene.lightObj.castShadow = true
        game.scene.ballObj.castShadow = true
        game.scene.lightObjHelper.update()
        game.orbit.enabled = params.enableOrbit


        //console.log(params.width)
        //console.log(boxObj.scale)
        //console.log(camera.position, camera.rotation)
        // boxObj.scale.x = params.width
        // boxObj.scale.y = params.height
        // boxObj.scale.z = params.depth
        // boxObj.position.y = params.posY


       

        game.scene.tableModel.scale.x = params.table_width
        game.scene.tableModel.scale.y = params.table_height
        game.scene.tableModel.scale.z = params.table_depth


        if (!game.gameInfo.start)
            return
        game.scene.netObj.update()
        game.scene.ballObj.update()
        game.scene.racketObj.update()
        game.scene.botObj.update()
        game.camera.update()
    }

    function hiddenCodeEnd() {
        if (params.frame === 0) {
            game.camera.position.x = params.vectorPos1.x;
            game.camera.position.z = params.vectorPos1.z;
            game.camera.position.y = params.vectorPos1.y;
            game.camera.rotation.x = params.vectorRot1.x;
            game.camera.rotation.y = params.vectorRot1.y;
            game.camera.rotation.z = params.vectorRot1.z;
        }
        params.frame++
        game.renderer.render(game.scene, game.camera)
    }

    function gameLoop()
    {
        changing1()
        hiddenCodeEnd()
    }


  

    game.renderer.setAnimationLoop(gameLoop)
}

export default startGame
