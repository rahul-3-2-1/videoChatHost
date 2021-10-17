import React from 'react';
import { TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { useAuth } from '../contexts/AuthContext';

export default function Login(props) {
    const {formData,setFormData,setSignUpError,setErrorMssg,errorMssg,signUpError,setIsLogin}=props;
    const {currentUser,signIn}=useAuth();
    const handleOnChange=(e)=>{
        const {name,value}=e.target;
        setFormData({...formData,[name]:value});
        

    }
    const signInUser=async ()=>{

        try{
        await signIn(formData.email,formData.password)
        }
        catch(err){
            alert("failed to login User");
        }


    }
    console.log(currentUser);
    const openSignupform=()=>{
        setSignUpError({...signUpError,"email":false,"password":false});
        setErrorMssg({...errorMssg,"email":"","password":""});
        setFormData({...formData,"email":"","password":""});
        setIsLogin(false);
        
    }
    const blurEvent=(e)=>{
        const {name,value}=e.target;
        if(value==="")
        {
            setSignUpError({...setSignUpError,[name]:true});
            setErrorMssg({...errorMssg,[name]:"This is a required field"});
        }
        else{
            setSignUpError({...setSignUpError,[name]:false});
        }
    }
    return (
        <div className="signupForm">
            <h2>Log In</h2>
            <div className="content">
            <label htmlFor="eamil">Email</label>
            <TextField variant="outlined" onBlur={blurEvent} size="small" id="email" error={signUpError.email} name="email" helperText={signUpError.email?errorMssg.email:""} onChange={handleOnChange} placeholder="Enter your email" />

            </div>
            
            <div className="content">
            <label htmlFor="password">Password</label>
            <TextField size="small" onBlur={blurEvent} variant="outlined" id="password" error={signUpError.password}  helperText={signUpError.password?errorMssg.password:""} name="password" type="password" onChange={handleOnChange} placeholder="Enter your Password" />
            </div>
            <div className="btn">
                <Button onClick={()=>signInUser()} size="medium" variant="contained" color="primary" >
                    SignIn
                </Button>
                <p onClick={()=>openSignupform()} className="signinLink">havent Registered yet? Click here</p>

            </div>
            
            
        </div>
    )
}
