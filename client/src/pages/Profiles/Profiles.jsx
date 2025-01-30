import React from "react";
import InfoCard from "../../components/InfoCard/InfoCard";
import LogoSearch from "../../components/LogoSearch/LogoSearch";
import FollowersCard from "../../components/FollowersCard/FollowersCard";
import RightSide from "../../components/RightSide/RightSide";
import FollowersCard1 from "../../components/FollowersCard1/FollowersCard1";
import "./Profiles.css";

const Profiles = () => {
  return (
    <div className="Profile1">
      {/* Left Section (Desktop Only) */}
      <div className="desktop-visible">
        <div style={{ marginBottom: "10px", marginLeft: "40px" }}>
          <LogoSearch />
        </div>
        <InfoCard />
      </div>

      {/* FollowersCard (Desktop Only) */}
      <div className="desktop-visible">
        <FollowersCard1 />
      </div>

      {/* RightSide (Always Last in Desktop) */}
      <div className="desktop-visible">
        <RightSide />
      </div>

      {/* ✅ Mobile View: RightSide → InfoCard → FollowersCard */}
      <div className="mobile-only">
        <div style={{marginBottom:"13px"}}>
        <RightSide />
        </div>
        <InfoCard />
        <FollowersCard />
       
      </div>
    </div>
  );
};

export default Profiles;
