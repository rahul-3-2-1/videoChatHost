import React, { useEffect,useState, useRef} from "react";
// import {BsThreeDotsVertical} from 'react-icons/bs';
import {BiPin} from 'react-icons/bi';
import ReactTooltip from "react-tooltip";


const RenderVideo=(props)=>{
    const webcamRef=useRef(null);
    const [fullScreen,setFullScreen]=useState(false);
    
    useEffect(()=>{
       
        if(!webcamRef.current)
        return;
        console.log(webcamRef.current);
        let vid=webcamRef.current;
        console.log(vid);
        props.peer.ontrack=function (event){
            console.log(event.streams);
            webcamRef.current.srcObject=event.streams[0];
        }
        
       
    },[webcamRef,props.peer])

    
    return(
        <div style={props.totalUser===2?{width:"50%"}:props.id<props.len?props.row1:props.row2} className={`${(props.totalUser===3&&props.id===1)?"imp ":props.id<props.len?"row1":"row2"} ${fullScreen?"fullscreen":""}`}>
            {
                (
                    <>
                    <video
                    id="webcam"
                    autoPlay
                    ref={webcamRef}
                    muted
                    />
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