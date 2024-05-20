import React, { useEffect } from 'react'
import Link from 'next/link'
import { useState } from 'react'
import { data } from 'autoprefixer'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/')
    }
  }, [])

  const handleChange = (e) => {
    if (e.target.name == 'name') {
      setName(e.target.value)
    }
    else if (e.target.name == 'email') {
      setEmail(e.target.value)
    }
    else if (e.target.name == 'password') {
      setPassword(e.target.value)
    }
    else if (e.target.name === 'confirmPassword') setConfirmPassword(e.target.value);
  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const data = { name, email, password }

    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    let response = await res.json()
    console.log(response)

    setName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")

    toast.success('Successfully created your account!', {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });

  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-t from-black via-blue-600 to-blue-900">
      <form onSubmit={handleSubmit} method="POST">
        <div className=" md:w-auto w-[90%] p-8 rounded-xl  m-4 flex flex-col items-center shadow-lg border border-gray-400 opacity-90 ">
          <div className="text-xl cursor-pointer flex flex-col justify-center items-center mt-5 md:mt-0 ">
            <img src="/A&k.png" alt="myLogo" width={'80vw'} />
            <h1 className="font-semibold text-3xl text-gray-200 m-2">Register</h1>
          </div>
          <div className="flex flex-col justify-center items-center mt-10 md:mt-4 space-y-6 md:space-y-8">
            <div className="">
              <div className="m-1 text-lg text-gray-200 text-semibold">Name</div>
              <input onChange={handleChange} type="text"
                id='name' name='name' className="border-b border-gray-200 focus:outline-none  text-gray-200 placeholder:opacity-50 font-semibold md:w-72 lg:w-[340px] bg-transparent" />
            </div>
            <div className="">
              <div className="m-1 text-lg text-gray-200 text-semibold">Email</div>
              <input onChange={handleChange} type="email"
                id='email' name='email' className="border-b border-gray-200 focus:outline-none  text-gray-200 placeholder:opacity-50 font-semibold md:w-72 lg:w-[340px] bg-transparent" />
            </div>
            <div className="">
              <div className="m-1 text-lg text-gray-200 text-semibold">Password</div>
              <input onChange={handleChange} type="password"
                id='password' name='password' className="border-b border-gray-200 focus:outline-none  text-gray-200 placeholder:opacity-50 font-semibold md:w-72 lg:w-[340px] bg-transparent" />
            </div>
            <div className="">
              <div className="m-1 text-lg text-gray-200 text-semibold">Confirm Password</div>
              <input onChange={handleChange} type="password"
                id='confirmPassword' name='confirmPassword' className="border-b border-gray-200 focus:outline-none  text-gray-200 placeholder:opacity-50 font-semibold md:w-72 lg:w-[340px] bg-transparent" />
            </div>

          </div>
          <div className="text-center mt-7">
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              transition={Bounce} />
            <button type='submit'
              className="uppercase px-24 md:px-[118px] lg:px-[140px] py-2 rounded-md text-white bg-gradient-to-t from-stone-900 via-blue-900 to-blue-600  font-medium ">Sign Up</button>
          </div>
        </div>
      </form>
      {/* <div className="text-center my-6 flex flex-col">
      <a href="/forgot" className="text-sm font-medium text-gray-400 hover:text-blue-500 m-1">Forgot
        Password ? </a> 
     <a href="/signup" className="text-sm font-bold text-gray-400 hover:text-blue-500 m-1">
        Not a User? Create New Account </a>
    </div> */}

    </div>
  )
}

export default Signup