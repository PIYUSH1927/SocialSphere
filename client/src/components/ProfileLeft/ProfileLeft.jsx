import React from 'react'
import FollowersCard from '../FollowersCard/FollowersCard'
import InfoCard from '../InfoCard/InfoCard'
import LogoSearch from '../LogoSearch/LogoSearch'

const ProfileLeft = () => {
  return (
    <div className="ProfileSide">
      <div style={{paddingBottom:"10px", marginLeft:"35px"}}>
      <LogoSearch/>
      </div>
        
        <InfoCard/>
        <FollowersCard/>
    </div>
  )
}

export default ProfileLeft