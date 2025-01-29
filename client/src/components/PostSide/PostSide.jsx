import React from "react";
import Posts from "../Posts/Posts";
import PostShare from "../PostShare/PostShare";
import "./PostSide.css";

const PostSide = () => {
  return (
    <div className="PostSide">
      <PostShare/>
      <Posts/>
      <div className="mobile-only">
        <br />
        <br />
      </div>
    </div>
  );
};

export default PostSide;
