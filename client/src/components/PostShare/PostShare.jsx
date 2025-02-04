import React, { useState, useRef } from "react";
import "./PostShare.css";
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilSchedule } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage, uploadPost } from "../../actions/UploadAction";
import axios from "axios";
import DefaultProfile from "../../img/profileImg.jpg";

const PostShare = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const desc = useRef();
 
  const imageRef = useRef();
  
  const profileImageUrl = user.profilePicture
  ? user.profilePicture 
  : DefaultProfile;


  // handle Image Change
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage(img);
    }
  };


  const handleUpload = async (e) => {
    e.preventDefault();

    setLoading(true);
   
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("desc", desc.current.value);

    if (image) {
      formData.append("image", image); 
    }

    console.log("Sending FormData:", [...formData.entries()]); 

    try {
      const response = await axios.post("https://socialsphere1-4z6x.onrender.com/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload Response:", response.data);
      window.location.reload();
      dispatch(uploadPost(response.data));

    } catch (err) {
      console.error("Upload Error:", err);
    } finally {
      setLoading(false); 
      resetShare();
    }
  };

  const resetShare = () => {
    setImage(null);
    desc.current.value = "";
  };
  return (
    <div className="PostShare">
      <img
       src={profileImageUrl}
        alt="Profile"
      />
      <div>
        <input
          type="text"
          placeholder="What's happening?"
          required
          ref={desc}
        />
        <div className="postOptions">
          <div
            className="option"
            style={{ color: "var(--photo)" }}
            onClick={() => imageRef.current.click()}
          >
            <UilScenery />
            Photo
          </div>

          <div className="option" style={{ color: "var(--video)" }}>
            <UilPlayCircle />
            Video
          </div>
          <div className="option hide-in-mobile" style={{ color: "var(--location)" }}>
            <UilLocationPoint />
            <span style={{position:"relative", bottom:"7px"}}>Location</span>          
          </div>
          <div className="option hide-in-mobile" style={{ color: "var(--shedule)" }}>
            <UilSchedule />
            <span style={{position:"relative", bottom:"7px"}}>Shedule</span>  
            
          </div>
          <button
            className="button ps-button"
            onClick={handleUpload}
            disabled={loading}
           style={{background:"#0096FF"}}
          >
            {loading ? "uploading" : "Share"}
          </button>

          <div style={{ display: "none" }}>
            <input type="file" ref={imageRef} onChange={onImageChange} />
          </div>
        </div>

        {image && (
          <div className="previewImage">
            <UilTimes onClick={() => setImage(null)} />
            <img src={URL.createObjectURL(image)} alt="preview" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostShare;
