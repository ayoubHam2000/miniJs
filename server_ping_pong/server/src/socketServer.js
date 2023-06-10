const io = require('socket.io')(3000, {
    cors: {
        origin : ["http://localhost:5173"]
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
    }

    add(player) {
        if (this.player1 === undefined)
            this.player1 = player
        else if (this.player2 === undefined)
            this.player2 = player
        if (this.player1 && this.player2)
            return (true)
        return (false)
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
            let res = this.aRoom.add(newClient)
            this.clients.push(clientId)
            this.clientRooms[clientId] = this.aRoom
            if (res) {
                this.aRoom = new ARoom()
                return (this.clientRooms[clientId])
            }
            return (undefined)
        }
    }

    removeClient(clientId) {
        console.log(`Client ${clientId} removed`)
    }
}

const manager = new Manager()


io.on("connection", socket => {
    const socketId = socket.id

    socket.on("join", () => {
        let room = manager.addClient(socketId)
        if (room) {
            room.status()
        }
    })

    socket.on('disconnect',  () => {
        manager.removeClient(socketId)
    });
})





