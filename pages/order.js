import { useRouter } from 'next/router'
import React from 'react'
import mongoose from 'mongoose'
import order from '@/models/order'

const MyOrder = ({ fetchedorder }) => {
  const products=fetchedorder.products;
  const router = useRouter()
  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">Deals Factory</h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">Order Id:{fetchedorder.orderId}</h1>

            <p className="leading-relaxed mb-4">Your Order has Been successfully placed.Your payment is {fetchedorder.status}</p>
            <div class="flex mb-4">
              <a class="flex-grow  text-center  py-2 text-lg px-1">Item Type</a>
              <a class="flex-grow text-center py-2 text-lg px-1">Quantity</a>
              <a class="flex-grow text-center py-2 text-lg px-1">SubTotal</a>
            </div>
            {Object.keys(products).map((item)=>{
              return <>
            <div key={item} className="flex border-t border-gray-200 py-2">
            <span className="text-gray-500">{products[item].name}{products[item].size}/{products[item].variant}</span>
              <span className="ml-auto text-gray-900">{products[item].qty}</span>
              <span className="ml-auto text-gray-900">₹{products[item].price}</span>
            </div>
            </>
            })}
              
            <div className="flex">
              <span className="title-font font-medium text-2xl text-gray-900">Total : ₹{fetchedorder.amount}</span>
              <button className="flex ml-auto text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded">Track Order</button>

            </div>
          </div>
          <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src="https://dummyimage.com/400x400" />
        </div>
      </div>
    </section>
  )
}

export async function getServerSideProps(context) {
  await mongoose.connect("mongodb://127.0.0.1:27017/dealsfactury")

  let fetchedorder = {};

  // Fetch the main
  fetchedorder = await order.findById(context.query.id);


  return {
    props: { fetchedorder: JSON.parse(JSON.stringify(fetchedorder)) },
  };
}


export default MyOrder