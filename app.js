const express = require("express");
const app = express();
const cors = require("cors");
const { config } = require("process");
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
let usersInfo={};
let admin = {};
io.on("connection", (socket) => {





  let roomID;
  
  socket.on("join", ({roomId,email,userName}) => {

   
    let check = false;
    roomID=roomId;
   
    
    if(!admin[roomId])
    {
      admin[roomId]=email;
    }
    if(admin[roomId]===email)
    {
      usersInfo[roomId]?usersInfo[roomId].push([email,userName,true]):usersInfo[roomId]=[[email,userName,true]];
      socket.emit('host',true);
    }
    else{
      usersInfo[roomId]?usersInfo[roomId].push([email,userName,false]):usersInfo[roomId]=[[email,userName,false]];
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
    const len=usersInfo[roomId].length;
    const usersId = numClients[roomId].filter((id) => id !== socket.id);
    const usersdetails=usersInfo[roomId].filter((item,id)=>id!==(len-1));
  
    socket.emit("allusers", {usersIdPeer:usersId,usersInfo:usersdetails});
    
  });
  
  
  
  socket.on("webrtc_offer", (event) => {
    const userId=event.userId;
    const {email,displayName}=event;
   
    
    io.to(userId).emit("webrtc_offer", {sdp:event.sdp,userId:socket.id,email:email,displayName:displayName,host:event.isHost,isVideoEnable:event.isVideoEnable});
  });
  socket.on('sendMssg',(config)=>{
    console.log(config.roomId);
    for(let i=0;i<numClients[config.roomId].length;i++)
    {
      if(numClients[config.roomId][i]!==socket.id)
        {
      
        io.to(numClients[config.roomId][i]).emit("recievedMssg",{mssg:config.mssg,displayName:config.displayName,host:config.host,email:config.email});
        }
    }
  })
  
  socket.on("webrtc_answer", (event) => {
  

   io.to(event.userId).emit("webrtc_answer", {sdp:event.sdp,userId:socket.id,isVideoEnable:event.isVideoEnable});
  });
  socket.on('videoChange',({roomId,enable})=>{
    const user=numClients[roomId].filter((id)=>id!==socket.id);

    user.map((item)=>{
      io.to(item).emit("videoChange",{userId:socket.id,enable});
    })

  })

  socket.on('removeId',(config)=>{
    console.log(config);
    const {roomId,userId}=config;
    const users=numClients[config.roomId].filter((id)=>id!==config.userId);
    numClients[config.roomId]=users;
    
  })
  

  socket.on('disconnect',()=>{
    console.log("diconnected Reahul is dkfvnn")
    const index=numClients[roomID].indexOf(socket.id);
    const users=numClients[roomID].filter((id) => id !== socket.id);

    
    users.map((id)=>{io.to(id).emit('disconnectUser',{userId:socket.id,cond:false})});
    
    usersInfo[roomID]=usersInfo[roomID].filter((item,id)=>id!==index);
    numClients[roomID]=users;

  })


  socket.on('disconnectUser',({roomId,email})=>{
   
    let bol=false;
    
    if(admin[roomId]===email)
    bol=true;
    const index=numClients[roomId].indexOf(socket.id);
    const users=numClients[roomId].filter((id) => id !== socket.id);
    
    usersInfo[roomId]=usersInfo[roomId].filter((item,id)=>id!==index);
    users.map((id)=>{io.to(id).emit('disconnectUser',{userId:socket.id,cond:bol})});

    if(bol)
    {
      numClients[roomId]=[];
      usersInfo[roomId]=[];
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


if(process.env.NODE_ENV === "production")
{
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname,  "client","build","index.html"));
  });
}

server.listen(PORT, () => console.log("heelo from server"));
