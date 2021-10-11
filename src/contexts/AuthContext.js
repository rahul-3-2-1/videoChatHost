import React,{useContext,useEffect,useState} from 'react'
import {auth} from '../firebase';
// import {  } from '@firebase/auth';
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,sendEmailVerification } from '@firebase/auth';

const AuthContext=React.createContext();


export function useAuth(){
    return useContext(AuthContext);
}
export  function AuthProvider({children}) {
    const [currentUser,setcurrentUser]=useState();
    const [loading,setLoading]=useState(true);
    function signUp(email,password)
    {
       
        return createUserWithEmailAndPassword(auth,email,password).then(user=>{
            setcurrentUser(user);
            sendEmailVerification(user.user,{url:"https://youtube.com"}).then(()=>{
                alert("Email verifiaction comnpleted");
            }).catch(err=>{
                console.log(err);
            })
            
            
        }).catch(err=>{
            alert("Failed to create an account");
        });

    }
    function signIn(email,password){
        return signInWithEmailAndPassword(auth,email,password);
    }
    useEffect(()=>{
        const unsubscribe=auth.onAuthStateChanged(user=>{
            setcurrentUser(user);
            setLoading(false);
        })
        return unsubscribe;
    },[])
    
    const value={
        currentUser,
        signUp,
        signIn
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading&&children}
        </AuthContext.Provider>
    )
}
