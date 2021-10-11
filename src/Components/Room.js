import React, { useEffect, useRef, useState } from "react";
import { useParams,useHistory } from "react-router-dom";
import io from "socket.io-client";
import { IoIosMic, IoIosMicOff } from "react-icons/io";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { MdScreenShare, MdCallEnd } from "react-icons/md";
import {BsFillChatDotsFill} from 'react-icons/bs';
import {FiUsers} from 'react-icons/fi';
import { FaWindowClose } from "react-icons/fa";
import RenderVideo from "./RenderVideo";
import ChatComponent from "./ChatComponent";
import ReactTooltip from "react-tooltip";
import {BiPin} from 'react-icons/bi';
import CallEnd from "./CallEnd";
import Middleware from './Middleware';
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
  const usersId=useRef([]);
  const [ended,setEnded]=useState(false);
  const [chat,setChat]=useState(false);
  const [join,setJoin]=useState(false);
  
  const [shareScreen, setShareScreen] = useState(false);
  const [first,setFirst]=useState(true);
  const [fullscreen,setFullScreen]=useState(false);
  const history=useHistory();
  const middlewareVideo=useRef();
  

  const socketRef = useRef();
  const userVideo = useRef();
  const PeersRef = useRef({});
  const PeersIdRef=useRef([]);
  
  const senders = useRef([]);

  const { id } = useParams();
 
   

  const createConnection = () => {
    socketRef.current = io.connect("/");
    
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        
        middlewareVideo.current.srcObject=stream;
        setStream(stream);
      });
      
     
  
  };
  
  useEffect(() => {
    createConnection();
    socketRef.current.on('recievedMssg',(mssg)=>{
      setAllMssg((allMssg)=>[...allMssg,{mssg,id:0}]);
  })
  
      
  
   
  }, []);
  useEffect(()=>{
    let totalPeers=[];

    const roomId = id;
    if(join)
    {
       userVideo.current.srcObject = stream;
       
        
        socketRef.current.emit("join", roomId);
        

        socketRef.current.on("allusers", async (usersIdPeer) => {
          
             
          const peerss = [];
          
          

          usersIdPeer.forEach(async (userId) => {
            const peer = await createPeer(userId, true);
            PeersRef.current[userId] = peer;
            usersId.current.push(userId);
            PeersIdRef.current.push(peer);
            peerss.push(peer);
          });
          await setPeers(peerss);
        
          totalPeers=peerss;
          
         
          setTotaluser(peerss.length + 1);
        });
        socketRef.current.on('webrtc_answer',(event)=>{
          
          const peer=PeersRef.current[event.userId];
          peer.setRemoteDescription(new RTCSessionDescription(event.sdp))
        })
        
      socketRef.current.on('toICECandidate',(event)=>{
        
        const candidate=new RTCIceCandidate({
          sdpMLineIndex:event.label,
          candidate:event.candidate,
        })
        const peer=PeersRef.current[event.userId];
        peer.addIceCandidate(candidate);
      })
      socketRef.current.on('webrtc_offer',(config)=>{
       
       
      
      const peer=new RTCPeerConnection(ICE_config);
      PeersRef.current[config.userId]=peer;
      
        let ListPeers=PeersIdRef.current;
       
        console.log(ListPeers);
       ListPeers.push(peer);
      
       console.log(PeersIdRef.current);
       setFirst(false);
      
       usersId.current.push(config.userId);
  
        setPeers(ListPeers);
        setTotaluser(1+ListPeers.length);
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
      socketRef.current.on('disconnectUser',(config)=>{
        console.log(usersId.current);
        delete PeersRef.current[config.userId];
        if(config.cond)
        {
          setPeers([]);
          PeersRef.current={};
          PeersIdRef.current=[];
          setTotaluser(0);
          senders.current=[];
          setEnded(true);
          
        }


        else if(usersId.current.length>0)
        {
          let peersid=usersId.current;
          const id=peersid.indexOf(config.userId);
         
          let temop=PeersIdRef.current;
          temop=temop.filter((item,i)=>i!==id);
          PeersIdRef.current=temop;
          setPeers(temop);
          
          
          peersid=peersid.filter((item)=>item!==config.userId)
          usersId.current=peersid;
          
        }

    
        
      })
      
        
       

    }

  },[join])



  
  function disconnect(){
    console.log("rahul");
    socketRef.current.emit('disconnectUser',id);
    history.push('/');
    
    
  }
  
  
  useEffect(() => {
    let a = Math.floor((peers.length + 2) / 2);
    console.log(a);
    console.log(Math.floor(totalUser + 1) / 2);
    let siz = 100 / a;

    setRow1({ width: `${siz}%`  });
    let len = peers.length + 1 - a;

    let siz2 = 100 / len;
    setRow2({ width: `${siz2}%`  });
    
  }, [peers.length, totalUser]);

  async function createPeer(userId, offer) {
    

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
   
    userVideo.current.srcObject.getTracks().forEach((track) => senders.current.push(peer.addTrack(track, userVideo.current.srcObject)));
  }
  const createOffer=async(peer,userId)=>{
    
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

  const shareUserScreen = (check) => {
    if(check)
    {
    navigator.mediaDevices.getDisplayMedia({ cursor: true }).then((stram) => {
     
      const vid = stram.getTracks()[0];
      
      
      for(let i=0;i<senders.current.length;i++)
      {
        if(senders.current[i].track.kind==='video')
        {
          const ch=senders.current[i];
        
        ch.replaceTrack(vid);
        }
      }
      
      userVideo.current.srcObject=stram;
      setShareScreen(!shareScreen);

    });
  }
  else{
    let video=stream.getVideoTracks()[0];
    
    for(let i=0;i<senders.current.length;i++)
      {
        if(senders.current[i].track.kind==='video')
        {
          const ch=senders.current[i];
        
        ch.replaceTrack(video);
        }
      }
      userVideo.current.srcObject=stream;
    
  }

  };
  useEffect(()=>{
    ReactTooltip.rebuild();
  },[ismicOpen,isVideoOpen,shareScreen,])

 console.log(PeersIdRef,"     ",peers);
  return (
    <div className="outerContainer">
      {!join?<Middleware
      userVideo={middlewareVideo}
      setJoin={setJoin}
      isVideoOpen={isVideoOpen}
      ismicOpen={ismicOpen}
      setIsVideoOpen={setIsVideoOpen}
      setIsMicopen={setIsMicopen}
      audioStream={audioStream}
      videoStream={videoStream}


      />:
      ended?<CallEnd/>:
      <div>
      
      <div className="containers">
      <div className="room-outer">
        <div className="room">
          <div className={`videoContainer ${peers.length === 1 ? "vert" : ""} `}>
            <div
              style={
                peers.length > 1
                  ? row1
                  : peers.length === 1
                  ? { width: "50%" }
                  : {}
              }
              className={`${peers.length + 1 <= 1 ? "full" : "row1"} ${fullscreen?"fullscreen":""}`}
            >
              <video muted autoPlay ref={userVideo} />
              <div className="threedot">
                <BiPin data-tip="Pin Screen" data-for="pinScreen" onClick={()=>setFullScreen(!fullscreen)} className={`option ${fullscreen?'pincolor':''}`}/>
                <ReactTooltip id="pinScreen" effect="solid" place="top" >
                  {fullscreen?'Unpin Screen':"Pin Screen"}
                  </ReactTooltip>

              </div>
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
            <>
            <IoIosMic
            data-tip="Off Mic"
            data-for="offMic"
            
              onClick={() => {
                audioStream();
              }}
              className="mic open"
            />
            <ReactTooltip  id="offMic" place="top" effect="solid">
              Off Mic
            </ReactTooltip>
            </>
          ) : (
            <>
            <IoIosMicOff
              data-tip="On Mic"
              data-for="onMic"
              onClick={() => {
                audioStream();
              }}
              className="mic closed"
            />
            <ReactTooltip  id="onMic" place="top" effect="solid" >
                On Mic
            </ReactTooltip>
            </>
          )}
        </div>
        <div>
          {isVideoOpen ? (
            <>
            <FaVideo
              data-tip="off video"
              data-for="offVideo"
              onClick={() => {
                videoStream();
              }}
              className="video open"
            />
            <ReactTooltip id="offVideo" place="top" effect="solid">
              Off Video
            </ReactTooltip>
            </>
          ) : (
            <>
            <FaVideoSlash
            data-tip="On Video"
            data-for="onVideo"
              onClick={() => {
                videoStream();
              }}
              className="video closed"
            />
            <ReactTooltip id="onVideo" place="top" effect="solid">
              On Video
            </ReactTooltip>
            </>
          )}
        </div>
        <div>
          {shareScreen ? (
            <>
            <FaWindowClose
            data-tip="share Screen"
            data-for="stopSharing"
              onClick={() => {
                setShareScreen(!shareScreen);
                shareUserScreen(false);

              }}
              className="shareScreen shareScreenclosed"
            />
            <ReactTooltip id="stopSharing" place="top" effect="solid">
              Stop Sharing

            </ReactTooltip>
            </>
          ) : (
            <>
            <MdScreenShare
            data-tip="Share Screen"
            data-for="shareScreen"
              onClick={() => {
                shareUserScreen(true);
              }}
              className="shareScreen open"
            />
            <ReactTooltip id="shareScreen" effect="solid" place="top">
              Share Screen
            </ReactTooltip>
            </>
          )}
        </div>
        <div>
          
          <MdCallEnd onClick={()=>{disconnect()}} data-tip="End Call" data-for="endCall" className="end" />
          <ReactTooltip id="endCall" effect="solid" place="top">End Call </ReactTooltip>
        </div>
        
      </div>
      <div className="setting">
          <div style={{zIndex:"10"}} >

          <FiUsers data-tip="Show Participants" data-for="showParticipants" className="showParticipants"/>
          <ReactTooltip id="showParticipants" effect="solid" place="top">
            Show Participants
          </ReactTooltip>

          </div>
          <div style={{zIndex:"10"}} >
            
          <BsFillChatDotsFill data-for="openChat" data-tip="Open Chat" onClick={()=>setChat(!chat)} className="chatFeature"/>
          <ReactTooltip id="openChat" effect="solid" place="top">
            Open Chat
          </ReactTooltip>
          </div>
        

      </div>

      </div>
      }
     
      
    </div>
  );
};
export default Room;
