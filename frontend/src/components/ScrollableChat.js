import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react';

import { isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { ChatState } from '../context/ChatProvider';
import { isLastMessage } from './../config/ChatLogics';


const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <div className='scrollableChat'>
      {messages &&
        messages.map((message, index) => (
          <div className='flex' key={message._id}>
            {(isSameSender(messages, message, index, user._id) ||
              isLastMessage(messages, index, user._id)) &&
              (
                <Tooltip
                  label={message.sender.name}
                  placement='bottom-start' hasArrow
                >
                  <Avatar
                    mt='5px'
                    mr={1}
                    size='sm'
                    cursor='pointer'
                    name={message.sender.name}
                    src={message.sender.pic}
                  />
                </Tooltip>
              )}
            <span
              style={{
                backgroundColor: `${message.sender._id === user._id ? '#bee3f8' : '#fde047'
                  }`,
                borderRadius: '20px',
                padding: '5px 15px',
                maxWidth: '75%',
                marginLeft: isSameSenderMargin(messages, message, index, user._id),
                marginTop: isSameUser(messages, message, index, user._id) ? 3 : 10
              }}
            >{message.content}</span>
          </div>
        ))}
    </div>
  )
}

export default ScrollableChat