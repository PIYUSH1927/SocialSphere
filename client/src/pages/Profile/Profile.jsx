import React from "react";
import PostSide from "../../components/PostSide/PostSide";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import ProfileLeft from "../../components/ProfileLeft/ProfileLeft";
import RightSide from "../../components/RightSide/RightSide";
import "./Profile.css";

const Profile = () => {
  return (
    <div className="Profile">
      {/* ProfileLeft - Now Visible in Mobile */}
      <ProfileLeft />

      {/* Profile Center */}
      <div className="Profile-center">
        <ProfileCard location="profilePage" />

        {/* PostSide - Hidden in Mobile */}
        <div >
          <PostSide />
        </div>

        <br />
      </div>

      {/* RightSide - Always Last in Desktop, First in Mobile */}
      <RightSide />
    </div>
  );
};

export default Profile;
