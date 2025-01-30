import React, { useEffect, useState } from "react";
import "./FollowersCard1.css";
import FollowersModal from "../FollowersModal/FollowersModal";
import { getAllUser } from "../../api/UserRequests";
import User from "../User/User";
import { useSelector } from "react-redux";
const FollowersCard1 = ({ location }) => {
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
    <div className="FollowersCard1">
      <h3 style={{textAlign:"center", marginBottom:"0px"}}>People you may know</h3>

      {persons
        .filter((person) => person._id !== user._id)
        .map((person, id) => (
          <User person={person} key={id} />
        ))}
      {!location ? (
        <span  onClick={() => setModalOpened(true)}>Show more</span>
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

export default FollowersCard1;
