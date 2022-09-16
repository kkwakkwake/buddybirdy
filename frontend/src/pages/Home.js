import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToast } from '@chakra-ui/react';

import axios from 'axios';


const Home = () => {
  const navigate = useNavigate()

  //로그인 변수
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const toast = useToast()

  const handleShow = (e) => {
    e.preventDefault();
    setShow(!show);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: '모든 칸을 입력하세요.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })

      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        },
      }

      const { data } = await axios.post('/api/user/login', {
        email, password
      }, config)

      toast({
        title: '로그인 성공!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });

      localStorage.setItem('userInfo', JSON.stringify(data))

      navigate('/chats', { replace: true })
    } catch (error) {
      toast({
        title: '에러 발생!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  }

  const goToRegister = () => {
    navigate('/signup');
  }

  return (
    <>
      <div className='max-w-screen-sm mx-auto py-20'>
        <h1 className='text-5xl  mb-10 ' style={{ fontFamily: "SDSamliphopangche_Outline" }}>buddybirdy</h1>
        <div className='flex justify-between items-center h-80'>
          <form className='flex flex-col gap-y-2 max-w-sm'>
            <label>이메일 *</label>
            <input className='p-1 border-0 border-b-2 bg-transparent border-yellow-300 mb-3 focus:border-2'
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <label>비밀번호 * </label>
            <div className='flex justify-between mb-10'>
              <input className='p-1 border-0 border-b-2 bg-transparent border-yellow-300  focus:border-2 w-4/5'
                type={show ? 'text' : 'password'}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button className=' text-xs	text-slate-400 '
                onClick={handleShow}
              >{show ? 'Hide' : 'Show'}</button>
            </div>
            <div className='flex justify-between'>
              <button onClick={goToRegister} className='inline p-2  border-solid border-2 border-yellow-300 rounded-md hover:bg-yellow-300 hover:border-0 px-5'>계정 만들기</button>
              <button
                onClick={handleSubmit}
                className='inline p-2 px-5 border-solid border-2 border-yellow-300 rounded-md bg-yellow-300  self-end hover:text-white hover:scale-110'>로그인</button>
            </div>
          </form>
          <div className='w-60 mx-auto' >
            <img src={'/assets/mainImage.svg'} alt='mainImage' />
          </div>
        </div>
      </div >
    </>

  )
}

export default Home