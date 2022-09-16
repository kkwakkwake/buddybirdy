import { useEffect, useState } from "react";

import { Box } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";

import GroupChatModal from "./GroupChatModal";
import ChatLoading from "./ChatLoading";
import ChatNameBox from './ChatNameBox';

import axios from "axios";
import { ChatState } from "../context/ChatProvider";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "에러 발생!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);


  return (
    <Box className='flex-col items-center p-3 bg-white w-full md:w-1/3 '
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}>
      <div className='text-2xl md:text-3xl pb-3 px-3 flex w-full justify-between items-center'>
        My Buddies
        <GroupChatModal>
          <button className='flex text-sm md:text-xs lg:text-base bg-yellow-300 px-2.5 py-2 rounded-lg hover:bg-slate-200'>
            채팅할 버디 추가 +
          </button>
        </GroupChatModal>
      </div>
      <div className='flex flex-col p-3 bg-slate-100 w-full h-full rounded-lg overflow-hidden'>
        {chats ? (
          <div className='overflow-y-hidden'>
            {chats.map((chat) => (
              <ChatNameBox key={chat._id} chat={chat} loggedUser={loggedUser} />
            ))}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
    </Box>
  );
};

export default MyChats;