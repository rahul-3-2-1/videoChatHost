import React,{useEffect} from "react";
import { IoIosMic, IoIosMicOff } from "react-icons/io";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import Button from '@material-ui/core/button';
import AvatarProfile from './AvatarProfile';
import ReactTooltip from "react-tooltip";
const Middleware = (props) => {
  const {
    userVideo,
    setJoin,
    isVideoOpen,
    ismicOpen,
    audioStream,
    videoStream,
    displayName,
    
  } = props;



  return (
    <div className="middleware">
      
      <div className="innerDiv">
        <div className="videomiddleware">
            <div className={`videoDiv ${!isVideoOpen?'border':""}`}>
              {isVideoOpen?
          <video ref={userVideo} autoPlay muted />:<AvatarProfile displayName={displayName}/>
              }
          </div>
          <div className="videoAndmic">
            <div>
              {ismicOpen ? (
                <IoIosMic
                  data-tip="Off Mic"
                  data-for="offMic"
                  onClick={() => {
                    audioStream();
                  }}
                  className="open mic"
                />
              ) : (
                <IoIosMicOff
                  data-tip="On Mic"
                  data-for="onMic"
                  onClick={() => {
                    audioStream();
                  }}
                  className="closed mic"
                />
              )}
              <ReactTooltip id="onMic" place="top" effect="solid">
                On Mic
              </ReactTooltip>
              <ReactTooltip id="offMic" place="top" effect="solid">
                Off Mic
              </ReactTooltip>
            </div>
            <div>
              {isVideoOpen ? (
                <FaVideo
                  onClick={() => {
                    videoStream();
                  }}
                  data-tip="off video"
                  data-for="offVideo"
                  className="open video"
                />
              ) : (
                <FaVideoSlash
                data-tip="On Video"
                data-for="onVideo"
                  onClick={() => {
                    videoStream();
                  }}
                  className="closed video"
                />
              )}
              <ReactTooltip id="onVideo" place="top" effect="solid">
              On Video
            </ReactTooltip>
            <ReactTooltip id="offVideo" place="top" effect="solid">
              Off Video
            </ReactTooltip>
            </div>
          </div>
        </div>
        <div className="joinNow">
            <Button onClick={()=>setJoin(true)} variant="contained" color="primary" >
                Join Now

            </Button>
        </div>
    </div>
      
    </div>
  );
};

export default Middleware;
