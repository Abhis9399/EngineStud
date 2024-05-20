import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const forgot = () => {

  const router =useRouter()
  useEffect(()=>{
    if(localStorage.getItem('token')){
      router.push('/')
    }
  },[])

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-t from-black via-blue-600 to-blue-900">
    <div className=" md:w-auto w-[90%] p-8 rounded-xl  m-4 flex flex-col items-center shadow-lg border border-gray-400 opacity-90 ">
      <div className="text-xl cursor-pointer flex flex-col justify-center items-center mt-5 md:mt-0 ">
      <img src="/A&k.png" alt="myLogo" width={'80vw'} />
        <h1 className="font-semibold text-3xl text-gray-200 m-2">Create New Password</h1>
      </div>
      <div className="flex flex-col justify-center items-center mt-10 md:mt-4 space-y-6 md:space-y-8">
        <div className="">
          <div className="m-1 text-lg text-gray-200 text-semibold">Email</div>
          <input type="email"
            className="border-b border-gray-200 focus:outline-none  text-gray-200 placeholder:opacity-50 font-semibold md:w-72 lg:w-[340px] bg-transparent"/>
        </div>
        <div className="">
          <div className="m-1 text-lg text-gray-200 text-semibold">New Password</div>
          <input type="password"
            className="border-b border-gray-200 focus:outline-none  text-gray-200 placeholder:opacity-50 font-semibold md:w-72 lg:w-[340px] bg-transparent"/>
        </div>
        <div className="">
          <div className="m-1 text-lg text-gray-200 text-semibold">Confirm Password</div>
          <input type="password"
            className="border-b border-gray-200 focus:outline-none  text-gray-200 placeholder:opacity-50 font-semibold md:w-72 lg:w-[340px] bg-transparent"/>
        </div>

      </div>
      <div className="text-center mt-7">
        <button
          className="uppercase px-24 md:px-[118px] lg:px-[140px] py-2 rounded-md text-white bg-gradient-to-t from-stone-900 via-blue-900 to-blue-600  font-medium ">Reset Password</button>
      </div>
    </div>
    {/* <div className="text-center my-6 flex flex-col">
      <a href="/forgot" className="text-sm font-medium text-gray-400 hover:text-blue-500 m-1">Forgot
        Password ? </a> 
     <a href="/signup" className="text-sm font-bold text-gray-400 hover:text-blue-500 m-1">
        Not a User? Create New Account </a>
    </div> */}

  </div>
  )
}

export default forgot