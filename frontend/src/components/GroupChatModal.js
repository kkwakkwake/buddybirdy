import React, { useState } from 'react';
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, Input, ModalFooter, Button, Box } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';

import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem';

import axios from 'axios';
import { ChatState } from './../context/ChatProvider';

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const toast = useToast();

  const handleSearch = async (e) => {
    if (!search) {
      return;
    }

    if (e.keyCode === 13) {
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
        setSearch('');
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
    }

  }

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "모든 칸을 입력하세요.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('/api/chat/group', {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((user) => user._id))
      }, config)

      setChats([data, ...chats])
      onClose();

      toast({
        title: "새 그룹이 추가되었습니다!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "그룹 만들기에 실패했어요.",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "이미 추가된 버디입니다.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  }

  const handleDelete = (deleteuser) => {

    // 선택된 유저 삭제 (등록하기 전에)
    setSelectedUsers(selectedUsers.filter((user) => user._id !== deleteuser._id))
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="20px"
            display="flex"
            justifyContent="center"
          >
            그룹 버디를 만들어보세요.
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="채팅방 이름"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl className='w-full flex gap-2'>
              <Input
                className='w-3/5'
                placeholder="버디를 추가하세요."
                mb={1}
                value={search}
                onKeyDown={handleSearch}
                onChange={(e) => setSearch(e.target.value)}
              />
            </FormControl>
            <Box
              w='100%' display='flex' flexWrap='wrap'
            >
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user._id} user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>

            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResult?.slice(0, 4).map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='yellow' onClick={handleSubmit}>완료</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal