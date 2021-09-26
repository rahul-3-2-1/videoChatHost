import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

// import {BsFillMicFill,BsFillMicMuteFill} from 'react-icons/bs';
import { IoIosMic, IoIosMicOff } from "react-icons/io";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { MdScreenShare, MdCallEnd } from "react-icons/md";
import { FaWindowClose } from "react-icons/fa";
import RenderVideo from "./RenderVideo";
import "../Css/room.css";

import Peer from "simple-peer";

function Video(props) {
  const ref = useRef();
  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);
  return (
    <div className="vidsection">
      <video autoPlay muted ref={ref} />
    </div>
  );
}

const Room = (props) => {
  const [row1,setRow1]=useState({});
  const [stream,setStream]=useState();
  const [row2,setRow2]=useState({});
  const [peers, setPeers] = useState([]);
  const [totalUser, setTotaluser] = useState(peers.length);
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
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        setStream(stream);
        socketRef.current.emit("join", roomId);

        socketRef.current.on("allusers", (usersId) => {
          const peers = [];
          usersId.forEach((userId) => {
            const peer = createPeer(userId, socketRef.current.id, stream);
            PeersRef.current.push({
              peerId: userId,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
          setTotaluser(peers.length+1);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerId, stream);
          PeersRef.current.push({
            peerId: payload.callerId,
            peer,
          });
          
          
          
          setPeers((peers) => [...peers, peer]);
          setTotaluser(peers.length+2);
        
          
        });
        socketRef.current.on("receiving returned signal", (payload) => {
          const item = PeersRef.current.find((p) => p.peerId === payload.id);
          item.peer.signal(payload.signal);
        });
      });
  }, []);
  useEffect(()=>{
    console.log(totalUser);
    console.log(totalUser);
    let a=Math.floor((peers.length+2)/2);
    console.log(a);
    console.log(Math.floor(totalUser+1)/2);
    let siz=100/a;
    
    console.log(siz," ",totalUser);
    setRow1({width:`${siz}%`,borderRadius:"1.3rem"})
    let len=(peers.length+1)-a;

    let siz2=100/(len);
    setRow2({width:`${siz2}%`,borderRadius:"1.3rem"});
  },[peers.length,totalUser])
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

  console.log(totalUser);
  const audioStream=()=>{
    let aud=stream;
    let audioTrack=aud.getAudioTracks();
    audioTrack[0].enabled=!audioTrack[0].enabled;

    setStream(aud);
    

    
    setIsMicopen(!ismicOpen);
  }
  const videoStream=()=>{
   
    let vid=stream;
    let mediaTracks=vid.getVideoTracks();
    mediaTracks[0].enabled=!mediaTracks[0].enabled;
    
    setStream(vid);
    
    setIsVideoOpen(!isVideoOpen);
  }

  return (
    <div className="outerContainer">
      <div className="room-outer">
        <div className="room">
          <div className={`videoContainer ${peers.length===1?'vert':''}`}>
            <div style={(peers.length)>1?row1:(peers.length)===1?{width:"50%",borderRadius:"1.3rem"}:{}}
            
            className={(peers.length+1)<=1?"full":"row1"}>
              <video muted autoPlay ref={userVideo}/>
            </div>
            {
              peers.map((item,id)=>{
                return <RenderVideo totalUser={peers.length+1} row1={row1} row2={row2} len={Math.floor((peers.length)/2)} id={id} key={id} peer={item}/>
              })
              
              }
            
            
            
          </div>
           
        </div>
      </div>
      <div className="function">
        <div>
          {ismicOpen ? (
            <IoIosMic
              onClick={() => {
                audioStream();
              }}
              className="mic open"
            />
          ) : (
            <IoIosMicOff
              onClick={() => {
               audioStream();
              }}
              className="mic closed"
            />
          )}
        </div>
        <div>
          {isVideoOpen ? (
            <FaVideo
              onClick={() => {
                videoStream()
              }}
              className="video open"
            />
          ) : (
            <FaVideoSlash
              onClick={() => {
               videoStream()
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
