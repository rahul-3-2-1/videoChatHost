import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

// import {BsFillMicFill,BsFillMicMuteFill} from 'react-icons/bs';
import { IoIosMic, IoIosMicOff } from "react-icons/io";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { MdScreenShare, MdCallEnd } from "react-icons/md";
import { FaWindowClose } from "react-icons/fa";
import "../Css/room.css";

import Peer from "simple-peer";





function Video(props) {
  const ref = useRef();
  console.log(props.peer);
  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);
  return (
    <div className="videoborder">
      <video autoPlay muted ref={ref} />
    </div>
  );
}

const Room = (props) => {
  const [peers, setPeers] = useState([]);
  const [ismicOpen, setIsMicopen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [shareScreen, setShareScreen] = useState(false);
  const socketRef = useRef();
  const userVideo = useRef();
  const PeersRef = useRef([]);
  const { id } = useParams();

  useEffect(() => {
    socketRef.current = io.connect("/");
    const roomId = id;
    let stream;
    const getUserMedia=async ( )=>{
      try{
       stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
       console.log(stream);
      userVideo.current.srcObject=stream;
      socketRef.current.emit("join", roomId);

        socketRef.current.on("allusers", (usersId) => {
          const peerss = [];
          usersId.forEach((userId) => {
            const peer = createPeer(userId, socketRef.current.id, stream);
            PeersRef.current.push({
              peerId: userId,
              peer,
            });
            peerss.push(peer);
          });
          console.log(stream," ",peerss);
          setPeers(()=>[stream,...peerss]);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerId, stream);
          PeersRef.current.push({
            peerId: payload.callerId,
            peer,
          });
          setPeers((peers) => [...peers, peer]);
        });
        socketRef.current.on("receiving returned signal", (payload) => {
          const item = PeersRef.current.find((p) => p.peerId === payload.id);
          item.peer.signal(payload.signal);
        });
      
      }
      catch(err){
        console.log(err);

      }

    }
    getUserMedia();
   
    
        
  }, []);
  function createPeer(userToSignal, callerId, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
    peer.on("signal", (signal) => {
      console.log("rahul moutya");
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerId,
        signal,
      });
    });

    return peer;
  }
  const displayVideo=(id)=>{
    for(let i=id;i<(peers.length)/2+1;i++)
    {
      <div className="videoContainers">
        {id===0?<video muted autoPlay ref={peers[0]} ></video>:
        <Video key={i} peer={peers[i]}/>
        }

      </div>
    }
  }
  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });
    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerId });
    });
    peer.signal(incomingSignal);
    return peer;
  }

  return (
    <div className="outerContainer">
      <div className="room-outer">
      
        <div className="room">
          {console.log(peers)}
          <div className="videoContainer">
          {
            peers.length<=2?(
              
              peers.map((item,id)=>{
               return <Video key={id} peer={item}/>
              })
            ):(
             <>
             <div className="container1">
               {displayVideo(0)}
             </div>
             <div className="container2">
              {displayVideo((peers.length)/2+1)}
             </div>
             </>
            )

          }
          </div>
         
        </div>)
        
      </div>
      <div className="function">
        <div>
          {ismicOpen ? (
            <IoIosMic
              onClick={() => {
                setIsMicopen(!ismicOpen);
              }}
              className="mic open"
            />
          ) : (
            <IoIosMicOff
              onClick={() => {
                setIsMicopen(!ismicOpen);
              }}
              className="mic closed"
            />
          )}
        </div>
        <div>
          {isVideoOpen ? (
            <FaVideo
              onClick={() => {
                setIsVideoOpen(!isVideoOpen);
              }}
              className="video open"
            />
          ) : (
            <FaVideoSlash
              onClick={() => {
                setIsVideoOpen(!isVideoOpen);
              }}
              className="video closed"
            />
          )}
        </div>
        <div>
          {shareScreen ? (
            <FaWindowClose
              onClick={() => {
                setShareScreen(!shareScreen);
              }}
              className="shareScreen shareScreenclosed"
            />
          ) : (
            <MdScreenShare
              onClick={() => {
                setShareScreen(!shareScreen);
              }}
              className="shareScreen open"
            />
          )}
        </div>
        <div>
          <MdCallEnd className="end" />
        </div>
      </div>
    </div>
  );
};
export default Room;
