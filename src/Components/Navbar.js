import React, { useState,useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";

import { useHistory } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";

import Signup from "./Signup";
import Login from './Login';
import "../Css/navbar.css";
import { useAuth } from "../contexts/AuthContext";


const Navbar = () => {
  const history = useHistory();
  const [dialogOpen, setIsDialogOpen] = useState(false);
  const [loading,setLoading]=useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const {signUp,currentUser}=useAuth();
  const [signUpError, setSignUpError] = useState({
    email: false,
    password: false,
    Cpassword: false,
  });
  console.log(JSON.stringify(currentUser));
  const [errorMssg,setErrorMssg]=useState({
    email:"",
    password:"",
    Cpassword:""
  })
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    Cpassword: "",
  });
  useEffect(()=>{
    if(currentUser)
    {
      console.log(currentUser);
    }
  },[currentUser])
  const blurEvent=(event)=>{
    const {name,value}=event.target;
    if(value==="")
    {
      setErrorMssg({...setErrorMssg,[name]:"This is a required field"});
      setSignUpError({...signUpError,[name]:true});
    }
    else if(name==='email')
    {
      if(!validator.isEmail(value))
      {
        setErrorMssg({...setErrorMssg,[name]:"Invalid Email"});
        setSignUpError({...signUpError,[name]:true});
      }
      else{
        setSignUpError({...signUpError,[name]:false});
      }
    }
    else{
      setSignUpError({...signUpError,[name]:false});
    }
  }
  function handleOnChange(e) {
    
    const name = e.target.name;
    const val = e.target.value;
    setFormData({ ...formData, [name]: val });
   
    if (name === "password") {
      if (val.length < 8) {
        setSignUpError({ ...signUpError, [name]: true });
        setErrorMssg({...errorMssg,[name]:"Password must be >= 8 characters"})
      } else {
        setSignUpError({ ...signUpError, [name]: false });
      }
    }
    else{
      setSignUpError({ ...signUpError, [name]: false });
    }
    
  }

  const RegisterNow=async ()=>{
    if(signUpError.email||signUpError.password||signUpError.Cpassword)
    {
      return;
    }
    if(formData.password!==formData.Cpassword)
    {
      setSignUpError({...signUpError,"Cpassword":true});
      setErrorMssg({...errorMssg,"Cpassword":"Passwords are not matching"});
      return;
    }
    try{
      setLoading(true);
    signUp(formData.email,formData.password);
    console.log("rahul");

    }
    catch(err){
      alert("Failed to create an account");
    }
    setLoading(false);

  }
  const openLogInForm=()=>{
    setFormData({email:"",password:"",Cpassword:""});
    setErrorMssg({email:"",password:"",Cpassword:""});
    setSignUpError({email:false,password:false,Cpassword:false});
    setIsLogin(true);
  }
 
  const hostmetting = () => {
    const id = uuidv4();
    history.push(`/room/${id}`);
  };
  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="inner-div">
          <div onClick={() => hostmetting()}>Host a meeting</div>
          <div>Join meeting</div>
        </div>
        <div className="inner-div">
          <div
            onClick={() => {
              setIsDialogOpen(true);
              setIsLogin(false);
            }}
          >
            Register
          </div>
          <div
            onClick={() => {
              setIsDialogOpen(true);
              setIsLogin(true);
            }}
          >
            SignIn
          </div>
        </div>
        <Dialog className="dialog" onClose={()=>{setIsDialogOpen(false)}} open={dialogOpen}>
          {!isLogin ? (
            <Signup
            formData={formData}
            
            errorMssg={errorMssg}
            loading={loading}
           currentUser={currentUser}
            
            signUpError={signUpError}
            RegisterNow={RegisterNow}
            blurEvent={blurEvent}
            openLogInForm={openLogInForm}
            handleOnChange={handleOnChange}
            />
           
          ) : (
            <div className="Login">
              <Login
              formData={formData}
              setErrorMssg={setErrorMssg}
              setSignUpError={setSignUpError}
              setFormData={setFormData}
              errorMssg={errorMssg}
              signUpError={signUpError}
              setIsLogin={setIsLogin}
              openLogInForm={openLogInForm}
              handleOnChange={handleOnChange}

              
              />

            </div>
          )}
        </Dialog>
      </div>
    </div>
  );
};
export default Navbar;
