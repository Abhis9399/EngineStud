import React from 'react'
import product from '../models/product'
import Link from 'next/link'
const mongoose = require('mongoose');

const stationary = ({ products }) => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap -m-4 justify-center">
          {Object.keys(products).map((item) => (
            <div className="lg:w-1/5 md:w-1/2 p-4 w-full shadow-md m-5" key={products[item]._id}>
              <Link href={`/product/${products[item].slug}`}>
                <img
                  alt="ecommerce"
                  className="m-auto object-cover object-top block"
                  src={products[item].img}
                />
              </Link>
              <div className="mt-4">
                <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">Stationary</h3>
                <h2 className="text-gray-900 title-font text-lg font-medium">{products[item].title}</h2>
                <p className="mt-1 text-gray-900">₹{products[item].price}</p>
                <div className="mt-1">
                  {products[item].size.includes("Free-size") && <span className='border border-gray-300 px-1 mx-1'>Free-size</span>}
                  {/* {products[item].size.includes('M') && <span className='border border-gray-300 px-1 mx-1'>M,</span>}
                  {products[item].size.includes('L') && <span className='border border-gray-300 px-1 mx-1'>L,</span>}
                  {products[item].size.includes('XL') && <span className='border border-gray-300 px-1 mx-1'>XL,</span>}
                  {products[item].size.includes('XXL') && <span className='border border-gray-300 px-1 mx-1'>XXL</span>} */}
                </div>
                <div className="mt-1">
                  {products[item].color.includes('Red') && <button className="border-2 border-gray-300 ml-1 bg-red-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                  {products[item].color.includes('Black') && <button className="border-2 border-gray-300 ml-1 bg-black rounded-full w-6 h-6 focus:outline-none"></button>}
                  {products[item].color.includes('White') && <button className="border-2 border-gray-300 ml-1 bg-white-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                  {products[item].color.includes('Blue') && <button className="border-2 border-gray-300 ml-1 bg-blue-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                  {products[item].color.includes('Purple') && <button className="border-2 border-gray-300 ml-1 bg-purple-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export async function getServerSideProps(context) {
  await mongoose.connect("mongodb://127.0.0.1:27017/dealsfactury")
  let products = [];
  products = await product.find({category: 'Stationary'}).maxTimeMS(60000); // 60 seconds timeout
  // Logic for stationary availability and sizes
  let stationary = {};

  for (let item of products) {
    if (item.title in stationary) {
      if (!stationary[item.title].color.includes(item.color) && item.availableQty > 0) {
        stationary[item.title].color.push(item.color);
      }
      if (!stationary[item.title].size.includes(item.size) && item.availableQty > 0) {
        stationary[item.title].size.push(item.size);
      }
    } else {
      stationary[item.title] = JSON.parse(JSON.stringify(item));

      if (item.availableQty > 0) {
        stationary[item.title].color = [item.color];
        stationary[item.title].size = [item.size];
      }
    }
  }

  return {
    props: {products: JSON.parse(JSON.stringify(stationary))},
  }
}

export default stationary
