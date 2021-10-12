
import React from 'react';
import { TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";


export default function Signup(props) {
   
    const {formData,errorMssg,signUpError,handleOnChange,blurEvent,loading,RegisterNow,openLogInForm}=props;
    
   
   
      
    return (
        
        
        <div className="signupForm">
          
                
                <h2>Sign Up</h2>
                
                  <div className="content">
                    <label htmlFor="name">Your Name</label>
                  <TextField
                    required={true}
                    name="name"
                    error={signUpError.name}
                    value={formData.name}
                    onChange={(e) => {
                      handleOnChange(e);
                    }}
                    onBlur={blurEvent}
                    className="textField"
                    id="name"
                    size="small"
                  
                    variant="outlined"
                    helperText={signUpError.name?errorMssg.name:""}
                    placeholder="Enter your Full Name"
                    
                    
                  />
                  </div>
                  <div className="content">
                  <label htmlFor="Email">Email</label>
                  <TextField
                    required={true}
                    name="email"
                    error={signUpError.email}
                    value={formData.email}
                    onChange={(e) => {
                      handleOnChange(e);
                    }}
                    onBlur={blurEvent}
                    className="textField"
                    id="Email"
                    size="small"
                  
                    variant="outlined"
                    helperText={signUpError.email?errorMssg.email:""}
                    placeholder="Enter your Email"
                    
                    
                  />
                </div>
                <div className="content">
                  <label for="Password">Password</label>
                  <TextField
                    required={true}
                    type="password"
                    name="password"
                    error={signUpError.password}
                    value={formData.password}
                    onChange={(e) => {
                      handleOnChange(e);
                    }}
                    onBlur={blurEvent}
                    className="textField"
                    id="Password"
                    helperText={signUpError.password?errorMssg.password:""}
                    size="small"
                    variant="outlined"
                    placeholder="Enter your Password"
                  />
                </div>
                <div className="content">
                  <label for="CPassword">Confirm Password</label>
                  <TextField
                    required={true}
                    type="password"
                    onBlur={blurEvent}
                    name="Cpassword"
                    error={signUpError.Cpassword}
                    value={formData.Cpassword}
                    onChange={(e) => {
                      handleOnChange(e);
                    }}
                    className="textField"
                    id="CPassword"
                    size="small"
                    helperText={signUpError.Cpassword?errorMssg.Cpassword:""}
                    variant="outlined"
                    placeholder="Confirm your Password"
                  />
                </div>
                <div className="btn" >
                <Button disabled={loading} size="medium"   variant="contained" color="primary" onClick={()=>{RegisterNow()}}>Register</Button>
                <p className="signinLink" onClick={()=>{openLogInForm()}}>Already have a account? Click here</p>
                </div>
                </div>
                
        
            )
            
            
    
  }
