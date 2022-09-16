import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';

const SignupPage = () => {
  const navigate = useNavigate();

  // 회원가입 변수
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [password, setPassword] = useState('');
  const [pic, setPic] = useState(null);

  const toast = useToast()

  const handleShow = (e) => {
    e.preventDefault();
    setShow(!show);
  }


  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))

    if (userInfo) {
      navigate('/chats', { replace: true })
    }
  }, [navigate])

  const postDetails = async (pics) => {

    if (pics === undefined || pics === null) {
      toast({
        title: '이미지를 선택해주세요!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      return;
    }

    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'aqnz19uc');
      data.append('cloud_name', 'dhajlbsaa');

      try {
        const response = await fetch('https://api.cloudinary.com/v1_1/dhajlbsaa/image/upload', {
          method: 'post',
          body: data
        })
        const urlData = await response.json();
        console.log(urlData.url.toString())
        setPic(urlData.url.toString());;

      } catch (error) {
        console.log(error);

      }
    } else {
      toast({
        title: 'Please Select an Image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: '모든 칸을 입력하세요.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      return;
    }

    if (password !== confirmpassword) {
      toast({
        title: '비밀번호가 일치 하지 않아요.',
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

      const { data } = await axios.post('/api/user', {
        name, email, password, pic
      }, config)

      toast({
        title: '가입 성공!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });

      localStorage.setItem('userInfo', JSON.stringify(data))
      navigate('/chats', { replace: true })
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  }

  return (
    <>
      <div className='max-w-screen-sm mx-auto py-10'>
        <div className='flex flex-col items-center'>
          <h1 className='text-2xl  my-10 '>환영합니다!</h1>
          <form className='flex flex-col max-w-sm'>
            <label >이름 *</label>
            <input
              className='p-1 border-0 border-b-2 bg-transparent border-yellow-300 mb-5' type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
            <label >이메일 *</label>
            <input className='p-1 border-0 border-b-2 bg-transparent border-yellow-300 mb-5' type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <label>비밀번호 *</label>
            <div className='flex justify-between '>
              <input className='mb-5 p-1 border-0 border-b-2 bg-transparent border-yellow-300 w-4/5'
                type={show ? 'text' : 'password'}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
              <button
                className='text-xs	text-slate-400'
                onClick={handleShow}
              >{show ? 'Hide' : 'Show'}</button>
            </div>
            <label>비밀번호 확인 *</label>
            <div className='flex justify-between mb-5'>
              <input className='p-1 border-0 border-b-2 bg-transparent border-yellow-300 w-4/5'
                type={show ? 'text' : 'password'}
                onChange={(e) => setConfirmpassword(e.target.value)}
                value={confirmpassword}
                required
              />
              <button className='text-xs	text-slate-400'
                onClick={handleShow}
              > {show ? 'Hide' : 'Show'}</button>
            </div>
            <label>프로필 사진 * </label>
            <input type="file" className='mt-2'
              required
              onChange={(e) => postDetails(e.target.files[0])}
            />
            <button className='inline p-2 px-5 border-yellow-300 rounded-md bg-yellow-300 border-0 self-end mt-10 hover:text-white hover:scale-110'
              onClick={handleSubmit}
            >가입완료</button>
          </form>
        </div>
      </div >
    </>
  )
}

export default SignupPage