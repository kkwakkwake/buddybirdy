import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Drawer, DrawerContent, DrawerOverlay, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useDisclosure, Tooltip, Avatar } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useToast } from '@chakra-ui/toast';
import { Spinner } from "@chakra-ui/spinner";

import ChatLoading from './ChatLoading';
import ProfileModal from './ProfileModal';
import UserListItem from './UserListItem';
import { getSender } from './../config/ChatLogics';

import axios from 'axios';
import { ChatState } from '../context/ChatProvider';
import './style.css';

const SideDrawer = () => {
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState('')

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { setSelectedChat,
    user,
    chats,
    setChats,
    notification,
    setNotification
  } = ChatState();

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('userInfo')
    navigate('/', { replace: true })
  }

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "검색어를 입력하세요.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    console.log(search)
    console.log(user)

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data)
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "에러 발생!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };


  return (
    <>
      <div className='flex justify-between items-center w-full px-2.5 py-2.5'>
        <Tooltip label='메세지를 보낼 유저를 선택하세요' hasArrow placement='bottom-end'>
          <Button variant='ghost' onClick={onOpen} className=' bg-yellow-300 '>
            <i className="fas fa-search"></i>
            <span className='mx-2'>버디 검색하기</span>
          </Button>
        </Tooltip>
        <h1 className='text-3xl' style={{ fontFamily: "SDSamliphopangche_Outline" }}>buddybirdy</h1>
        <div>
          <Menu>
            <MenuButton p={1}>
              <span style={{ color: 'red' }}>{notification.length ? notification.length : ''}</span>
              <BellIcon fontSize='2xl' m={1} className={notification.length >= 1 && 'bellIcon'}></BellIcon>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && '알림 없음'}
              {notification.map((notif) => (
                <MenuItem key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((ntf) => ntf !== notif))
                  }}
                >
                  {notif.chat.isGroupChat ? `${notif.chat.chatName}에서 새 메세지` : `${getSender(user, notif.chat.users)}로부터 새 메세지`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>내 프로필</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent style={{ fontFamily: "GmarketSansMedium" }}>
          <header className='px-3 py-3 text-lg font-bold'>유저 검색하기</header>
          <div className='p-2' style={{ fontFamily: "GmarketSansMedium" }}>
            <div className='flex justify-around'>
              <input className='mr-0.5 border-b-2 border-yellow-300'
                placeholder="이름 혹은 이메일을 검색하세요."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className='bg-yellow-300 py-1 px-2 rounded ' onClick={handleSearch}>검색</button>
            </div>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </div>
        </DrawerContent>
      </Drawer>

    </>
  )
}

export default SideDrawer