import React, { useState } from "react";
import "./Auth.css";
import { logIn, signUp } from "../../actions/AuthActions.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const initialState = {
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirmpass: "",
  };
  const loading = useSelector((state) => state.authReducer.loading);
  

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(false);

  const [data, setData] = useState(initialState);

  const [confirmPass, setConfirmPass] = useState(true);

  // const dispatch = useDispatch()

  // Reset Form
  const resetForm = () => {
    setData(initialState);
    setConfirmPass(confirmPass);
  };

  // handle Change in input
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Form Submission
  const handleSubmit = async (e) => {
    setConfirmPass(true);
    e.preventDefault();
    if (isSignUp) {
      data.password === data.confirmpass
        ? dispatch(signUp(data, navigate))
        : setConfirmPass(false);
    } else {
      const loginSuccessful = await dispatch(logIn(data, navigate));
      if (!loginSuccessful) {
        setConfirmPass(false);
      }
    }
  };

  return (

    <div className="Auth">
   
    <h1 style={{fontFamily:"cursive",color:"#0096FF", textAlign:"center" }}>SocialSphere</h1>

      <div className="a-right">
        <form className="infoForm authForm" onSubmit={handleSubmit} >
          <h2>{isSignUp ? "Register" : "Login"}</h2>
          {isSignUp && (
            <div className="yo">
              <div>
              <input 
                required
                type="text"
                placeholder="First Name"
                className="infoInput1"
                name="firstname"
                value={data.firstname}
                onChange={handleChange}
              />
              </div>
              
              <div>
              
              <input
                required
                type="text"
                placeholder="Last Name"
                className="infoInput1"
                name="lastname"
                value={data.lastname}
                onChange={handleChange}
              />
              </div>
            </div>
          )}

          <div>
            <input
              required
              type="text"
              placeholder="Username"
              className="infoInput1"
              name="username"
              value={data.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              required
              type="password"
              className="infoInput1"
              placeholder="Password"
              name="password"
              value={data.password}
              onChange={handleChange}
            />
            {isSignUp && (
              <input
                required
                type="password"
                className="infoInput1"
                name="confirmpass"
                placeholder="Confirm Password"
                onChange={handleChange}
              />
            )}
          </div>

          <span
            style={{
              color: "red",
              fontSize: "12px",
              alignSelf: "flex-end",
              marginRight: "5px",
              display: confirmPass ? "none" : "block",
            }}
          >
            *Wrong password
          </span>
          <div>
            <span
              style={{
                fontSize: "12px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => {
                resetForm();
                setIsSignUp((prev) => !prev);
              }}
            >
              {isSignUp
                ? "Already have an account? Login"
                : "Don't have an account? Sign up"}
            </span>
            <button
            style={{background:'#0096FF'}}
              className="button  infoButton1"
              type="Submit"
            >
              {loading ? "Loading..." : isSignUp ? "SignUp" : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
