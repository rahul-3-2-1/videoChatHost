
const express=require('express');
const app=express();
const cors=require('cors');
const server=require('http').createServer(app);


const io=require('socket.io')(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]

    }
});
const PORT=process.env.PORT||5000;
app.use(cors());







io.on('connection',(socket)=>{
    socket.on('join',({roomId,userId})=>{
        const roomClient=io.sockets.adapter.rooms[roomId]||{length:0};

        const client=roomClient.length;

        console.log(userId)
        
        if(client===0)
        {
            console.log(`creating room with id ${roomId}`)
            socket.join(roomId)
            socket.broadcast.to(roomId).emit('user-connected',userId);
            socket.emit('room_Created',roomId)
        }
        else{
            console.log(`joining room ${roomId},emmitting full`)
            socket.emit("rrom_joined",roomId);
        }
    })
    socket.on('start_call', (roomId) => {
        console.log(`Broadcasting start_call event to peers in room ${roomId}`)
        socket.broadcast.to(roomId).emit('start_call')
      })
      socket.on('webrtc_offer', (event) => {
        console.log(`Broadcasting webrtc_offer event to peers in room ${event.roomId}`)
        socket.broadcast.to(event.roomId).emit('webrtc_offer', event.sdp)
      })
      socket.on('webrtc_answer', (event) => {
        console.log(`Broadcasting webrtc_answer event to peers in room ${event.roomId}`)
        socket.broadcast.to(event.roomId).emit('webrtc_answer', event.sdp)
      })
      socket.on('webrtc_ice_candidate', (event) => {
        console.log(`Broadcasting webrtc_ice_candidate event to peers in room ${event.roomId}`)
        socket.broadcast.to(event.roomId).emit('webrtc_ice_candidate', event)
      })
})
server.listen(PORT,()=>console.log("heelo from server"));