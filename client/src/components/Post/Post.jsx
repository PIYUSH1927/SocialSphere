import React, { useState, useEffect } from "react";
import { getAllUser } from "../../api/UserRequests";
import axios from "axios";
import "./Post.css";
import Comment from "../../img/comment.png";
import User from "../../img/user.jpg";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import Delete from "../../img/delete.png";
import NotLike from "../../img/notlike.png";
import { likePost ,deletePost} from "../../api/PostsRequests";
import { useSelector } from "react-redux";

const Post = ({ data }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [liked, setLiked] = useState(data.likes.includes(user._id));
  const [likes, setLikes] = useState(data.likes.length);
  const [persons, setPersons] = useState([]);

  const isUserAuthor = user._id === data.userId;
  
  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const { data } = await getAllUser();
        setPersons(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchPersons();
  }, []);

  const postUser = persons.find((person) => person._id === data.userId);
  
  const handleLike = () => {
    likePost(data._id, user._id);
    setLiked((prev) => !prev);
    liked? setLikes((prev)=>prev-1): setLikes((prev)=>prev+1)
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId, { userId: user._id });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  
  return (
    <div className="Post">

      <div >
        <span style={{fontFamily:"cursive" }}>
        <img  src={User} alt="" />
        &nbsp;&nbsp;
        <span style={{position:"relative",bottom:"4px"}}>
        {postUser ? postUser.username : ""}
        </span>
        </span>
      </div>
      <img src={data.image ? data.image : User} alt="Post" />

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
        <img style={{marginLeft: "auto", width:"1.3rem" , cursor:"pointer"}} src={Delete} onClick={() => handleDelete(data._id)} alt="" />
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
