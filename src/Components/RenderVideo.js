import React, { useEffect, useRef, useState} from "react";


const RenderVideo=(props)=>{
    const webcamRef=useRef(null);
    // let [loaded,setLoadedStatus]=useState(false);
   
    // const getMedia=async ()=>{
    //     try{
    //         console.log(webcamRef.current);
    //         props.peer.on('stream',stream=>{
    //             webcamRef.current.srcObject=stream;
    //             // webcamRef.current.play();

    //         })
    //     }
    //     catch(err){
    //         console.log(err);
    //     }
    // }
    // useEffect(()=>{
    //     const loadItems=async ()=>{
    //         console.log("preprocessing here");
    //     }
    //     loadItems().then(()=>{
    //         setLoadedStatus(true);
    //     })
    // },[]);
    // useEffect(()=>{
    //     if(!loaded) return;
    //     getMedia();
    // },[loaded]);
    useEffect(()=>{
       
        if(!webcamRef.current)
        return;
        console.log(webcamRef.current);
        let vid=webcamRef.current;
        console.log(vid);
        props.peer.on('stream',stream=>{
            console.log(stream);
           
            console.log(vid)
            vid=webcamRef.current;
            
            vid.srcObject=stream;
        })
        
       
    },[webcamRef])

    
    return(
        <div style={props.totalUser===2?{width:"50%",borderRadius:"1.3rem"}:props.id<props.len?props.row1:props.row2} className={(props.totalUser===3&&props.id===1)?"imp":props.id<props.len?"row1":"row2"}>
            {
                (
                    <video
                    id="webcam"
                    autoPlay
                    ref={webcamRef}
                    muted
                    />
                )
            }
           
        </div>
    )
}
export default RenderVideo;