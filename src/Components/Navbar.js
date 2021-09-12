import React from 'react';
import {v4 as uuidv4} from 'uuid';

import {useHistory} from 'react-router-dom';
import '../Css/navbar.css';

const Navbar=()=>{
    const history=useHistory();
    
    const hostmetting=()=>{
        const id=uuidv4();
        history.push(`/room/${id}`)
        


    }
return(
<div className="navbar">
    <div className="navbar-container">
        <div className="inner-div">
        <div>Home</div>
        <div onClick={()=>hostmetting()}>Host a meeting</div>
        <div>Join meeting</div>
        </div>
        <div className="inner-div">
        <div>Register</div>
        <div>SignIn</div>
        </div>
    </div>


</div>
)

}
export default Navbar;