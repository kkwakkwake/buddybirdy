import React from 'react'
import { Box } from '@chakra-ui/layout';
import { ChatState } from '../context/ChatProvider';
import { getSender } from '../config/ChatLogics';
import { useState } from 'react';
import { useEffect } from 'react';

const ChatNameBox = ({ chat, loggedUser }) => {
  const { selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState('');

  useEffect(() => {
    // 그룹채팅일 때
    if (chat && !chat?.isGroupChat) {
      setGroupChatName(getSender(loggedUser, chat.users))
    } else {
      // 그룹채팅 아닐 때
      setGroupChatName(chat.chatName)
    }
  }, [chat, loggedUser])

  return (
    <Box
      className='cursor-pointer px-3 py-2 rounded-lg my-3'
      onClick={() => setSelectedChat(chat)}
      bg={selectedChat === chat ? "#bee3f8" : "#E8E8E8"}
    >
      <p>
        {groupChatName}
      </p>
    </Box>
  )
}

export default ChatNameBox