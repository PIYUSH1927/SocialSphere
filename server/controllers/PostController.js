import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";
import mongoose from "mongoose";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../index.js";
import dotenv from "dotenv";

// creating a post

export const createPost = async (req, res) => {
  try {

    const { userId, desc } = req.body;
    let imageUrl = null;

    if (req.file) {
      const file = req.file;
      const fileName = `${Date.now()}-${file.originalname}`;

      const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };


      await s3.send(new PutObjectCommand(uploadParams));

 
      imageUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${fileName}`;
    }

    const newPost = new PostModel({
      userId,
      desc,
      image: imageUrl, 
    });

    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    res.status(500).json({ message: "Failed to create post", error });
  }
};

// get a post

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await PostModel.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Failed to fetch post", error });
  }
};

// update post
export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated!");
    } else {
      res.status(403).json("Authentication failed");
    }
  } catch (error) {}
};

// delete a post
export const deletePost = async (req, res) => {
  const id = req.params.id;

  try {
    // Delete the post without checking the user ID
    await PostModel.findByIdAndDelete(id);
    
    res.status(200).json("Post deleted.");
  } catch (error) {
    res.status(500).json(error);
  }
};

// like/dislike a post
export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(id);
    if (post.likes.includes(userId)) {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post disliked");
    } else {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post liked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get timeline posts
export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id;
  try {
    
    const currentUserPosts = await PostModel.find({ userId: userId })
      .sort({ createdAt: 1 }); 

    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
      {
        $unwind: "$followingPosts", 
      },
      {
        $sort: { "followingPosts.createdAt": 1 }, 
      },
      {
        $group: {
          _id: null,
          followingPosts: { $push: "$followingPosts" },
        },
      },
    ]);

    const allPosts = currentUserPosts.concat(followingPosts[0]?.followingPosts || []);
    
    res.status(200).json(allPosts);

  } catch (error) {
    res.status(500).json(error);
  }
};
