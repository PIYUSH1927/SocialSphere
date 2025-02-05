import React, { useState } from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import "./ProfileModal.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { uploadImage } from "../../actions/UploadAction";
import { updateUser } from "../../actions/UserAction";

const ProfileModal = ({ modalOpened, setModalOpened, data }) => {
  const theme = useMantineTheme();
  const { password, ...other } = data;
  const [formData, setFormData] = useState(other);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const dispatch = useDispatch();
  const param = useParams();

  const { user } = useSelector((state) => state.authReducer.authData);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      event.target.name === "profileImage"
        ? setProfileImage(img)
        : setCoverImage(img);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let UserData = { ...formData }; 
  
    const uploadToS3 = async (file) => {
      const data = new FormData();
      data.append("file", file);
  
      try {
        const response = await dispatch(uploadImage(data)); 
  
        if (response && response.imageUrl) {
          return response.imageUrl; 
        }
      } catch (err) {
        console.error("🚨 Error uploading to S3:", err);
      }
      return null;
    };
  
    if (profileImage) {
      const profileImageUrl = await uploadToS3(profileImage);
      if (profileImageUrl) {
        UserData.profilePicture = profileImageUrl; 
      }
    }
  
    if (coverImage) {
      const coverImageUrl = await uploadToS3(coverImage);
      if (coverImageUrl) {
        UserData.coverPicture = coverImageUrl;
      }
    }
 
    const response = await dispatch(updateUser(param.id, UserData));
  
    setModalOpened(false);
  };
  

  return (
    <Modal
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="55%"
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
    >
      <form className="infoForm" onSubmit={handleSubmit}>
        <h3>Your Info</h3>
        <div>
          <input
            value={formData.firstname}
            onChange={handleChange}
            type="text"
            placeholder="First Name"
            name="firstname"
            className="infoInput"
          />
          <input
            value={formData.lastname}
            onChange={handleChange}
            type="text"
            placeholder="Last Name"
            name="lastname"
            className="infoInput"
          />
        </div>

        <div>
          <input
            value={formData.worksAt}
            onChange={handleChange}
            type="text"
            placeholder="Works at"
            name="worksAt"
            className="infoInput"
          />
        </div>

        <div>
          <input
            value={formData.livesIn}
            onChange={handleChange}
            type="text"
            placeholder="Lives in"
            name="livesIn"
            className="infoInput"
          />
          <input
            value={formData.country}
            onChange={handleChange}
            type="text"
            placeholder="Country"
            name="country"
            className="infoInput"
          />
        </div>

        <div>
          <input
            value={formData.relationship}
            onChange={handleChange}
            type="text"
            className="infoInput"
            placeholder="Relationship status"
            name="relationship"
          />
        </div>

        <div className="fx">

        <div>
        <b style={{fontSize:"0.9rem"}}>Profile image </b>
        <input type="file" name="profileImage" onChange={onImageChange} />
        </div>
        <div>
        
        <b style={{fontSize:"0.9rem"}}>Cover image </b>
        <input  type="file" name="coverImage" onChange={onImageChange} />
        </div>

        </div>
        
        
        <button className="button infoButton" type="submit" style={{background:"#0096FF"}}>
          Update
        </button>
      </form>
    </Modal>
  );
};

export default ProfileModal;
