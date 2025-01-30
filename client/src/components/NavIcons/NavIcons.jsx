import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "../../img/home1.png";
import Noti from "../../img/noti.png";
import Chat from "../../img/chat1.png";
import User from "../../img/user.png";

import { UilSetting } from "@iconscout/react-unicons";
import "./NavIcons.css";

const NavIcons = () => {
  // Get user from Redux store
  const { user } = useSelector((state) => state.authReducer.authData);

  return (
    <div className="navIcons">
      <Link to="/home">
        <img style={{ width: "36px", height: "31px", position: "relative", bottom: "5px" }} src={Home} alt="Home" />
      </Link>
      <UilSetting />
      
      {/* Redirect to logged-in user's profile */}
      {user?._id && (
        <Link to={`/profile/${user._id}`}>
          <img src={User} alt="Profile" />
        </Link>
      )}
      
      <Link to="/chat">
        <img src={Chat} alt="Chat" />
      </Link>
    </div>
  );
};

export default NavIcons;
