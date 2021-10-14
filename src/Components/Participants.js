import React,{useRef,useEffect} from 'react';
import { ImCross } from 'react-icons/im';
import Avatar from '@mui/material/Avatar';


export default function Participants(props) {
  const messagesEndRef=useRef(null);
  useEffect(()=>{
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  },[props.usersInfo])
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
    return (
        <div className="chatContainer" style={{zIndex:"10"}} >
          <div className="chating">
          <div className="scroolbar" style={{marginTop:"30px"}}>
             
                 <div className="individual">
                    <div className="avatar">
                        <Avatar sx={stringAvatar(props.currentUser)}>
                          {props.currentUser.match(/\b(\w)/g).join('')}
                          </Avatar>
                        </div>
                     <div>{props.currentUser }</div>
                       <span style={{color:"GrayText" ,marginLeft:"3px"}}>(you)</span>
                     
                      
                </div>
                     {
                 props.usersInfo.map(item=>{
                     return(
                         <div className="individual">
                             <div className="avatar">
                             <Avatar sx={stringAvatar(item[1])}>
                          {item[1].match(/\b(\w)/g).join('')}
                          </Avatar>
                            </div>
                             {item[1]  }<span style={{color:"violet",marginLeft:"3px"}}>{item[2]?"(Host)":"" }</span>
                        </div>

                     )
                 })
                }
             </div>
             <div ref={messagesEndRef}>

             </div>
          </div>
          <div className="cancel">
            <ImCross onClick={()=>props.setShowParticipants(false)}/>
            </div>
        </div>
    )
}
