const clc = require('cli-color');
const socketIo = require('socket.io')
//const Game = require('./PingPongGames/3dGame/Game')
const Game = require('./PingPongGames/ClassicGame/Game')

class AClient {
    constructor (clientId) {
        this.clientId = clientId
    }
}

class ARoom {

    static roomId = 0

    constructor (io, botMode = false) {
        this.roomId = ARoom.roomId
        this.io = io
        this.botMode = botMode
        this.closed = false
        this.player1 = undefined
        this.player2 = undefined
        this.game = undefined

        if (this.botMode)
            this.closed = true
        ARoom.roomId++
    }

    add(clientId) {
        let newPlayer = new AClient(clientId)
        if (this.player1 === undefined)
            this.player1 = newPlayer
        else if (this.player2 === undefined)
            this.player2 = newPlayer
        if (this.player1 && this.player2) {
            this.closed = true
        }
    }

    getPlayer2Id(clientId) {
        if (clientId === this.player1.clientId)
            return (this.player2.clientId)
        return (this.player1.clientId)
    }

    #broadCast(event, data1, data2) {
        this.io.to(this.player1.clientId).emit(event, data1)
        if (this.botMode === false)
            this.io.to(this.player2.clientId).emit(event, data2)
    }

    #sendToOther(event, clientId, data) {
        if (this.closed === false)
            return
        let player2 = this.getPlayer2Id(clientId)
        this.io.to(player2).emit(event, data)
    }

    start() {
        this.game = new Game()
        this.game.init(this, this.botMode)
        this.game.gameLoop()

        if (this.botMode === false) {
            this.#broadCast(
                "start", 
                {turn: 0, id: this.player1.clientId}, 
                {turn: 1, id: this.player2.clientId}
            )
        } else {
            this.#broadCast(
                "start", 
                {turn: 0, id: this.player1.clientId},
                undefined
            )
        }
    }

    playerLeft(clientId) {
        if (this.closed === false)
            return
        this.game.stop()
        if (this.botMode === false) {
            this.#sendToOther("", clientId, clientId)
        }
    }

    //===============

    sendBallInfo(data) {
        //data.position
        //data.velocity
        //data.init
        //data.spotPos
        //data.net
        let data2 = {
            position : {
                x: -data.position.x,
                y: data.position.y,
                z: -data.position.z,
            },
            velocity : {
                x: -data.velocity.x,
                y: data.velocity.y,
                z: -data.velocity.z,
            },
            init : data.init,
            net : data.net
        }
        if (data.spotPos) {
            data2.spotPos = {
                x: -data.spotPos.x,
                y: data.spotPos.y,
                z: -data.spotPos.z
            }
        }
        this.#broadCast("ballInfo", data, data2)
    }

    sendRacketMove(data) {
        if (this.closed === false)
            return
        if (this.botMode)
            return
        let player2 = this.getPlayer2Id(data.clientId)
        if (data.clientId === this.player1.clientId)
            this.game.racketP1.set(-data.position.x, data.position.y, -data.position.z)
        if (data.clientId === this.player2.clientId)
            this.game.racketP2.set(data.position.x, data.position.y, data.position.z)
        this.io.to(player2).emit("moveRacket", data)
    }
    
    sendBotRacketInfo(data) {
        if (this.closed === false)
            return
        console.log(`Send to ${this.player1.clientId}`)
        this.io.to(this.player1.clientId).emit("moveRacket", data)
    }

    sendGameScore(data) {
        if (this.closed === false)
            return
        let data2 = {
            score : data.score.reverse()
        }
        this.#broadCast("gameScore", data, data2)
    }

    sendTurn(data) {
        if (this.closed === false)
            return
        this.#broadCast("turn", data, data)
    }


    //!!========

    sendBallInfoClassic(data) {
        //data.position
        //data.velocity
        this.#broadCast("ballInfo", data, data)
    }

    sendPaddleMove(data) {
        this.#broadCast("paddleMove", data, data)
    }

    sendGameScoreClassic(data) {
        if (this.closed === false)
            return
        this.#broadCast("gameScore", data, data)
    }

    //===============

    receiveHitBall(data) {
        let playerType = this.player1.clientId === data.clientId ? -1 : 1
        data.playerType = playerType
        this.game.ballObj.socketReceiveHit(data)

    }

    //!!========

    receivePaddleMove(data) {
        if (data?.id === 1)
            this.game.player1.receivePos(data)
        else if (data?.id === 2)
            this.game.player2.receivePos(data)
    }
}
    
class SocketManager {
    constructor() {
        this.io = socketIo(3000, {
            cors: {
                origin : ["http://10.12.5.9:5173"]
            }
        })

        this.clients = []
        this.clientRooms = new Map()
        this.aRoom = new ARoom(this.io)
        this.#handleEvents()
    }

    #handleEvents() {
        this.io.on("connection", socket => {
            const socketId = socket.id
        
            socket.on("join", (data) => {
                data.clientId = socketId
                this.#addClient(data)
            })
        
            socket.on("disconnect",  () => {
                this.#removeClient(socketId)
            });

            socket.on("moveRacket", (data) => {
                data.clientId = socketId
                this.#racketMove(data)
            })

            socket.on("hitBall", (data) => {
                data.clientId = socketId
                this.#hitBall(data)
            })


            //====================

            socket.on("movePaddle", (data) => {
                data.clientId = socketId
                this.#paddleMove(data)
            })

        })
    }

    #addClient(data) {
        let clientId = data.clientId
        if (!(clientId in this.clients)) {
            if (data.botMode === true) {
                let newBotRoom = new ARoom(this.io, true)
                console.log(`Client ${clientId} added to Bot room nb ${newBotRoom.roomId}`)
                newBotRoom.add(clientId)
                this.clients.push(clientId)
                this.clientRooms.set(clientId, newBotRoom)
                let m = clc.green(`Start playing between ${clientId} and Bot room ${newBotRoom.roomId} => nbRooms ${this.clientRooms.size / 2}`)
                console.log(m)
                newBotRoom.start()
            } else {
                console.log(`Client ${clientId} added to room nb ${this.aRoom.roomId}`)
                this.aRoom.add(clientId)
                this.clients.push(clientId)
                this.clientRooms.set(clientId, this.aRoom)
                if (this.aRoom.closed) {
                    let m = clc.green(`Start playing between ${this.aRoom.player1.clientId} and ${this.aRoom.player2.clientId} room ${this.aRoom.roomId} => nbRooms ${this.clientRooms.size / 2}`)
                    console.log(m)
                    this.aRoom.start()
                    this.aRoom = new ARoom(this.io)
                }
            }
        }
    }

    #removeClient(clientId) {
        let room = this.clientRooms.get(clientId)
        if (room) {
            if (room.botMode === true) {
                let player1 = room.player1

                if (player1) {
                    room.playerLeft(clientId)
                    console.log(`Client ${player1.clientId} removed, bot room nb ${room.roomId}`)
                    this.clients.splice(this.clients.indexOf(player1.clientId), 1);
                    this.clientRooms.delete(player1.clientId)
                }
            } else {
                let player1 = room.player1
                let player2 = room.player2
        
                room.playerLeft(clientId)
                if (player1) {
                    console.log(`Client ${player1.clientId} removed, room nb ${room.roomId}`)
                    this.clients.splice(this.clients.indexOf(player1.clientId), 1);
                    this.clientRooms.delete(player1.clientId)
                    if (room === this.aRoom) {
                        this.aRoom.player1 = undefined
                    }
                }
                if (player2) {
                    console.log(`Client ${player2.clientId} removed, room nb ${room.roomId}`)
                    this.clients.splice(this.clients.indexOf(player2.clientId), 1);
                    this.clientRooms.delete(player2.clientId)
                    if (room === this.aRoom) {
                        this.aRoom.player2 = undefined
                    }
                }
            }
        }
    }


    //======================================================================

    #paddleMove(data) {
        let room = this.clientRooms.get(data.clientId)
        room?.receivePaddleMove(data)
    }

    #racketMove(data) {
        let room = this.clientRooms.get(data.clientId)
        room?.sendRacketMove(data)
    }

    #hitBall(data) {
        let room = this.clientRooms.get(data.clientId)
        room?.receiveHitBall(data)
    }

}



new SocketManager()




