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


let numClients = {};
let admin = {};
io.on("connection", (socket) => {
  socket.on("join", (roomId) => {
    let check = false;
    if(!admin[roomId])
    {
      admin[roomId]=socket.id;
    }
    if (numClients[roomId]) check = true;
    
    socket.join(roomId);

    if (!check) {
      

     
      numClients[roomId] = [socket.id];
      
      
    } else {
      if (numClients[roomId].length > 50) {
        socket.emit("room-full");
        return;
      } else {
       
        numClients[roomId].push(socket.id);
      }
    }
    const usersId = numClients[roomId].filter((id) => id !== socket.id);
    socket.emit("allusers", usersId);
    // socket.broadcast.to(roomId).emit("user-connected", socket.id);
  });
  
  
  socket.on("start_call", (roomId) => {
    console.log(`Broadcasting start_call event to peers in room ${roomId}`);
    socket.broadcast.to(roomId).emit("start_call");
  });
  socket.on("webrtc_offer", (event) => {
    const userId=event.userId;
    console.log(userId);
    
    io.to(userId).emit("webrtc_offer", {sdp:event.sdp,userId:socket.id});
  });
  socket.on('sendMssg',(config)=>{
    console.log(config.roomId);
    socket.broadcast.emit("recievedMssg",config.mssg);
  })
  socket.on("webrtc_answer", (event) => {
  

   io.to(event.userId).emit("webrtc_answer", {sdp:event.sdp,userId:socket.id});
  });


  socket.on('disconnectUser',(roomId)=>{
    console.log("rahul");
    let bol=false;
    if(admin[roomId]===socket.id)
    bol=true;


    socket.broadcast.emit('disconnectUser',{userId:socket.id,cond:bol});
  })
  
  socket.on('ICECandidate',(config)=>{
    const userID=config.userId;
    const candidate=config.candidate;
    
    io.to(userID).emit('toICECandidate',{
      userId:socket.id,
      candidate:candidate,
      label:config.sdp
    })
  })



});
server.listen(PORT, () => console.log("heelo from server"));
