import React, { useEffect, useState } from "react";
import "./FollowersCard.css";
import FollowersModal from "../FollowersModal/FollowersModal";
import { getAllUser } from "../../api/UserRequests";
import User from "../User/User";
import { useSelector } from "react-redux";
const FollowersCard = ({ location }) => {
  const [modalOpened, setModalOpened] = useState(false);
  const [persons, setPersons] = useState([]);
  const { user } = useSelector((state) => state.authReducer.authData);

  useEffect(() => {
    const fetchPersons = async () => {
      const { data } = await getAllUser();
      setPersons(data);
    };
    fetchPersons();
  }, []);

  return (
    <div className="FollowersCard">
      <h3 style={{textAlign:"center", marginBottom:"0px"}}>People you may know</h3>

      {persons
        .filter((person) => person._id !== user._id)
        .slice(0, 4)
        .map((person, id) => (
          <User person={person} key={id} />
        ))}
      {!location ? (
        <span style={{position:"relative", bottom:"5px", marginBottom:"25px"}} onClick={() => setModalOpened(true)}>Show more</span>
      ) : (
        ""
      )}
    
     
    

      <FollowersModal
        modalOpened={modalOpened}
        setModalOpened={setModalOpened}
      />
    </div>
  );
};

export default FollowersCard;
