import React, { useEffect, useRef} from "react";
import {BsThreeDotsVertical} from 'react-icons/bs';


const RenderVideo=(props)=>{
    const webcamRef=useRef(null);
    
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
        <div style={props.totalUser===2?{width:"50%",borderRadius:"1.3rem"}:props.id<props.len?props.row1:props.row2} className={(props.totalUser===3&&props.id===1)?"imp ":props.id<props.len?"row1":"row2"}>
            {
                (
                    <>
                    <video
                    id="webcam"
                    autoPlay
                    ref={webcamRef}
                    muted
                    />
                    <div className="threedot">
                        <BsThreeDotsVertical/>
                    </div>
                    </>
                    
                )
            }
           
        </div>
    )
}
export default RenderVideo;