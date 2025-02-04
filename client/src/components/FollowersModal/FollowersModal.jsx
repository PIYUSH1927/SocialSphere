import React, { useEffect, useState } from "react";
import { Modal } from "@mantine/core";
import User from "../User/User";
import { getAllUser } from "../../api/UserRequests"; 
import { useSelector } from "react-redux"; 
import "./FollowersModal.css"; 

const FollowersModal = ({ modalOpened, setModalOpened }) => {
  const [modalPersons, setModalPersons] = useState([]);

    const { user } = useSelector((state) => state.authReducer.authData);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const { data } = await getAllUser();

        const filteredUsers = data.filter((person) => person._id !== user._id);

        setModalPersons(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (modalOpened) {
      fetchPersons(); 
    }
  }, [modalOpened]);

  return (
    <Modal
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
      centered
      withCloseButton
      className="followers-modal"
      overlayProps={{
        backgroundOpacity: 0.5,
        blur: 3,
      }}
    >
      <h2 className="modal-title" style={{textAlign:"center"}}>People You May Know</h2>

  
      <div className="followers-list">
        {modalPersons.map((person, index) => (
          <div key={index} className="user-item">
            <User person={person} />
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default FollowersModal;
