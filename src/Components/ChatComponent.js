import React,{useState} from 'react';

// import {IoSend} from 'react-icons/io';
import {RiSendPlane2Fill} from 'react-icons/ri';
import {ImCross} from 'react-icons/im';
import  '../Css/chatContainer.css';



function ChatComponent(props) {
    const [mssg,setMssg]=useState("");
   
    const {socketRef,roomId,allMssg,setAllMssg}=props;
    
    const keyPress=(e)=>{
        if(e.charCode===13)
        {
            sendMssg();
        }
    }
    const sendMssg=()=>{
        console.log(mssg);
       
        setAllMssg((allMssg)=>[...allMssg,{mssg,id:1}])
        
        socketRef.current.emit('sendMssg',{mssg:mssg,roomId:roomId});
        setMssg("");

    }
   
    console.log(allMssg);
    
    return (
        <div className="chatContainer" >
          <div className="chating">
              <div style={{marginTop:"30px"}}>
              {
                  allMssg.map(item=>{
                      return(
                          <p className={`${item.id?"self":"other"}`}>{item.mssg}</p>
                      )
                  })
              }
              </div>
              
              <div className="input-tag">
              <div className="input">
                 
                  <input type="text" onKeyPress={keyPress} onChange={(e)=>setMssg(e.target.value)} value={mssg}  placeholder="Enter your text"/>
                  <div className="send">
                     
                   <RiSendPlane2Fill onClick={()=>sendMssg()}  className="sendIcon" />
                  
                  </div>
                  
                  
              </div>
              </div>
          </div>
          <div className="cancel">
            <ImCross onClick={()=>props.setChat(false)}/>
            </div>
        </div>
    )
}

export default ChatComponent
