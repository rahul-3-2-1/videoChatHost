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
import { useAuth } from "../contexts/AuthContext";
import Participants from "./Participants";
import "../Css/room.css";
import AvatarProfile from "./AvatarProfile";



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
  const localuserVideo=useRef();
  
const [usersVideo,setUsersVideo]=useState([]);
  const videoEnable=useRef([]);
  const [localVideo,setLocalvideo]=useState(true);
  const [row2, setRow2] = useState({});
  const [peers, setPeers] = useState([]);
  const [totalUser, setTotaluser] = useState(peers.length);
  const [ismicOpen, setIsMicopen] = useState(true);
  const [isVideoOpen, setIsVideoOpen] = useState(true);
  const [allMssg,setAllMssg]=useState([]);
  const [showParticipants,setShowParticipants]=useState(false);
  const usersId=useRef([]);
  
  const [ended,setEnded]=useState(false);
  
  const [chat,setChat]=useState(false);
  const [join,setJoin]=useState(false);
  
  const [shareScreen, setShareScreen] = useState(false);
  
  const [fullscreen,setFullScreen]=useState(false);
  const history=useHistory();
  const middlewareVideo=useRef();
  

  const socketRef = useRef();
  const userVideo = useRef();
  const PeersRef = useRef({});
  const PeersIdRef=useRef([]);
  const usersInformation=useRef([]);
  
  const senders = useRef([]);
  const host=useRef(false);

  const { id } = useParams();
  const {currentUser,DisplaySnackbar}=useAuth();
 
   

  const createConnection = () => {
   
    
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        
        middlewareVideo.current.srcObject=stream;
        localuserVideo.current=stream;
        setStream(stream);
      });
      
     
  
  };
  
  useEffect(() => {
    if(!currentUser||!currentUser.emailVerified)
    {
      if(!currentUser)
      DisplaySnackbar("Sign In first before to create or join meeting","error");
      else{
        DisplaySnackbar("Verify your Email first ");
      }
      history.push('/');
    }
    else{

        createConnection();
   
}
  

      
  
   
  }, []);
  
  useEffect(()=>{
    

    const roomId = id;
    


    if(join)
    {
      socketRef.current = io.connect("/");
      
      console.log(currentUser);
      
      const {email,displayName}=currentUser;

        
        console.log(email,"  ",displayName);
        socketRef.current.emit("join",{ roomId:roomId,email:email,userName:displayName});
        

        socketRef.current.on("allusers", async( {usersIdPeer,usersInfo} )=> {
          usersInformation.current=usersInfo;
             
          const peerss = [];
          
          

          usersIdPeer.forEach(async (userId) => {
           videoEnable.current.push(true);
            const peer = await createPeer(userId, true);
            PeersRef.current[userId] = peer;
            usersId.current.push(userId);
            PeersIdRef.current.push(peer);
            peerss.push(peer);
          });
          await setPeers(peerss);
          setUsersVideo(videoEnable.current);
          

        
         
         
          setTotaluser(peerss.length + 1);
        });
        socketRef.current.on('recievedMssg',({mssg,displayName,host,email})=>{
          setAllMssg((allMssg)=>[...allMssg,{mssg,id:0,displayName,host,email}]);
    
          
      })
        socketRef.current.on('webrtc_answer',(event)=>{
          
          const peer=PeersRef.current[event.userId];
          peer.setRemoteDescription(new RTCSessionDescription(event.sdp));
          let peersid=usersId.current;
          const id=peersid.indexOf(event.userId);
          videoEnable.current=videoEnable.current.map((item,i)=>i===id?event.isVideoEnable:item);
          setUsersVideo(videoEnable.current);

        })
        
        socketRef.current.on("host",(bool)=>{
          host.current=bool;
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
       
       const {email,displayName,host}=config;
      
      const peer=new RTCPeerConnection(ICE_config);
      PeersRef.current[config.userId]=peer;
      videoEnable.current.push(config.isVideoEnable);
      console.log(videoEnable.current);
      setUsersVideo([...videoEnable.current]);
      
        
       PeersIdRef.current.push(peer);
       usersInformation.current.push([email,displayName,host]);
      
       
      
      
       usersId.current.push(config.userId);
  
        setPeers([...PeersIdRef.current]);
        setTotaluser(1+PeersIdRef.current.length);
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
          videoEnable.current=[];
          usersId.current=[];
          usersInformation.current=[];
          setUsersVideo(videoEnable.current);

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
          videoEnable.current=videoEnable.current.filter((item,i)=>i!==id);
          
          setUsersVideo(videoEnable.current);
                    PeersIdRef.current=temop;
          setPeers(temop);
          
          
          peersid=peersid.filter((item)=>item!==config.userId)
          usersId.current=peersid;
          usersInformation.current=usersInformation.current.filter((item,i)=>i!==id);
          
        }

    
        
      })
      socketRef.current.on('videoChange',({userId,enable})=>{
        let peersid=usersId.current;
        const ids=peersid.indexOf(userId);
        videoEnable.current=videoEnable.current.map((item,id)=>id===ids?enable:item);
        setUsersVideo(videoEnable.current);
        
      })
      
        
       

    }

  },[join])



  
  function disconnect(){
    console.log("rahul");
    socketRef.current.emit('disconnectUser',{roomId:id,email:currentUser.email});
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
      userId:userId,
      isVideoEnable:stream.getVideoTracks()[0].enabled
      

    })
  } 
 
  const addTrack=(peer)=>{
   
    localuserVideo.current.getTracks().forEach((track) => senders.current.push(peer.addTrack(track, localuserVideo.current)));
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
      userId:userId,
      email:currentUser.email,
      displayName:currentUser.displayName,
      isHost:host.current,
      isVideoEnable:stream.getVideoTracks()[0].enabled
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
    if(join){
    socketRef.current.emit("videoChange",{roomId:id,enable:mediaTracks[0].enabled});
    }
    setLocalvideo(mediaTracks[0].enabled);
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
  
  useEffect(()=>{
    if(isVideoOpen&&!join)
    {
      middlewareVideo.current.srcObject=stream;
    }
    else if(isVideoOpen&&join)
    {
      userVideo.current.srcObject=stream;
    }
   
    
   
  },[isVideoOpen,join])

 
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
      displayName={currentUser.displayName}
        stream={stream}

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
              className={`${peers.length + 1 <= 1 ? "full" : "row1"} ${fullscreen?"fullscreen":""} ${!isVideoOpen?'border':""}`}
            >
              {!isVideoOpen?<AvatarProfile displayName={currentUser.displayName} />:<video muted autoPlay ref={userVideo} />}
              <div className="threedot">
                <BiPin data-tip="Pin Screen" data-for="pinScreen" onClick={()=>setFullScreen(!fullscreen)} className={`option ${fullscreen?'pincolor':''}`}/>
                <ReactTooltip id="pinScreen" effect="solid" place="top" >
                  {fullscreen?'Unpin Screen':"Pin Screen"}
                  </ReactTooltip>

              </div>
              <div className="userName">
                        <p>You</p>

                    </div>
            </div>

            {peers.map((item, id) => {
              return (
                <RenderVideo
                  userInfo={usersInformation.current[id]}
                  totalUser={peers.length + 1}
                  row1={row1}
                  row2={row2}
                  enable={usersVideo[id]}
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
            chat&&<ChatComponent  host={host.current} displayName={currentUser.displayName} email={currentUser.email} allMssg={allMssg} setAllMssg={setAllMssg} roomId={id} socketRef={socketRef} setChat={setChat} />
          }

        </div>
        <div className={`${showParticipants?'ParticipantsDiv':""}`}>
          {showParticipants&&<Participants setShowParticipants={setShowParticipants} usersInfo={usersInformation.current} currentUser={currentUser.displayName} />}
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

          <FiUsers  onClick={()=>{setShowParticipants(!showParticipants);setChat(false)}} data-tip="Show Participants" data-for="showParticipants" className="showParticipants"/>
          <ReactTooltip  id="showParticipants" effect="solid" place="top">
            Show Participants
          </ReactTooltip>

          </div>
          <div style={{zIndex:"10"}} >
            
          <BsFillChatDotsFill data-for="openChat" data-tip="Open Chat" onClick={()=>{setChat(!chat);setShowParticipants(false)}} className="chatFeature"/>
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
