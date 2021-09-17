import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io, { Socket } from "socket.io-client";

import Peer from 'simple-peer';

function Video(props){
  const ref=useRef();
  useEffect(()=>{
    props.peer.on('stream',stream=>{
      ref.current.srcObject=stream;
    })
  },[])
  return <video autoPlay muted ref={ref}/>
}


const Room = (props) => {
  
  const [peers,setPeers]=useState([]);
  const socketRef=useRef();
  const userVideo=useRef();
  const PeersRef=useRef([]);
  const { id } = useParams();

   
 
 
  

  
  

  

  

  
  

  useEffect(() => {
    socketRef.current=io.connect('/');
    
   
    const roomId = id;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
         
        userVideo.current.srcObject = stream;
        socketRef.current.emit('join',roomId);
     

        socketRef.current.on('allusers',(usersId)=>{
          const peers=[];
          usersId.forEach((userId)=>{
            const peer=createPeer(userId,socketRef.current.id,stream)
            PeersRef.current.push({
              peerId:userId,
              peer,
            })
            peers.push(peer);
          })
          setPeers(peers);


        })
        

        socketRef.current.on('user joined',payload=>{
          const peer=addPeer(payload.signal,payload.callerId,stream);
          PeersRef.current.push({
            peerId:payload.callerId,
            peer,
          })
          setPeers([...peers,peer]);

        })
        socketRef.current.on('receiving returned signal',payload=>{
          const item=PeersRef.current.find(p=>p.peerId===payload.id);
          item.peer.signal(payload.signal);
        })

        
      });
    
    
   
  }, []);
  function createPeer(userToSignal,callerId,stream){
    
    const peer=new Peer({
      initiator:true,
      trickle:false,
      stream

    });
    peer.on('signal',signal=>{
      console.log("rahul moutya")
      socketRef.current.emit("sending signal",{userToSignal,callerId,signal})

    })

    return peer;
  }

  function addPeer(incomingSignal,callerId,stream)
  {
    const peer=new Peer({
      initiator:false,
      trickle:false,
      stream,
    })
    peer.on('signal',signal=>{
      socketRef.current.emit('returning signal',{signal,callerId})
    })
    peer.signal(incomingSignal);
    return peer;

  }

  return (
    <div className="room">
      
      <video
        muted
        autoPlay
        ref={userVideo}
        style={{ width: "100px", height: "100px" }}
      />
      {
        peers.map((peer,index)=>{
          return(
            <Video key ={index} peer={peer}/>
          )
        })
      }
    </div>
    
  );
};
export default Room;
