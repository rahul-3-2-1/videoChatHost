import React, { useEffect,useState, useRef} from "react";
// import {BsThreeDotsVertical} from 'react-icons/bs';
import {BiPin} from 'react-icons/bi';

import ReactTooltip from "react-tooltip";
import AvatarProfile from "./AvatarProfile";


const RenderVideo=(props)=>{
    const webcamRef=useRef(null);
    
    
    const stream=useRef();
    const [check,setCheck]=useState(true);
    const {enable}=props;


    
    const [fullScreen,setFullScreen]=useState(false);
    const {userInfo}=props;
    console.log(userInfo);
    
    useEffect(()=>{
       console.log("rahul");
        
        console.log(webcamRef.current);
        
        console.log(props.peer);
        props.peer.ontrack=function (event){
           
           
           stream.current=event.streams[0];
           setCheck(!check);
        }
        
       
    },[webcamRef,props.peer])
    useEffect(()=>{
        if(enable){
            webcamRef.current.srcObject=stream.current;
        }
       
    },[enable,check]);
    
    console.log(enable);
    
    
    return(
        <div style={props.totalUser===2?{width:"50%"}:props.id<props.len?props.row1:props.row2} className={`${(props.totalUser===3&&props.id===1)?"imp ":props.id<props.len?"row1":"row2"} ${(fullScreen&&enable)?"fullscreen":""} ${!enable?'border':""}`}>
            {
                (
                    <>
                    {!enable?<AvatarProfile fullScreen={fullScreen} displayName={userInfo[1]}/>: <video
                    id="webcam"
                    autoPlay
                    ref={webcamRef}
                    muted
                    />}
                   
                   
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