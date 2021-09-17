import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io, { Socket } from "socket.io-client";

import Peer from "peerjs";
const connect = io.connect(`/`);



const Room = () => {
    const myPeer = new Peer();
  const [videoStreams, setVideoStreams] = useState([]);
  console.log(videoStreams);
  const  vid=useRef();

  const userVideo = useRef();
  const [incomingVideo,setIncomingVideo]=useState([]);
  const incomingVideos=useRef();
  

  const { id } = useParams();

  myPeer.on("call", (call) => {
    call.answer(userVideo.current.srcObject);
    // call.on("stream", (userVideoStream) => {
    //   incomingVideos.current.srcObject=userVideoStream;
    // });
  });

  
  const connectToNewUser = (userId, stream) => {
      console.log(stream," ",userId);
    const call = myPeer.call(userId, stream);
    call.on("stream", (userVideoStream) => {
     
      vid.srcObject=userVideoStream
    
      
    });
    
  };

  useEffect(() => {
   
    const roomId = id;

    myPeer.on("open", (id) => {
      console.log("id");
      connect.emit("join", { roomId, userId: id});
    });
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        myPeer.on('call',(call)=>{
          call.answer(stream);

        })
         
        userVideo.current.srcObject = stream;
        console.log(stream);
        
        connect.on("user-connected", (userId) => {
          console.log("rahul");
          connectToNewUser(userId, stream);
        });
      });
   
  }, []);
console.log(userVideo);
console.log(incomingVideo);
  return (
    <div className="room">
      {id}
      <video
        muted
        autoPlay
        ref={userVideo}
        style={{ width: "100px", height: "100px" }}
      />
      {
        incomingVideo.map((item)=>{
          <video
          muted
          autoPlay
          ref={item}
          style={{ width: "100px", height: "100px" }}
          />
        })
      }
    
      
    </div>
    
  );
};
export default Room;
