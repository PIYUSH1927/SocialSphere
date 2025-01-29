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
  styles={{
    modal: {
      width: "45vw",
      height: "75vh", // ✅ Adjusted height for better UX
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
    },
  }}
>
  <h2 style={{ textAlign: "center", marginBottom: "15px" }}>People You May Know</h2>

  {/* Scrollable Content */}
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
