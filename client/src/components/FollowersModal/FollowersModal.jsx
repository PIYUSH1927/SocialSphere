import React, { useEffect, useState } from "react";
import { Modal } from "@mantine/core";
import User from "../User/User"; // Import User component
import { getAllUser } from "../../api/UserRequests"; // Fetch users separately
import "./FollowersModal.css"; // Import modal-specific styles

const FollowersModal = ({ modalOpened, setModalOpened }) => {
  const [modalPersons, setModalPersons] = useState([]);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const { data } = await getAllUser();
        setModalPersons(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (modalOpened) {
      fetchPersons(); // Fetch new data when modal opens
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
