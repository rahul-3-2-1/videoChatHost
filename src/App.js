import {useHistory} from 'react-router-dom';
import './App.css';
import React,{useEffect,useRef} from 'react';
import {v4 as uuidv4} from 'uuid';



function App() {
  const history=useHistory();
  const video=useRef();
  useEffect(()=>{
    navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream)=>{
      video.current.srcObject=stream;
      
    })
  },[])
  return (
    <div className="App">
      <video style={{width:"500px" ,height:"500px"}} muted autoPlay ref={video}/>
     
    </div>
  );
}

export default App;
