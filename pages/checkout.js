import React, { useState } from 'react'
import { AiFillMinusCircle } from "react-icons/ai";
import { AiFillPlusCircle } from "react-icons/ai";
import { BsFillBagCheckFill } from "react-icons/bs";
import Head from 'next/head';
import Script from 'next/script';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Checkout = ({ cart, subTotal, removefromCart, addtoCart }) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [pincode, setPincode] = useState('')
  const [state, setState] = useState('')
  const [district, setDistrict] = useState('')
  const [disabled, setDisabled] = useState(true)


  const handleChange = async (e) => {
    if (e.target.name === 'fullName') {
      setFullName(e.target.value)
    }
    else if (e.target.name === 'email') {
      setEmail(e.target.value)
    }
    else if (e.target.name === 'address') {
      setAddress(e.target.value)
    }
    else if (e.target.name === 'phone') {
      setPhone(e.target.value)
    }
    else if (e.target.name === 'pincode') {
      const pincode = e.target.value.trim(); // Remove any whitespace
      setPincode(pincode);

      if (pincode.length === 6 && /^\d{6}$/.test(pincode)) {
        try {
          const pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`);
          const pinJson = await pins.json();

          if (Object.keys(pinJson).includes(pincode)) {
            setState(pinJson[pincode][1]);
            setDistrict(pinJson[pincode][0]);
          } else {
            setState('');
            setDistrict('');
          }
        } catch (error) {
          console.error('Error fetching pincode details:', error);
          // Handle error fetching pincode details from the API
        }
      } else {
        setState('');
        setDistrict('');
      }
    }


    setTimeout(() => {
      if (fullName.length > 3 && email.length > 3 && address.length > 3 && phone.length > 3 && pincode.length > 3) {
        setDisabled(false)
      }
      else {
        setDisabled(true)
      }
    }, 100);
  }


  const initiatePayment = async () => {
    let oid = Math.floor(Math.random() * Date.now());
    // Get a transaction token
    const data = { cart, subTotal, oid, email: email, fullName, address, phone, pincode };
    try {
      let response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const txnRes = await response.json();

        if (txnRes.success) {

          let txnToken = txnRes.txnToken;

          var config = {
            "root": "",
            "flow": "DEFAULT",
            "data": {
              "orderId": oid, /* update order id */
              "token": txnToken, /* update token value */
              "tokenType": "TXN_TOKEN",
              "amount": subTotal /* update amount */
            },
            "handler": {
              "notifyMerchant": function (eventName, data) {
                console.log("notifyMerchant handler function called");
                console.log("eventName => ", eventName);
                console.log("data => ", data);
              }
            }
          };
        }
        else {
          console.log(txnRes.error)
          localStorage.removeItem('cart')
          toast.error(txnRes.error + 'Error, In your payment issue, might payment is changed!', {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }


        // Initialize Paytm CheckoutJS
        window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
          // After successfully updating configuration, invoke JS Checkout
          window.Paytm.CheckoutJS.invoke();
        }).catch(function onError(error) {
          console.log("error => ", error);
        });
      } else {
        console.error("Failed to fetch transaction token");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };


  return (
    <div className='container m-auto'>
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <Head><meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" /></Head>
      <Script type='application/javascript' crossOrigin='anonymous' src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`} />
      <h1 className='font-bold text-center text-2xl'>Checkout</h1>
      <div className="container py-14 px-2">
        <h1 className='mx-1 px-6 font-bold text-md my-4'>Delivery Details:</h1>
        <div className="flex lg:w-2/2 w-full sm:flex-row flex-col mx-1 px-6 sm:space-x-8 sm:space-y-0 space-y-4 sm:px-12 items-end">
          <div className="relative flex-grow w-full">
            <label htmlFor="fullName" className="leading-7 text-sm text-gray-600">Full Name</label>
            <input onChange={handleChange} value={fullName} type="text" id="fullName" name="fullName" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
          <div className="relative flex-grow w-full">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
            <input onChange={handleChange} value={email} type="email" id="email" name="email" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="flex lg:w-2/2 w-full sm:flex-row flex-col mx-1 px-6 sm:space-x-8 sm:space-y-0 space-y-4 sm:px-12 items-end">
          <div className="relative flex-grow w-full">
            <label htmlFor="address" className="leading-7 text-sm text-gray-600">Address</label>
            <textarea onChange={handleChange} value={address} type='text' id="address" name="address" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="flex lg:w-2/2 w-full sm:flex-row flex-col mx-1 px-6 sm:space-x-8 sm:space-y-0 space-y-4 sm:px-12 items-end">
          <div className="relative flex-grow w-full">
            <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone Number</label>
            <input onChange={handleChange} value={phone} type="number" id="phone" name="phone" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
          <div className="relative flex-grow w-full">
            <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">Pincode(india)</label>
            <input onChange={handleChange} value={pincode} type="text" id="pincode" name="pincode" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="flex lg:w-2/2 w-full sm:flex-row flex-col mx-1 px-6 sm:space-x-8 sm:space-y-0 space-y-4 sm:px-12 items-end">
          <div className="relative flex-grow w-full">
            <label htmlFor="state" className="leading-7 text-sm text-gray-600">State</label>
            <input onChange={handleChange} value={state} type="text" id="state" name="state" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
          <div className="relative flex-grow w-full">
            <label htmlFor="district" className="leading-7 text-sm text-gray-600">District</label>
            <input onChange={handleChange} value={district} type="text" id="district" name="district" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>

        <div className="container m-auto py-14 px-2">
          <h1 className='mx-1 px-6 font-bold text-md my-4'>Review Cart Items</h1>
          <div className="sideCart  py-10 px-14  bg-pink-200">
            <ul className='list-decimal font-semibold'>
              {Object.keys(cart).length == 0 && <div className='my-4 font-semibold'>Your Cart is empty! </div>}
              {Object.keys(cart).map((k) => {
                return <li key={k}>
                  <div className=" item flex my-5">
                    <div className='w-2/3 font-semibold'>{cart[k].name}({cart[k].size}/{cart[k].variant})</div>
                    <div className='flex items-center justify-center w-1/3 font-semibold'><AiFillMinusCircle onClick={() => { removefromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} className='cursor-pointer text-pink-500' /> <span className='mx-2 text-sm'>{cart[k].qty}</span><AiFillPlusCircle onClick={() => { addtoCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} className='cursor-pointer text-pink-500' /></div>
                  </div>
                </li>
              })}
              <span className="total">Total:₹{subTotal}</span>
            </ul>
            {/* <div className="flex">
        <Link href={'/checkout'}><button className="flex mr-1 mt-16 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-green-600 rounded text-lg"><BsFillBagCheckFill className='m-1' />Checkout</button></Link> 
        <button onClick={clearCart} className="flex mr-1 mt-16 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-lg">Clear Cart</button>
      </div> */}
          </div>
        </div>
      </div>
      <button onClick={initiatePayment} disabled={disabled} className="disabled:bg-pink-300 flex mr-1 ml-14 mt-16 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-green-600 rounded text-lg"><BsFillBagCheckFill className='m-1' />Pay ₹{subTotal}</button>
    </div>
  )
}

export default Checkout