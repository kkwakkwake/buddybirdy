import React, { useState, useEffect } from 'react'

import { IconButton, Spinner } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useToast } from '@chakra-ui/toast';

import UpdateGroupChatModal from './UpdateGroupChatModal';
import { getSender } from './../config/ChatLogics';
import ScrollableChat from './ScrollableChat';

import { ChatState } from '../context/ChatProvider';
import axios from 'axios';
import io from 'socket.io-client';


const ENDPOINT = 'http://localhost:5000';
let socket;
let selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);

  const toast = useToast();

  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      console.log(messages)
      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: '에러 발생!',
        description: 'Failed to send the Message',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      })
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connection', () => {
      setSocketConnected(true)
    })
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      // 지금 방의 새 메세지가 아닐 때
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // 알림 주기
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived])
      }
    })
  });
  console.log(notification, '------------')

  const handleSendMessage = async (e) => {
    if (e.key === 'Enter' && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          }
        }
        setNewMessage('');

        const { data } = await axios.post('/api/message', {
          content: newMessage,
          chatId: selectedChat._id
        }, config)

        console.log(data)
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: '에러 발생!',
          description: 'Failed to send the Message',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom'
        })
      }
    }
  }

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
  }

  return (
    <>
      {selectedChat ? (
        <>
          <p className='flex justify-between w-full px-2 pb-3 text-base md:text-xl'>
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            />
            {!selectedChat.isGroupChat ? (<>
              {getSender(user, selectedChat.users)}
            </>) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </p>
          <div className='flex justify-end flex-col p-3 bg-slate-100 w-full h-full rounded-lg overflow-y-hidden'
          >
            {loading ? (
              <Spinner
                size='xl'
                w={20}
                h={20}
                alignSelf='center'
                margin='auto'
              />
            ) : (
              <div className='flex flex-col-reverse overflow-y-auto '>
                <ScrollableChat messages={messages} />
              </div>
            )}
            <div onKeyDown={handleSendMessage} required className='mt-3'>
              <input className='bg-slate-200 w-full p-2 rounded-lg'
                placeholder='메세지를 입력하세요'
                onChange={handleTyping}
                value={newMessage}
              />
            </div>
          </div>
        </>
      ) : (
        <div className='flex items-center justify-center h-full'>
          <p className='text-xl pb-3' >
            Click on a user to start chatting</p>
        </div>
      )}
    </>
  );
}

export default SingleChat