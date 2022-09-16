import React from 'react';

import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display={{ base: 'flex' }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display='flex'
            flexDir='column'
            alignItems='center'
            justifyContent='space-between'
          >
            <Image
              borderRadius='full'
              boxSize='150px'
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: '20px', md: "24px" }}
            >Email : {user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='yellow' mr={3} onClick={onClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal