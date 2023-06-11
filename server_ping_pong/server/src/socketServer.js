const io = require('socket.io')(3000, {
    cors: {
        origin : ["http://10.12.6.8:5173"]
    }
})

class AClient {
    constructor (clientId) {
        this.clientId = clientId
    }
}


class ARoom {
    constructor (roomId) {
        this.roomId = roomId
        this.player1 = undefined
        this.player2 = undefined
        this.closed = false
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



    startPlaying() {
        console.log("Start playing")
        io.to(this.player1.clientId).emit("start", {turn: 0})
        io.to(this.player2.clientId).emit("start", {turn: 1})
    }

    getPlayer2(clientId) {
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
            console.log(`Client ${clientId} added`)
            const newClient = new AClient(clientId)
            this.aRoom.add(newClient)
            this.clients.push(clientId)
            this.clientRooms[clientId] = this.aRoom
            if (this.aRoom.closed) {
                this.aRoom = new ARoom()
            }
        }
    }

    sendToPlater2(data) {
        //data.clientId
        //data.ballPosition
        //data.ballVelocity
        let room = this.clientRooms[data.clientId]
        if (room.closed) {
            console.log("Room", room)
            let player2 = this.clientRooms[data.clientId].getPlayer2(data.clientId)
            io.to(player2).emit("player2Event", data)
        }
    }

    removeClient(clientId) {
        let room = this.clientRooms[clientId]
        let player1 = room.player1
        let player2 = room.player2

        if (player1) {
            console.log(`Client ${clientId} removed`)
            this.clients.splice(indexToRemove, this.clients.indexOf(player1.clientId));
            this.clientRooms.delete(player1.clientId)
            if (room === this.aRoom) {
                this.aRoom.player1 = undefined
            }
        }
        if (player2) {
            console.log(`Client ${clientId} removed`)
            this.clients.splice(indexToRemove, this.clients.indexOf(player2.clientId));
            this.clientRooms.delete(player2.clientId)
            if (room === this.aRoom) {
                this.aRoom.player1 = undefined
            }
        }


   
        //let room = this.clientRooms[clientId]
        


        
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

    socket.on('disconnect',  () => {
        manager.removeClient(socketId)
    });
})





