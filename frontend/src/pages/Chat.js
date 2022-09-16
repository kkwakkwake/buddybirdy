import { useState } from 'react';

import SideDrawer from './../components/SideDrawer';
import MyChats from './../components/MyChats';
import ChatBox from './../components/ChatBox';

import { ChatState } from '../context/ChatProvider'


const Chat = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false)

  return (
    <div className='w-full bg-white h-screen'>
      {user && <SideDrawer />}
      <div className='w-full flex justify-between p-3' style={{ height: '92vh' }}>
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user &&
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </div>


    </div>
  )
}

export default Chat