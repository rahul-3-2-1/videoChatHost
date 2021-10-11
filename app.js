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

  let roomID;
  socket.on("join", (roomId) => {

    
    let check = false;
    roomID=roomId;
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
  
  
  
  socket.on("webrtc_offer", (event) => {
    const userId=event.userId;
    console.log(userId);
    
    io.to(userId).emit("webrtc_offer", {sdp:event.sdp,userId:socket.id});
  });
  socket.on('sendMssg',(config)=>{
    console.log(config.roomId);
    for(let i=0;i<numClients[config.roomId].length;i++)
    {
      if(numClients[config.roomId][i]!==socket.id)
      {console.log(numClients[config.roomId][i],"   ","sending medsage");
        io.to(numClients[config.roomId][i]).emit("recievedMssg",config.mssg);
        }
    }
  })
  socket.on("webrtc_answer", (event) => {
  

   io.to(event.userId).emit("webrtc_answer", {sdp:event.sdp,userId:socket.id});
  });

  socket.on('removeId',(config)=>{
    console.log(config);
    const {roomId,userId}=config;
    const users=numClients[config.roomId].filter((id)=>id!==config.userId);
    numClients[config.roomId]=users;
    
  })
  

  socket.on('disconnect',()=>{
    console.log("diconnected Reahul is dkfvnn")
    const users=numClients[roomID].filter((id) => id !== socket.id);
    users.map((id)=>{io.to(id).emit('disconnectUser',{userId:socket.id,cond:false})});
    numClients[roomID]=users;

  })


  socket.on('disconnectUser',(roomId)=>{
    console.log("rahul disconnected");
    let bol=false;
    console.log(roomId);
    if(admin[roomId]===socket.id)
    bol=true;

    const users=numClients[roomId].filter((id) => id !== socket.id);
    users.map((id)=>{io.to(id).emit('disconnectUser',{userId:socket.id,cond:bol})});
    if(bol)
    {
      numClients[roomId]=[];
    }
    else{
      numClients[roomId]=users;
    }
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
