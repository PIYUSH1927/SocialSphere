import React, { useState } from "react";
import PostSide from "../components/PostSide/PostSide";
import ProfileSide from "../components/profileSide/ProfileSide";
import RightSide from "../components/RightSide/RightSide";
import "./Home.css";

const Home = () => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="Home">
      {/* ProfileSide - Always Visible in Desktop, Hidden in Mobile */}
      <ProfileSide />


      {/* PostSide (Below RightSide in Mobile, Normal in Desktop) */}
      <PostSide />

      {/* RightSide (At top in Mobile, Normal in Desktop) */}
      <RightSide />
    </div>
  );
};

export default Home;
