import React, { useState } from "react";
import axios from "axios";
import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import Delete from "../../img/delete.png";
import NotLike from "../../img/notlike.png";
import { likePost } from "../../api/PostsRequests";
import { useSelector } from "react-redux";

const Post = ({ data }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [liked, setLiked] = useState(data.likes.includes(user._id));
  const [likes, setLikes] = useState(data.likes.length)

  const isUserAuthor = user._id === data.userId;

  console.log("user._id:", user._id);
  console.log("data.author:", data.author);
  console.log("isUserAuthor:", isUserAuthor);
  
  const handleLike = () => {
    likePost(data._id, user._id);
    setLiked((prev) => !prev);
    liked? setLikes((prev)=>prev-1): setLikes((prev)=>prev+1)
  };

  const handleDelete = () => {
    const apiUrl = ``;

    axios
      .delete(apiUrl)
      .then((response) => {
        if (response.status === 200) {
          console.log("Post deleted successfully.");
          window.alert("Post deleted successfully.");
        }
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };

  return (
    <div className="Post">
      <img
        src={data.image ? process.env.REACT_APP_PUBLIC_FOLDER + data.image : ""}
        alt=""
      />

      <div className="postReact">
        <img
          src={liked ? Heart : NotLike}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={handleLike}
        />
        <img src={Comment} alt="" />
        <img src={Share} alt="" />

        {isUserAuthor && (
        <img style={{marginLeft: "auto", width:"3%" , cursor:"pointer"}} src={Delete} onClick={handleDelete} alt="" />
        )}
      </div>

      <span style={{ color: "var(--gray)", fontSize: "12px" }}>
        {likes} likes
      </span>
      <div className="detail">
        <span>
          <b>{data.name} </b>
        </span>
        <span>{data.desc}</span>
      </div>
    </div>
  );
};

export default Post;
