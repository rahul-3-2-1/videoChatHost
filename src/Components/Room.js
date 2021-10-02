import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { IoIosMic, IoIosMicOff } from "react-icons/io";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { MdScreenShare, MdCallEnd } from "react-icons/md";
import {BsFillChatDotsFill} from 'react-icons/bs';
import {FiUsers} from 'react-icons/fi';
import { FaWindowClose } from "react-icons/fa";
import RenderVideo from "./RenderVideo";
import ChatComponent from "./ChatComponent";
import "../Css/room.css";



const ICE_config = {
  iceServers: [
    {
      url: "stun:stun.l.google.com:19302",
    },
    {
      urls: "stun:stun.stunprotocol.org",
    },
    {
      url: "turn:192.158.29.39:3478?transport=udp",
      credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
      username: "28224511:1379330808",
    },
    {
      url: "turn:192.158.29.39:3478?transport=tcp",
      credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
      username: "28224511:1379330808",
    },
    {
      urls: "turn:numb.viagenie.ca",
      credential: "muazkh",
      username: "webrtc@live.com",
    },
  ],
};

const Room = (props) => {
  const [row1, setRow1] = useState({});
  const [stream, setStream] = useState();
  const [row2, setRow2] = useState({});
  const [peers, setPeers] = useState([]);
  const [totalUser, setTotaluser] = useState(peers.length);
  const [ismicOpen, setIsMicopen] = useState(true);
  const [isVideoOpen, setIsVideoOpen] = useState(true);
  const [allMssg,setAllMssg]=useState([]);
  const [chat,setChat]=useState(false);
  
  const [shareScreen, setShareScreen] = useState(false);
  const [first,setFirst]=useState(true);

  const socketRef = useRef();
  const userVideo = useRef();
  const PeersRef = useRef({});
  
  const senders = useRef([]);

  const { id } = useParams();

  const createConnection = () => {
    socketRef.current = io.connect("/");
    let totalPeers=[];

    const roomId = id;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        setStream(stream);
        console.log("join room");
        socketRef.current.emit("join", roomId);
        

        socketRef.current.on("allusers", async (usersId) => {
          
             
          const peerss = [];

          usersId.forEach(async (userId) => {
            const peer = await createPeer(userId, true);
            PeersRef.current[userId] = peer;

            peerss.push(peer);
          });
          await setPeers(peerss);
          totalPeers=peerss;
          
         
          setTotaluser(peerss.length + 1);
        });
        
       
      });
      socketRef.current.on('webrtc_answer',(event)=>{
        console.log("webrtc Answer");
        const peer=PeersRef.current[event.userId];
        peer.setRemoteDescription(new RTCSessionDescription(event.sdp))
      })
      
    socketRef.current.on('toICECandidate',(event)=>{
      console.log("Lastly executed");
      const candidate=new RTCIceCandidate({
        sdpMLineIndex:event.label,
        candidate:event.candidate,
      })
      const peer=PeersRef.current[event.userId];
      peer.addIceCandidate(candidate);
    })
    socketRef.current.on('webrtc_offer',(config)=>{
     
      console.log("webRtc-Ofeer");
    
    const peer=new RTCPeerConnection(ICE_config);
    PeersRef.current[config.userId]=peer;
    
     let peerstotal=first?totalPeers:peers;
     
      console.log(peerstotal);
     peerstotal.push(peer);
     setFirst(false);
     


      setPeers(peerstotal);
      setTotaluser(1+peerstotal.length);
    addTrack(peer);
    peer.onicecandidate=function (event) {
        if (event.candidate) {
          socketRef.current.emit("ICECandidate", {
            userId: config.userId,
            sdp: event.candidate.sdpMLineIndex,
            candidate: event.candidate.candidate,
          });
        }
      };
      peer.setRemoteDescription(new RTCSessionDescription(config.sdp));
      createAnswer(peer,config.userId);
      
   
     
   

      
    })
      
     
  
  };
  console.log(peers);
  useEffect(() => {
    createConnection();
    socketRef.current.on('recievedMssg',(mssg)=>{
      setAllMssg((allMssg)=>[...allMssg,{mssg,id:0}]);
  })
      
  
   
  }, []);
  
  useEffect(() => {
    let a = Math.floor((peers.length + 2) / 2);
    console.log(a);
    console.log(Math.floor(totalUser + 1) / 2);
    let siz = 100 / a;

    setRow1({ width: `${siz}%`, borderRadius: "1.3rem" });
    let len = peers.length + 1 - a;

    let siz2 = 100 / len;
    setRow2({ width: `${siz2}%`, borderRadius: "1.3rem" });
  }, [peers.length, totalUser]);

  async function createPeer(userId, offer) {
    console.log("create Peers");

    if (offer) {
      const peer = new RTCPeerConnection(ICE_config);
      PeersRef.current[userId]=peer;
      peer.onicecandidate = function (event) {
        console.log("ICECandidate");
        if (event.candidate) {
          socketRef.current.emit("ICECandidate", {
            userId: userId,
            sdp: event.candidate.sdpMLineIndex,
            candidate: event.candidate.candidate,
          });
        }
      };
      addTrack(peer);
      
      await createOffer(peer,userId);
      return peer;
    }
    
  }
  
  const createAnswer=async (peer,userId)=>{

    let sessionDescription;
    try{
      sessionDescription=await peer.createAnswer();
      peer.setLocalDescription(sessionDescription);
    }
    catch(err){
      console.log(err);
    }
    console.log("WEBRTC answer");
    socketRef.current.emit('webrtc_answer',{
      type:'webrtc_answer',
      sdp:sessionDescription,
      userId:userId
      

    })
  } 
 
  const addTrack=(peer)=>{
    console.log("add track");
    userVideo.current.srcObject.getTracks().forEach((track) => senders.current.push(peer.addTrack(track, userVideo.current.srcObject)));
  }
  const createOffer=async(peer,userId)=>{
    console.log("create Offer");
    let sessionDescription;
    try{
      sessionDescription=await peer.createOffer();
      peer.setLocalDescription(sessionDescription);

    }
    catch(err){
      console.log(err);

    }
    socketRef.current.emit('webrtc_offer',{
      type:'webrtc_offer',
      sdp:sessionDescription,
      userId:userId
    })
  }
  
 
  const audioStream = () => {
    let aud = stream;
    let audioTrack = aud.getAudioTracks();
    console.log(audioTrack);
    audioTrack[0].enabled = !audioTrack[0].enabled;

    setStream(aud);

    setIsMicopen(!ismicOpen);
  };
  const videoStream = () => {
    let vid = stream;
    let mediaTracks = vid.getVideoTracks();
    mediaTracks[0].enabled = !mediaTracks[0].enabled;

    setStream(vid);

    setIsVideoOpen(!isVideoOpen);
  };

  const shareUserScreen = () => {
    navigator.mediaDevices.getDisplayMedia({ cursor: true }).then((stram) => {
     
      const vid = stram.getTracks()[0];
      
      
      for(let i=0;i<senders.current.length;i++)
      {
        if(senders.current[i].track.kind==='video')
        {
          const ch=senders.current[i];
          console.log(ch);
        ch.replaceTrack(vid);
        }
      }
      
      userVideo.current.srcObject=stram;
      setShareScreen(!shareScreen);

    });
  };

  console.log(senders);
  return (
    <div className="outerContainer">
      <div className="containers">
      <div className="room-outer">
        <div className="room">
          <div className={`videoContainer ${peers.length === 1 ? "vert" : ""} `}>
            <div
              style={
                peers.length > 1
                  ? row1
                  : peers.length === 1
                  ? { width: "50%", borderRadius: "1.3rem" }
                  : {}
              }
              className={`${peers.length + 1 <= 1 ? "full" : "row1"} ${shareScreen?"full":""}  `}
            >
              <video muted autoPlay ref={userVideo} />
            </div>
            {peers.map((item, id) => {
              return (
                <RenderVideo
                  totalUser={peers.length + 1}
                  row1={row1}
                  row2={row2}
                  len={Math.floor(peers.length / 2)}
                  id={id}
                  key={id}
                  peer={item}
                />
              );
            })}
          </div>
        </div>
       
      </div>
        <div className={`${chat?'chatdiv':""}`}>
          {
            chat&&<ChatComponent allMssg={allMssg} setAllMssg={setAllMssg} roomId={id} socketRef={socketRef} setChat={setChat} />
          }

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
                videoStream();
              }}
              className="video open"
            />
          ) : (
            <FaVideoSlash
              onClick={() => {
                videoStream();
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
                shareUserScreen();
              }}
              className="shareScreen open"
            />
          )}
        </div>
        <div>
          <MdCallEnd className="end" />
        </div>
        
      </div>
      <div className="setting">
          <div >
          <FiUsers className="showParticipants"/>

          </div>
          <div >
          <BsFillChatDotsFill onClick={()=>setChat(!chat)} className="chatFeature"/>

          </div>
        

      </div>

      
     
      
    </div>
  );
};
export default Room;
