const clc = require('cli-color');
const io = require('socket.io')(3000, {
    cors: {
        origin : ["http://10.12.6.8:5173"]
    }
})

let roomId = 0

class AClient {
    constructor (clientId) {
        this.clientId = clientId
    }
}

class ARoom {
    constructor () {
        this.roomId = roomId
        this.player1 = undefined
        this.player2 = undefined
        this.closed = false
        roomId++
    }

    add(player) {
        if (this.player1 === undefined)
            this.player1 = player
        else if (this.player2 === undefined)
            this.player2 = player
        if (this.player1 && this.player2) {
            this.closed = true
            this.startPlaying()
        }
    }

    playerLeft(clientId) {
        if (this.closed) {
            let player2 = this.getPlayer2Id(clientId)
            io.to(player2).emit("opponentLeft", clientId)
            console.log("player left => ", player2)
        }
    }

    startPlaying() {
        io.to(this.player1.clientId).emit("start", {turn: 0, id: this.player1.clientId})
        io.to(this.player2.clientId).emit("start", {turn: 1, id: this.player2.clientId})
    }

    getPlayer2Id(clientId) {
        if (clientId === this.player1.clientId)
            return (this.player2.clientId)
        return (this.player1.clientId)
    }

    status() {
        console.log(`Room is created between ${this.player1.clientId} and ${this.player2.clientId}`)
    }
}

class Manager {
    constructor() {
        this.clients = []
        this.clientRooms = new Map()
        this.aRoom = new ARoom()
    }

    hasClient(clientId) {
        return (clientId in this.clients)
    }

    addClient(clientId) {
        if (!this.hasClient(clientId)) {
            console.log(`Client ${clientId} added to room nb ${this.aRoom.roomId}`)
            const newClient = new AClient(clientId)
            this.aRoom.add(newClient)
            this.clients.push(clientId)
            this.clientRooms.set(clientId, this.aRoom)
            if (this.aRoom.closed) {
                let m = clc.green(`Start playing between ${this.aRoom.player1.clientId} and ${this.aRoom.player2.clientId} room ${this.aRoom.roomId} => nbRooms ${this.clientRooms.size / 2}`)
                console.log(m)
                this.aRoom = new ARoom()
            }
        }
    }

    sendToPlater2(data) {
        //data.clientId
        //data.ballPosition
        //data.ballVelocity
        let room = this.clientRooms.get(data.clientId)
        if (room.closed) {
            let player2 = room.getPlayer2Id(data.clientId)
            io.to(player2).emit("player2Event", data)
        }
    }

    racketMove(data) {
        let room = this.clientRooms.get(data.clientId)
        if (room?.closed) {
            let player2 = room.getPlayer2Id(data.clientId)
            io.to(player2).emit("moveRacket", data)
        }
    }

    removeClient(clientId) {
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
}

const manager = new Manager()


io.on("connection", socket => {
    const socketId = socket.id

    socket.on("join", () => {
        manager.addClient(socketId)
    })

    socket.on("event", (data) => {
        //data.ballPosition
        //data.ballVelocity
        data.clientId = socketId
        manager.sendToPlater2(data)
    })

    socket.on("racketMove", (data) => {
        data.clientId = socketId
        manager.racketMove(data)
    })

    socket.on('disconnect',  () => {
        manager.removeClient(socketId)
    });
})





