const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 5000;
app.use(cors());

<<<<<<< HEAD

const users={};

=======
let numClients = {};
let admin = {};
>>>>>>> d29a22b46ec86b711156d66f9b73c9756940efc9
io.on("connection", (socket) => {
  socket.on("join", (roomId) => {
    let check = false;
    if (numClients[roomId]) check = true;

    if (!check) {
      console.log(`creating room with id ${roomId}`);

      socket.join(roomId);
      numClients[roomId] = [socket.id];
      admin[socket.id] = roomId;
      console.log(numClients[roomId]);
    } else {
      if (numClients[roomId].length > 50) {
        socket.emit("room-full");
        return;
      } else {
        console.log(`joining room ${roomId},emmitting full`);

        numClients[roomId].push(socket.id);
      }
    }
    const usersId = numClients[roomId].filter((id) => id != socket.id);
    socket.emit("allusers", usersId);
    socket.broadcast.to(roomId).emit("user-connected", socket.id);
  });
  socket.on('sending signal',payload=>{
    io.to(payload.callerId).emit('user joined',{
      
      signal:payload.signal,
      callerId:payload.callerId,
    })
  });
  socket.on('returning signal',payload=>{
    io.to(payload.callerId).emit('receiving returned signal',{signal:payload.signal,id:socket.id});


  });
  socket.on("start_call", (roomId) => {
    console.log(`Broadcasting start_call event to peers in room ${roomId}`);
    socket.broadcast.to(roomId).emit("start_call");
  });
  socket.on("webrtc_offer", (event) => {
    console.log(
      `Broadcasting webrtc_offer event to peers in room ${event.roomId}`
    );
    socket.broadcast.to(event.roomId).emit("webrtc_offer", event.sdp);
  });
  socket.on("webrtc_answer", (event) => {
    console.log(
      `Broadcasting webrtc_answer event to peers in room ${event.roomId}`
    );
    socket.broadcast.to(event.roomId).emit("webrtc_answer", event.sdp);
  });
  socket.on("webrtc_ice_candidate", (event) => {
    console.log(
      `Broadcasting webrtc_ice_candidate event to peers in room ${event.roomId}`
    );
    socket.broadcast.to(event.roomId).emit("webrtc_ice_candidate", event);
  });
});
server.listen(PORT, () => console.log("heelo from server"));
