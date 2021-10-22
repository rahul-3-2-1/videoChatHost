import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";

import { useHistory } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";

import { Button, Snackbar } from "@material-ui/core";
import { Alert } from "@mui/material";
import { ImCross } from "react-icons/im";

import Signup from "./Signup";
import Login from "./Login";
import "../Css/navbar.css";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const history = useHistory();
  const [logOut, setLogout] = useState(false);
  const [dialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const { signUp, currentUser, verifyEmail, signOutUser, DisplaySnackbar } =
    useAuth();
  const [signedUser, setSignedUser] = useState(false);
  const [snackBar, setSnackbar] = useState(false);
  const [signUpError, setSignUpError] = useState({
    name: false,
    email: false,
    password: false,
    Cpassword: false,
  });
  console.log(JSON.stringify(currentUser));
  const [errorMssg, setErrorMssg] = useState({
    name: "",
    email: "",
    password: "",
    Cpassword: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    Cpassword: "",
  });
  const action = (
    <React.Fragment>
      <div>
        <ImCross
          style={{ cursor: "pointer", color: "tomato", marginTop: "50%" }}
          onClick={() => setSnackbar(false)}
        />
      </div>
    </React.Fragment>
  );
  useEffect(() => {
    if (currentUser && !currentUser.emailVerified) {
      setSignedUser(true);
    } else if (currentUser && currentUser.emailVerified) {
      setLogout(true);
    } else {
      setSignedUser(false);
    }
  }, [currentUser]);

  const blurEvent = (event) => {
    const { name, value } = event.target;
    if (value === "") {
      setErrorMssg({ ...setErrorMssg, [name]: "This is a required field" });
      setSignUpError({ ...signUpError, [name]: true });
    } else if (name === "email") {
      if (!validator.isEmail(value)) {
        setErrorMssg({ ...setErrorMssg, [name]: "Invalid Email" });
        setSignUpError({ ...signUpError, [name]: true });
      } else {
        setSignUpError({ ...signUpError, [name]: false });
      }
    } else {
      if (name !== "name") setSignUpError({ ...signUpError, [name]: false });
    }
  };
  function handleOnChange(e) {
    const name = e.target.name;
    const val = e.target.value;
    setFormData({ ...formData, [name]: val });

    if (name === "password") {
      if (val.length < 8) {
        setSignUpError({ ...signUpError, [name]: true });
        setErrorMssg({
          ...errorMssg,
          [name]: "Password must be >= 8 characters",
        });
      } else {
        setSignUpError({ ...signUpError, [name]: false });
      }
    } else if (name === "name") {
      if (val.length < 3) {
        setSignUpError({ ...signUpError, [name]: true });
        setErrorMssg({ ...errorMssg, [name]: "Name should >=3 characters " });
      } else {
        setSignUpError({ ...signUpError, [name]: false });
      }
    } else {
      setSignUpError({ ...signUpError, [name]: false });
    }
  }

  const RegisterNow = async () => {
    if (
      signUpError.email ||
      signUpError.password ||
      signUpError.Cpassword ||
      signUpError.name
    ) {
      return;
    }
    if (formData.password !== formData.Cpassword) {
      setSignUpError({ ...signUpError, Cpassword: true });
      setErrorMssg({ ...errorMssg, Cpassword: "Passwords are not matching" });
      return;
    }
    try {
      setLoading(true);
      signUp(formData.email, formData.password, formData.name);
      console.log("rahul");
    } catch (err) {
      alert("Failed to create an account");
    }
    setLoading(false);
  };
  const dialogTrack = (cond) => {
    if (currentUser && signedUser) {
      setSnackbar(true);

      verifyEmail();
    } else {
      setIsDialogOpen(true);
      setIsLogin(cond);
    }
  };

  const openLogInForm = () => {
    setFormData({ email: "", password: "", Cpassword: "" });
    setErrorMssg({ email: "", password: "", Cpassword: "" });
    setSignUpError({ email: false, password: false, Cpassword: false });
    setIsLogin(true);
  };

  const hostmetting = () => {
    if (!currentUser || !currentUser.emailVerified) {
      if (!currentUser)
        DisplaySnackbar(
          "Sign In first before to create or join meeting",
          "error"
        );
      else {
        DisplaySnackbar("Verify your Email first ", "error");
      }
    } else {
      const id = uuidv4();
      history.push(`/room/${id}`);
    }
  };
  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="inner-div">
          <div onClick={() => hostmetting()}>Host a meeting</div>
          <div>Join meeting</div>
        </div>
        <div className="inner-div">
          {logOut ? (
            <div>
              <Button
                onClick={() => {
                  signOutUser();
                  setLogout(false);
                }}
                className="tomato"
                size="small"
                variant="contained"
              >
                Log Out
              </Button>
            </div>
          ) : (
            <>
              <div
                onClick={() => {
                  dialogTrack(false);
                }}
              >
                Register
              </div>
              <div
                onClick={() => {
                  dialogTrack(true);
                }}
              >
                SignIn
              </div>
            </>
          )}
        </div>
        {!signedUser && (
          <Dialog
            className="dialog"
            onClose={() => {
              setIsDialogOpen(false);
              setSignUpError({email:false,password:false,Cpassword:false});
              setFormData({email:"",password:"",Cpassword:""});

            }}
            open={dialogOpen}
          >
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
        )}
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackBar}
        autoHideDuration={6000}
        severity="sucess"
        onClose={() => setSnackbar(false)}
      >
        <Alert action={action} severity="info" sx={{ width: "100%" }}>
          {`we have sent a link to your ${
            currentUser && currentUser.email
          } click that to verify your email`}
        </Alert>
      </Snackbar>
    </div>
  );
};
export default Navbar;
