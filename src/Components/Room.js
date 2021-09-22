import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";


// import {BsFillMicFill,BsFillMicMuteFill} from 'react-icons/bs';
import {IoIosMic,IoIosMicOff} from 'react-icons/io'
import {FaVideo,FaVideoSlash} from 'react-icons/fa';
import {MdScreenShare,MdCallEnd} from 'react-icons/md'
import {FaWindowClose} from 'react-icons/fa';
import '../Css/room.css';

import Peer from 'simple-peer';

function Video(props){
  const ref=useRef();
  useEffect(()=>{
    props.peer.on('stream',stream=>{
      ref.current.srcObject=stream;
    })
  },[])
  return <div className="videoborder"><video autoPlay muted ref={ref}/></div>
}


const Room = (props) => {
  
  const [peers,setPeers]=useState([]);
  const [ismicOpen,setIsMicopen]=useState(false);
  const [isVideoOpen,setIsVideoOpen]=useState(false);
  const [shareScreen,setShareScreen]=useState(false);
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
          setPeers((peers)=>[...peers,peer]);

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
    <div className="outerContainer">
      <div className="room-outer">
    <div className="room">
      <div className={`${peers.length?"videoContainer":'fullSize'}`}>
        <div className="videoborder">
      <video
        muted
        autoPlay
        ref={userVideo}
       
      />
      </div>
            
      {
        peers.map((peer,index)=>{
          return(
            <Video key ={index} peer={peer}/>
           
          )
        })
      }
      </div>
    </div>
    </div>
    <div className="function">
      <div>{ismicOpen?<IoIosMic onClick={()=>{setIsMicopen(!ismicOpen)}} className="mic open"/>:<IoIosMicOff onClick={()=>{setIsMicopen(!ismicOpen)}} className="mic closed"/>}</div>
      <div>{isVideoOpen?<FaVideo onClick={()=>{setIsVideoOpen(!isVideoOpen)}} className="video open"/>:<FaVideoSlash onClick={()=>{setIsVideoOpen(!isVideoOpen)}} className="video closed"/>}</div> 
      <div>{shareScreen?<FaWindowClose onClick={()=>{setShareScreen(!shareScreen)}} className="shareScreen shareScreenclosed"/>:<MdScreenShare onClick={()=>{setShareScreen(!shareScreen)}} className="shareScreen open"/>}</div> 
      <div><MdCallEnd className="end"/></div> 
    </div>
    </div>
    
  )
};
export default Room;
