import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

import Peer from "peerjs";
const connect = io.connect(`/`);



const Room = () => {
    const myPeer = new Peer();
  const [videoStreams, setVideoStreams] = useState([]);
  console.log(videoStreams);

  const userVideo = useRef();
  

  const { id } = useParams();

  myPeer.on("call", (call) => {
    call.answer(userVideo.current.srcObject);
    call.on("stream", (userVideoStream) => {
      setVideoStreams(userVideoStream);
    });
  });

  
  const connectToNewUser = (userId, stream) => {
      console.log(stream," ",userId);
    const call = myPeer.call(userId, stream);
    call.on("stream", (userVideoStream) => {
      setVideoStreams(userVideoStream);
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
          console.log(stream);
        userVideo.current.srcObject = stream;
        connect.on("room_joined", (userId) => {
          connectToNewUser(userId, stream);
        });
      });
   
  }, []);
  

  return (
    <div className="room">
      {id}
      <video
        muted
        autoPlay
        ref={userVideo}
        style={{ width: "100px", height: "100px" }}
      />
    </div>
  );
};
export default Room;
