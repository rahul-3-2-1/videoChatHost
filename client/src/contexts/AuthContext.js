import React,{useContext,useEffect,useState} from 'react'
import {auth} from '../firebase';
// import {  } from '@firebase/auth';
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,sendEmailVerification,signOut,updateProfile } from '@firebase/auth';
import {ImCross} from 'react-icons/im';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@mui/material';

const AuthContext=React.createContext();


export function useAuth(){
    return useContext(AuthContext);
}
export  function AuthProvider({children}) {
    const [currentUser,setcurrentUser]=useState();
    const [snackBar,setSnackBar]=useState(false);
    const [loading,setLoading]=useState(true);
    const [severity,setSevesity]=useState("");
    const [message,setMessage]=useState("");
    const action = (
        <React.Fragment>
         
         <div>
            <ImCross style={{cursor:"pointer",color:"tomato",marginTop:"50%"}} onClick={()=>setSnackBar(false)} />
            </div>
        
        </React.Fragment>
      );

    function verifyEmail(){
        return sendEmailVerification(currentUser.user,{url:"https://videoconferenceapplication.herokuapp.com/"}).then(()=>{
            alert("Email verifiaction comnpleted");
        }).catch(err=>{
            console.log(err);
        })
        
    }
    function signUp(email,password,name)
    {
       
        return createUserWithEmailAndPassword(auth,email,password).then(user=>{
            setcurrentUser(user);
            sendEmailVerification(user.user,{url:"https://videoconferenceapplication.herokuapp.com/"}).then(()=>{
                setSnackBar(true);
                setSevesity("info");
                console.log(user);
                setMessage(`we have send a link to ${user.user.email} click that to verify your email`);
            }).catch(err=>{
              console.log(err);
            })
            updateProfile(user.user,{displayName:name});
            
            
        }).catch(err=>{
            setSnackBar(true);
           setSevesity("error");
           setMessage("Email already exist");
        });

    }
    function signIn(email,password){
        return signInWithEmailAndPassword(auth,email,password).then((user)=>{
            setcurrentUser(user);
            setSnackBar(true);
            setSevesity("success");
            setMessage("Sign In successfull");


        }).catch((err)=>{
            setSnackBar(true);
            setSevesity("error");
            setMessage("Email or Password is wrong");
        });
    }
    function DisplaySnackbar(mssg,type){
        setMessage(mssg);
        setSevesity(type)
        setSnackBar(true);



    }
    function signOutUser(){
        return signOut(auth).then(()=>{
            setcurrentUser("");
            setSnackBar(true);
            setSevesity("success");
            setMessage("Sign Out successfully");

        }).catch((err)=>{
            console.log(err);
            alert("err occured");
        })

    }
    useEffect(()=>{
        const unsubscribe=auth.onAuthStateChanged(user=>{
            setcurrentUser(user);
            setLoading(false);
        })
        console.log(auth.currentUser)

    
        return unsubscribe;
    },[])
    
    const value={
        currentUser,
        signUp,
        signIn,
        verifyEmail,
        signOutUser,
        DisplaySnackbar
        
    }
    
    return (
        <AuthContext.Provider value={value}>
            <>
            {!loading&&children}
            <Snackbar  
            anchorOrigin={{vertical:"top",horizontal:'center'}}
            open={snackBar}
            autoHideDuration={6000}
            severity={severity}
            
            onClose={()=>setSnackBar(false)}>
                 <Alert action={action}  severity={severity} sx={{ width: '100%' }}>
                 {message}
            </Alert>

                </Snackbar>
            </>
            
        </AuthContext.Provider>
    )
}
