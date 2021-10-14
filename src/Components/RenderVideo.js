import React, { useEffect,useState, useRef} from "react";
// import {BsThreeDotsVertical} from 'react-icons/bs';
import {BiPin} from 'react-icons/bi';
import Avatar from '@mui/material/Avatar';
import ReactTooltip from "react-tooltip";


const RenderVideo=(props)=>{
    const webcamRef=useRef(null);
    const cameraCond=useRef();
    const [check,setCheck]=useState(true);
    const {enable}=props;


    function stringToColor(string) {
        let hash = 0;
        let i;
      
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.substr(-2);
        }
        /* eslint-enable no-bitwise */console.log(color);

      
        return color;
      }
    function stringAvatar(nameed) {
        const striing=nameed.toString();
    
    
        return    {  bgcolor: stringToColor(striing)}
    ;
      }

    const [fullScreen,setFullScreen]=useState(false);
    const {userInfo}=props;
    console.log(userInfo);
    
    useEffect(()=>{
       
        if(!webcamRef.current)
        return;
        console.log(webcamRef.current);
        
        console.log(props.peer);
        props.peer.ontrack=function (event){
           
            cameraCond.current=event.streams[0];
            webcamRef.current.srcObject=event.streams[0];
             setCheck(cameraCond.current.getVideoTracks()[0].enabled);
        }
        
       
    },[webcamRef,props.peer])
    useEffect(()=>{
        console.log(check);
    },[enable]);
    
    
    
    
    return(
        <div style={props.totalUser===2?{width:"50%"}:props.id<props.len?props.row1:props.row2} className={`${(props.totalUser===3&&props.id===1)?"imp ":props.id<props.len?"row1":"row2"} ${fullScreen?"fullscreen":""}`}>
            {
                (
                    <>
                    {(!enable||!check)?<div className="avatar">

                    </div>:}
                    <video
                    id="webcam"
                    autoPlay
                    ref={webcamRef}
                    muted
                    />
                    <div className="userName">
                        <p>{userInfo[1]}</p>

                    </div>
                    <div  className="threedot">
                        <BiPin data-tip="Pin Screen" data-for="PinScreen"  onClick={()=>setFullScreen(!fullScreen)} className={`option ${fullScreen?'pincolor':''}`}/>
                        <ReactTooltip id="PinScreen" effect="solid" place="top">
                            {fullScreen?'Unpin SCreen':'Pin Screen'}
                            </ReactTooltip>
                    </div>
                    </>
                    
                )
            }
           
        </div>
    )
}
export default RenderVideo;