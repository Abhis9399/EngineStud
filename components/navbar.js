import { Fragment, useRef, useState } from 'react';
import { FaCartShopping } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { BsFillBagCheckFill } from "react-icons/bs";
import { MdAccountCircle } from "react-icons/md";
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar({ logout, user, cart, addtoCart, removefromCart, clearCart, subTotal }) {

  const [dropdown, setDropdown] = useState(false)

  const toggleCart = () => {
    if (ref.current.classList.contains('translate-x-full')) {
      ref.current.classList.remove('translate-x-full');
      ref.current.classList.add('translate-x-0');
    } else if (ref.current.classList.contains('translate-x-0')) {
      ref.current.classList.remove('translate-x-0');
      ref.current.classList.add('translate-x-full');
    }
  };

  const ref = useRef();

  return (
    <div className="mx-auto bg-white flex items-center justify-between p-6 lg:px-8 shadow-md sticky top-0 z-10" aria-label="Global">
      <div className="flex lg:flex-1">
        <a href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">EngineStud</span>
          <Image src="/A&k.png" alt="navlogo" width={60} height={20} />
        </a>
      </div>

      <div className="hidden lg:flex lg:gap-x-12">
        <div className="relative">
          <Link href="/tshirts">
            <button type="button" className="hover:text-blue-600 flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900" aria-expanded="false">
              T-Shirts
              <svg className="h-5 w-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </Link>
        </div>

        <Link href="/stationary">
          <button type="button" className="hover:text-blue-600 flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900" aria-expanded="false">
            Stationary
          </button>
        </Link>

        <Link href="/books">
          <button type="button" className="hover:text-blue-600 flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900" aria-expanded="false">
            Books
          </button>
        </Link>
      </div>

      <div className='flex lg:flex-1 lg:justify-end cursor-pointer'>
        <span onMouseOver={() => { setDropdown(true) }} onMouseLeave={() => { setDropdown(false) }}>
          {dropdown && (
            <div onMouseOver={() => { setDropdown(true) }} onMouseLeave={() => { setDropdown(false) }} className="absolute right-16 bg-white shadow-lg border top-14 rounded-md px-5">
              <ul>
                <Link href={'/myaccount'}><li className='py-1 text-sm hover:text-blue-400'>My Account</li></Link>
                <Link href={'/orders'}><li className='py-1 text-sm hover:text-blue-400'>Orders</li></Link>
                <li onClick={logout} className='py-1 text-sm hover:text-blue-400'>Logout</li>
              </ul>
            </div>
          )}
          {user.value &&
            <MdAccountCircle className='text-xl md:text-2xl mx-2' />
          } </span>
        {!user.value && (
          <Link href={'/login'}>
            <button className='flex mr-1 mx-2 px-1 text-white bg-black text-md focus:outline-none hover:bg-blue-600 rounded'>Login</button>
          </Link>
        )}
        <FaCartShopping onClick={toggleCart} className='text-xl text-center md:text-2xl mx-2' />
      </div>


      <div ref={ref} className={`w-72 h-[100vh] sideCart overflow-y-scroll absolute top-0 right-0 bg-pink-100 py-10 px-8 transform transition-transform ${Object.keys(cart).length !== 0 ? 'translate-x-0' : 'translate-x-full'} z-10`}>
        <h2 className='font-bold text-xl text-center'>Shopping Cart</h2>
        <span onClick={toggleCart} className='absolute top-5 right-2 cursor-pointer text-2xl text-pink-500'><IoIosCloseCircle /></span>
        <ul className='list-decimal font-semibold'>
          {Object.keys(cart).length === 0 && <div className='my-4 font-semibold'>Your Cart is empty! </div>}
          {Object.keys(cart).map((k) => (
            <li key={k}>
              <div className=" item flex my-5">
                <div className='w-2/3 font-semibold'>{cart[k].name}({cart[k].size}/{cart[k].variant}) </div>
                <div className='flex items-center justify-center w-1/3 font-semibold'>
                  <AiFillMinusCircle onClick={() => { removefromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} className='cursor-pointer text-pink-500' />
                  <span className='mx-2 text-sm'>{cart[k].qty}</span>
                  <AiFillPlusCircle onClick={() => { addtoCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} className='cursor-pointer text-pink-500' />
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="total my-1">Total: ₹{subTotal}</div>
        <div className="flex">
          <Link href={'/checkout'}>
            <button className="flex mr-1 mt-16 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-green-600 rounded text-lg">
              <BsFillBagCheckFill className='m-1' />Checkout
            </button>
          </Link>
          <button onClick={clearCart} className="flex mr-1 mt-16 text-white bg-pink-500 border-0 py-2 focus:outline-none hover:bg-pink-600 rounded text-lg">Clear Cart</button>
        </div>
      </div>
    </div>
  );
}
