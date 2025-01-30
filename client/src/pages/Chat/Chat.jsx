import React, { useRef, useState, useEffect } from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Coversation/Conversation";
import LogoSearch from "../../components/LogoSearch/LogoSearch";
import NavIcons from "../../components/NavIcons/NavIcons";
import "./Chat.css";
import { userChats } from "../../api/ChatRequests";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

const Chat = () => {
  const dispatch = useDispatch();
  const socket = useRef();
  const { user } = useSelector((state) => state.authReducer.authData);

  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);

  // **Fix: Cleanup function to prevent state update on unmounted component**
  useEffect(() => {
    let isMounted = true;

    const getChats = async () => {
      try {
        const { data } = await userChats(user._id);
        if (isMounted) setChats(data); // ✅ Only update state if component is mounted
      } catch (error) {
        console.log(error);
      }
    };

    getChats();

    return () => {
      isMounted = false; // Cleanup on component unmount
    };
  }, [user._id]);

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io("ws://localhost:8800");
    socket.current.emit("new-user-add", user._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.current.disconnect(); // ✅ Cleanup socket connection
    };
  }, [user]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // Get the message from socket server
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log(data);
      setReceivedMessage(data);
    };

    socket.current.on("recieve-message", handleReceiveMessage);

    return () => {
      socket.current.off("recieve-message", handleReceiveMessage); // ✅ Cleanup socket listener
    };
  }, []);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat" >
      <div className="hide-in-mobile">
          <LogoSearch />
        </div>
        <div className="Chat-container" style={{overflowX:"hidden"}}>
          <h3 className="yep">Chats</h3>
          <div className="Chat-list" >
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => {
                  setCurrentChat(chat);
                }}
              >
                <Conversation
                  data={chat}
                  currentUser={user._id}
                  online={checkOnlineStatus(chat)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="Right-side-chat" >
        <div  className="nav-icons-container" >
          <NavIcons />
        </div>

        <div style={{height:"50%"}}>
        <ChatBox
          chat={currentChat}
          currentUser={user._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
        </div>
      </div>
    </div>
  );
};

export default Chat;
