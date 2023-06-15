const clc = require('cli-color');
const socketIo = require('socket.io')
const Game = require('./game/Game')

class AClient {
    constructor (clientId) {
        this.clientId = clientId
    }
}

class ARoom {

    static roomId = 0

    constructor (io) {
        this.roomId = ARoom.roomId
        this.io = io
        this.closed = false
        this.player1 = undefined
        this.player2 = undefined
        this.game = undefined
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
        this.io.to(this.player2.clientId).emit(event, data2)
    }

    #sendToOther(event, clientId, data) {
        if (this.closed) {
            let player2 = this.getPlayer2Id(clientId)
            this.io.to(player2).emit(event, data)
        }
    }

    start() {
        this.game = new Game()
        this.game.room = this
        this.game.init()
        this.game.gameLoop()


        this.#broadCast(
            "start", 
            {turn: 0, id: this.player1.clientId}, 
            {turn: 1, id: this.player2.clientId}
        )
    }

    playerLeft(clientId) {
        if (this.closed === false)
            return
        this.game.stop()
        this.#sendToOther("", clientId, clientId)
    }

    //===============

    sendBallInfo(data) {
        //data.position
        //data.velocity
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
            }
        }
        this.#broadCast("ballInfo", data, data2)
    }

    sendRacketMove(data) {
        if (this.closed) {
            let player2 = this.getPlayer2Id(data.clientId)
            this.io.to(player2).emit("moveRacket", data)
        }
    }
    
    //===============

    receiveHitBall(data) {
        this.game.ballObj.socketReceiveHit(data)
    }
}
    
class SocketManager {
    constructor() {
        this.io = socketIo(3000, {
            cors: {
                origin : ["http://10.12.6.8:5173"]
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
        
            socket.on("join", () => {
                this.#addClient(socketId)
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

        })
    }

    #addClient(clientId) {
        if (!(clientId in this.clients)) {
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

    #removeClient(clientId) {
        let room = this.clientRooms.get(clientId)
        if (room) {
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


    //======================================================================

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




