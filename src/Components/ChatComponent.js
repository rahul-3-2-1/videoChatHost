import React,{useState,useRef,useEffect} from 'react';

// import {IoSend} from 'react-icons/io';
import {RiSendPlane2Fill} from 'react-icons/ri';
import {ImCross} from 'react-icons/im';
import  '../Css/chatContainer.css';




function ChatComponent(props) {
    const messagesEndRef=useRef(null);
    const {socketRef,roomId,allMssg,setAllMssg,displayName,email}=props;
    console.log(allMssg);
   
    const [mssg,setMssg]=useState("");
   
   useEffect(()=>{
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
   },[allMssg])
    
    const keyPress=(e)=>{
        if(e.charCode===13)
        {
            sendMssg();
        }
    }
    const sendMssg=()=>{
        
       
        setAllMssg((allMssg)=>[...allMssg,{mssg,id:1,displayName:displayName,host:false,email:email}])
        
        socketRef.current.emit('sendMssg',{mssg:mssg,roomId:roomId,displayName:displayName,host:props.host,email:email});
        setMssg("");

    }
   
   
    
    return (
        <div className="chatContainer" style={{zIndex:"10"}} >
          <div className="chating">
              <div className="scroolbar" style={{marginTop:"30px"}}>
              {
                  allMssg.map((item,id)=>{
                      return(
                          <p className={`${item.id?"self":"other"}`}>

                              <p className={`firstDiv ${item.id?"":"otherName"}`}>
                            
                                    <p>
                                    {id!==0&&allMssg[id-1].email===item.email?" ":item.displayName===displayName?"You":item.displayName}
                                 </p>
                              </p>
                              <p className="secondDiv">                              {item.mssg}
                              </p>

                        </p>
                      )
                  })
                 
              }
               <div ref={messagesEndRef} >
                </div>
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
