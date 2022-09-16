import React from 'react'

import { ChatState } from './../context/ChatProvider';
import { Box } from '@chakra-ui/react';

import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      className='flex-col items-center p-3 bg-white w-full md:w-2/3 rounded-lg border-2'
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox