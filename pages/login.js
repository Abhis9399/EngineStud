import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/')
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { email, password };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const response = await res.json();

      if (response.success) {
        localStorage.setItem('token', response.token)
        toast.success('You are Successfully logged in!', {
          position: 'bottom-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Bounce,
        });

        setTimeout(() => {
          router.push(process.env.NEXT_PUBLIC_HOST)
        }, 1000);


        setEmail('');
        setPassword('');

      } else {
        toast.error('Invalid Credentials', {
          position: 'bottom-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.', {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} method='POST'>
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-t from-black via-blue-600 to-blue-900">
        <div className="md:w-auto w-[90%] p-8 rounded-xl m-4 flex flex-col items-center shadow-lg border border-gray-400 opacity-90">
          <div className="text-xl cursor-pointer flex flex-col justify-center items-center mt-5 md:mt-0">
            <img src="/A&k.png" alt="myLogo" width={'80vw'} />
            <h1 className="font-semibold text-3xl text-gray-200 m-2">Log In</h1>
          </div>
          <div className="flex flex-col justify-center items-center mt-10 md:mt-4 space-y-6 md:space-y-8">
            <div className="">
              <div className="m-1 text-lg text-gray-200 text-semibold">Email</div>
              <input
                onChange={handleChange}
                value={email}
                type="text"
                name="email"
                id="email"
                className="border-b border-gray-200 focus:outline-none text-gray-200 placeholder:opacity-50 font-semibold md:w-72 lg:w-[340px] bg-transparent"
              />
            </div>
            <div className="">
              <div className="m-1 text-lg text-gray-200 text-semibold">Password</div>
              <input
                onChange={handleChange}
                value={password}
                type="password"
                name="password"
                id="password"
                className="border-b border-gray-200 focus:outline-none text-gray-200 placeholder:opacity-50 font-semibold md:w-72 lg:w-[340px] bg-transparent"
              />
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
              transition={Bounce}
            />
            <button
              type="submit"
              className="uppercase px-24 md:px-[118px] lg:px-[140px] py-2 rounded-md text-white bg-gradient-to-t from-stone-900 via-blue-900 to-blue-600 font-medium"
            >
              Login
            </button>
          </div>
        </div>
        <div className="text-center my-6 flex flex-col">
          <Link href={'forgot'} className="text-sm font-medium text-gray-400 hover:text-blue-500 m-1">
            Forgot Password?
          </Link>
          <Link href={'/signup'}
            className="text-sm font-bold text-gray-400 hover:text-blue-500 m-1">
            Not a User? Create New Account
          </Link>
        </div>
      </div>
    </form>
  );
};

export default Login;
