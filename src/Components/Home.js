import React from "react";
import "../Css/home.css";
import{ BsFillCameraVideoFill} from 'react-icons/bs';

import {BsFillChatDotsFill} from 'react-icons/bs';

import {MdScreenShare} from 'react-icons/md';
import Footer from './Footer';

export default function Home() {
  return (
      <>
      <div className="homeContainer">
    <div className="home">
      <div className="bgcolor"></div>
      <div className="imgContainer">
        <img
          src="https://s35691.pcdn.co/wp-content/uploads/2020/07/breakout-rooms.jpg"
          alt="video conferencing application"
        />
      </div>
      <div className="heading">
        <h1 className="wtcolor">
          Connect  <span className="textRed">Anywhere </span> From Anywhere in
          the world
        </h1>
      </div>

    </div>
    
      <div className="featureContainer">
          
          <h1>Our Features</h1>
          
        <div className="featureDiv">
          <div className="featureSection">
            <div>
              <div className="iconDiv videoIcon"><BsFillCameraVideoFill /> </div>
              <h3>Audio and HD video calling </h3>
              <div className="text"> lorem kbdvb sdkvbsdvb skdjvbsdkjvbsdbv  sdkvjnsd vkjsd  kvjndsk  className="text"vsdk vlkd svdkjv</div>
            </div>
          </div>
          <div className="featureSection">
            <div>
              <div className="iconDiv chat"><BsFillChatDotsFill/></div>
              <h3> Smart messaging</h3>
              
              <div className="text">lorem kbdvb sdkvbsdvb skdjvbsdkjvbsdbv  sdkvjnsd vkjs className="text"d  kvjndsk vsdk vlkd svdkjv</div>
            </div>
          </div>
          <div className="featureSection">
            <div>
              <div className="iconDiv screen"><MdScreenShare/></div>
              <h3> Screen sharing</h3>
              <div className="text">lorem kbdvb sdkvbsdvb skdjvbsdkjvbsdbv  sdkvjnsd vkjsd className="text"  kvjndsk vsdk vlkd svdkjv</div>
            </div>
          </div>
        </div>
      </div>
      <div className="WhyChoose">
            
      </div>
    </div>
    <Footer/>
    </>
  );
}
