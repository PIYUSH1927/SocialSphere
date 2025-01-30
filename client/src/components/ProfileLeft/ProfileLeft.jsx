import React from 'react'
import FollowersCard from '../FollowersCard/FollowersCard'
import InfoCard from '../InfoCard/InfoCard'
import LogoSearch from '../LogoSearch/LogoSearch'

const ProfileLeft = () => {
  return (
    <div className="ProfileSide" style={{display:"flex"}}>
      <div>
      <LogoSearch/>
      </div>
        
        <InfoCard/>
        <FollowersCard/>
    </div>
  )
}

export default ProfileLeft