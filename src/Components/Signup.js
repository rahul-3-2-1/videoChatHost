
import React,{useEffect,useState} from 'react';
import { TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { Snackbar } from '@material-ui/core';
import {ImCross} from 'react-icons/im';

import { sendEmailVerification } from '@firebase/auth';
import Alert from '@mui/material/Alert';


export default function Signup(props) {
    const [signedUser,setSignedUser]=useState(false);
    const [snackBar,setSnackbar]=useState(false);
    const {formData,errorMssg,signUpError,handleOnChange,blurEvent,loading,RegisterNow,openLogInForm,currentUser}=props;
    
    useEffect(()=>{
        if(currentUser&&!currentUser.emailVerified)
        {
            setSignedUser(true);
            setSnackbar(true);
            setSignedUser(true);
            sendEmailVerification(currentUser.user,{url:"https://youtube.com"}).then(()=>{
                alert("Email verifiaction comnpleted");
            }).catch(err=>{
                console.log(err);
            })

            
        }
        

    },[currentUser])
    const action = (
        <React.Fragment>
         
         <div>
            <ImCross style={{cursor:"pointer",color:"tomato",marginTop:"50%"}} onClick={()=>setSnackbar(false)} />
            </div>
        
        </React.Fragment>
      );
    return (
        <>
        
        <div className="signupForm">
            {!signedUser&&(
                <>
                <h2>Sign Up</h2>
                <div className="content">
                  <label for="Email">Email</label>
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
                </>
        
            )
            
            }
            <Snackbar
            anchorOrigin={{vertical:"top",horizontal:'center'}}
            open={snackBar}
            autoHideDuration={6000}
            severity="sucess"
            
            onClose={()=>setSnackbar(false)}
            
            
            
            >
                 <Alert action={action}  severity="info" sx={{ width: '100%' }}>
                 {`we have sent a link to your ${currentUser.email} email click that to verify your email`}
            </Alert>
                </Snackbar>

             </div>
      </>
    )
}
