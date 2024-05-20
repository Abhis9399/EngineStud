import product from '@/models/product';
import { useRouter } from 'next/router'
import { useState } from 'react';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react'

const Post = ({ addtoCart, buyNow, fetchedProduct, fetchedVariants }) => {

  const router = useRouter();
  const { slug } = router.query
  const [pin, setPin] = useState('')
  const [Service, setService] = useState(null)


  const checkServiceAvailability = async () => {
    let pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`)
    let pinJson = await pins.json()
    if (Object.keys(pinJson).includes(pin)) {
      setService(true)
      toast.success('Your Pincode is Serviceable!', {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
    else {
      setService(false)
      toast.error('Sorry! Pincode  not Serviceable', {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }

  const onChangePin = (e) => {
    setPin(e.target.value)
  }

  const [color, setColor] = useState(fetchedProduct.color)
  const [size, setSize] = useState(fetchedProduct.size)

  const refreshVariants = (newColor, newSize) => {
    setColor(newColor);
    setSize(newSize);
    let url = `${process.env.NEXT_PUBLIC_HOST}/product/${fetchedVariants[newColor][newSize].slug}`;
    router.push(url); // Use router.push instead of window.location for better Next.js integration
  };
  

  return (
    <><section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-16 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          {/* https://m.media-amazon.com/images/I/713n+TxyfCL._SX569_.jpg */}
          <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto px-24 object-cover object-center rounded" src={fetchedProduct.img} />
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">EngineStud</h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{fetchedProduct.title}({fetchedProduct.size}/{fetchedProduct.color})</h1>
            <p className="leading-relaxed">{fetchedProduct.desc}</p>
            <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
              <div className="flex">
                <span className="mr-3">Color</span>
                {Object.keys(fetchedVariants).includes('Gray') && Object.keys(fetchedVariants['Gray']).includes(size) && <button onClick={() => { refreshVariants('Gray', size) }} className={`border-2  ml-1 bg-gray-700 rounded-full w-6 h-6 focus:outline-none ${color === 'Gray' ? 'border-black' : 'border-gray-300'}`}></button>}
                {Object.keys(fetchedVariants).includes('Red') && Object.keys(fetchedVariants['Red']).includes(size) && <button onClick={() => { refreshVariants('Red', size) }} className={`border-2  ml-1 bg-red-500 rounded-full w-6 h-6 focus:outline-none ${color === 'Red' ? 'border-black' : 'border-gray-300'}`}></button>}
                {Object.keys(fetchedVariants).includes('White') && Object.keys(fetchedVariants['White']).includes(size) && <button onClick={() => { refreshVariants('White', size) }} className={`border-2 ml-1 bg-white rounded-full w-6 h-6 focus:outline-none ${color === 'White' ? 'border-black' : 'border-gray-300'}`}></button>}
                {Object.keys(fetchedVariants).includes('Black') && Object.keys(fetchedVariants['Black']).includes(size) && <button onClick={() => { refreshVariants('Black', size) }} className={`border-2  ml-1 bg-black rounded-full w-6 h-6 focus:outline-none ${color === 'Black' ? 'border-black' : 'border-gray-300'}`}></button>}
                {Object.keys(fetchedVariants).includes('Purple') && Object.keys(fetchedVariants['Purple']).includes(size) && <button onClick={() => { refreshVariants('Purple', size) }} className={`border-2  ml-1 bg-purple-500 rounded-full w-6 h-6 focus:outline-none ${color === 'Purple' ? 'border-black' : 'border-gray-300'}`}></button>}
                {Object.keys(fetchedVariants).includes('Blue') && Object.keys(fetchedVariants['Blue']).includes(size) && <button onClick={() => { refreshVariants('Blue', size) }} className={`border-2  ml-1 bg-blue-500 rounded-full w-6 h-6 focus:outline-none ${color === 'Blue' ? 'border-black' : 'border-gray-300'}`}></button>}
              </div>
              <div className="flex ml-6 items-center">
                <span className="mr-3">Size</span>
                <div className="relative">
                  <select value={size} onChange={(e) => { refreshVariants(color, e.target.value) }} className="rounded border appearance-none  py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10">
                    {Object.keys(fetchedVariants[color]).includes('Free-size') && <option value={'Free-size'}>Free-size</option>}

                    {Object.keys(fetchedVariants[color]).includes('S') && <option value={'S'}>S</option>}

                    {Object.keys(fetchedVariants[color]).includes('M') && <option value={'M'}>M</option>}

                    {Object.keys(fetchedVariants[color]).includes('L') && <option value={'L'}>L</option>}

                    {Object.keys(fetchedVariants[color]).includes('XL') && <option value={'XL'}>XL</option>}

                  </select>
                  <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex">
              <span className="title-font font-medium text-2xl text-gray-900">₹{fetchedProduct.price}</span>
              <button onClick={() => { buyNow(slug, 1, fetchedProduct.price, fetchedProduct.title, fetchedProduct.size, fetchedProduct.color) }} className="flex text-sm ml-8 text-white bg-indigo-500 border-0 py-2 px-2 md:px-6 focus:outline-none hover:bg-indigo-600 rounded">Buy Now</button>
              <button onClick={() => { addtoCart(slug, 1, fetchedProduct.price, fetchedProduct.title, fetchedProduct.size, fetchedProduct.color) }} className="flex text-sm ml-4 text-white bg-indigo-500 border-0 py-2 px-2 md:px-6 focus:outline-none hover:bg-indigo-600 rounded">Add to Cart</button>
            </div>
            <div className="pin flex mt-6">
              <input onChange={onChangePin} className='px-2 border-2 border-indigo-400 rounded-md' type="text" placeholder='check your pincode here' />
              <button onClick={checkServiceAvailability} className='flex ml-4 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded'>Check</button>
              <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce} />
            </div>
            {!Service && Service != null && <div className="text-red-700 text-sm mt-3">
              Sorry! We do not deliver to this pincode yet.🥺
            </div>}
            {Service && Service != null && <div className="text-green-700 text-sm mt-3">
              Yay! This pincode is Serviceable.🥳
            </div>}
          </div>
        </div>
      </div>
    </section></>
  )
}

export async function getServerSideProps(context) {
  let fetchedProduct = {};
  let fetchedVariants = [];
  let colorSizeSlug = {};

  // Fetch the main product
  fetchedProduct = await product.findOne({ slug: context.query.slug });

  // Fetch variants based on the main product's title
  fetchedVariants = await product.find({ title: fetchedProduct.title });

  // Create color-size-slug mapping
  for (let item of fetchedVariants) {
    if (Object.keys(colorSizeSlug).includes(item.color)) {
      colorSizeSlug[item.color][item.size] = { slug: item.slug };
    } else {
      colorSizeSlug[item.color] = {};
      colorSizeSlug[item.color][item.size] = { slug: item.slug };
    }
  }

  return {
    props: { fetchedProduct: JSON.parse(JSON.stringify(fetchedProduct)), fetchedVariants: JSON.parse(JSON.stringify(colorSizeSlug)) },
  };
}

export default Post