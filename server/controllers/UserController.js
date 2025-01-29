import mongoose from "mongoose";
import UserModel from "../models/userModel.js";
import ChatModel from "../models/chatModel.js";

import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
// Get a User
export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;

      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No such User");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get all users
export const getAllUsers = async (req, res) => {

  try {
    let users = await UserModel.find();
    users = users.map((user)=>{
      const {password, ...otherDetails} = user._doc
      return otherDetails
    })
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

// udpate a user

export const updateUser = async (req, res) => {
  const id = req.params.id;
  // console.log("Data Received", req.body)
  const { _id, currentUserAdmin, password } = req.body;
  
  if (id === _id) {
    try {
      // if we also have to update password then password will be bcrypted again
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      // have to change this
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWTKEY,
        { expiresIn: "1h" }
      );
      console.log({user, token})
      res.status(200).json({user, token});
    } catch (error) {
      console.log("Error agya hy")
      res.status(500).json(error);
    }
  } else {
    res
      .status(403)
      .json("Access Denied! You can update only your own Account.");
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  const { currentUserId, currentUserAdmin } = req.body;

  if (currentUserId == id || currentUserAdmin) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User Deleted Successfully!");
    } catch (error) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Access Denied!");
  }
};

// Follow a User
// changed
export const followUser = async (req, res) => {
  const id = req.params.id; // The user being followed
  const { _id } = req.body; // The logged-in user

  if (_id === id) {
    return res.status(403).json("Action Forbidden");
  }

  try {
    console.log("Follow API called", { follower: _id, following: id });

    const followUser = await UserModel.findById(id);
    const followingUser = await UserModel.findById(_id);

    if (!followUser || !followingUser) {
      console.log("User not found in DB");
      return res.status(404).json("User not found");
    }

    if (!followUser.followers.includes(_id)) {
      await followUser.updateOne({ $push: { followers: _id } });
      await followingUser.updateOne({ $push: { following: id } });

      console.log("User followed successfully!", { follower: _id, following: id });

      // Convert IDs to ObjectId before storing in ChatModel
      const user1 = new mongoose.Types.ObjectId(_id);
      const user2 = new mongoose.Types.ObjectId(id);

      // **Check if chat already exists**
      const existingChat = await ChatModel.findOne({ members: { $all: [user1, user2] } });

      if (!existingChat) {
        console.log("No existing chat found, creating a new chat...");

        const newChat = new ChatModel({
          members: [user1, user2], // Store as ObjectId
        });

        const savedChat = await newChat.save();
        console.log("New Chat Created:", savedChat);

        if (!savedChat) {
          return res.status(500).json("Failed to create chat.");
        }
      } else {
        console.log("Chat already exists!");
      }

      return res.status(200).json("User followed and chat created if not existing!");
    } else {
      console.log("Already following this user!");
      return res.status(403).json("You are already following this user.");
    }
  } catch (error) {
    console.log("Error in followUser function:", error);
    return res.status(500).json(error);
  }
};

// Unfollow a User
// changed
export const unfollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  if(_id === id)
  {
    res.status(403).json("Action Forbidden")
  }
  else{
    try {
      const unFollowUser = await UserModel.findById(id)
      const unFollowingUser = await UserModel.findById(_id)


      if (unFollowUser.followers.includes(_id))
      {
        await unFollowUser.updateOne({$pull : {followers: _id}})
        await unFollowingUser.updateOne({$pull : {following: id}})
        res.status(200).json("Unfollowed Successfully!")
      }
      else{
        res.status(403).json("You are not following this User")
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
};
