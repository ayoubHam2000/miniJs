const io = require("socket.io");

const listen = io(3000, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

listen.on("connection", (socket) => {
  console.log("Hi! there your id is : ", socket.id);

  socket.on("custom_event", (m) => {
    console.log(m);
    //listen.emit("to_client", "Hi from server");
    socket.broadcast.emit("bla bla bla");
    // socket.to("id").emit("sd");
  });
});
