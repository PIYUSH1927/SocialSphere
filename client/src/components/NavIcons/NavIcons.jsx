import React from "react";

import Home from "../../img/home1.png";
import Noti from "../../img/noti.png";
import Chat from "../../img/chat1.png";
import { UilSetting } from "@iconscout/react-unicons";
import { Link } from "react-router-dom";
import "./NavIcons.css"

const NavIcons = () => {
  return (
    <div className="navIcons" >
      <Link to="../home">
        <img style={{width:"40px",height:"35px",position:'relative',bottom:'5px'}} src={Home} alt="" />
      </Link>
      <UilSetting />
      <img src={Noti} alt="" />
      <Link to="../chat">
        <img src={Chat} alt="" />
      </Link>
    </div>
  );
};

export default NavIcons;
