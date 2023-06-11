const io = require('socket.io')(3000, {
    cors: {
        origin : ["http://10.12.6.8:5173"]
    }
})

io.on("connection", socket => {
    //socket var of a client
    console.log(socket.id)
    socket.on("custom-event", (obj) => {

        //send to all socket including the client that send the message which is the (socket)
        //socket.emit("from_server", "hi clients")

        //send socket to all clients except this client
        //socket.broadcast.emit("from_server", "hi clients")

        //send socket to specific client
        //socket.to('socket_id or room_id').emit("from_client_to_another_client", "hi this message is private")

        //join a to room, room id can be anything that client will agree with
        //socket.join("room_id")

        //callBack ??
        // 17:40 - Admin Dashboard
        // 20:07 - Namespaces
        // 21:15 - MIddleware

        // 24:52 - Offline Mode
        // socket.volatile. ... //forget about sending socket after reconnecting
        // socket.io will save all socket and send them after reconnecting
        // in the client side
        // socket.connect() //to reconnect
        // socket.disconnect() //to disconnect from the server
        console.log(obj)
    })
})
