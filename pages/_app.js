import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import LoadingBar from 'react-top-loading-bar'

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [user, setUser] = useState({ value: null });
  const [key, setKey] = useState();
  const [progress, setProgress] = useState(0)
  const router = useRouter();

  useEffect(() => {

    router.events.on('routeChangeStart', () => {
      setProgress(40)
    })
    router.events.on('routeChangeComplete', () => {
      setProgress(100)
    })

    console.log("Hey I am a useEffect from _app.js");
    try {
      if (localStorage.getItem("cart")) {
        setCart(JSON.parse(localStorage.getItem("cart")));
        saveCart(JSON.parse(localStorage.getItem("cart")));
      }
    } catch (error) {
      console.error(error);
      localStorage.clear();
    }

    const token = localStorage.getItem('token')
    if (token) {
      setUser({ value: token });
    }
    setKey(Math.random());
  }, [router.query]);

  const logout = () => {
    localStorage.removeItem('token')
    setUser({ value: null })
    setKey(Math.random())
    router.push('/')
  }

  const saveCart = (myCart) => {
    localStorage.setItem("cart", JSON.stringify(myCart));
    let subt = 0;
    let keys = Object.keys(myCart);
    for (let i = 0; i < keys.length; i++) {
      subt += myCart[keys[i]].price * myCart[keys[i]].qty;
    }

    setSubTotal(subt);
  };

  const addtoCart = (itemCode, qty, price, name, size, variant) => {
    let newCart = { ...cart }; // Create a copy of cart
    if (itemCode in cart) {
      newCart[itemCode].qty = cart[itemCode].qty + qty;
    } else {
      newCart[itemCode] = { qty: 1, price, name, size, variant };
    }

    setCart(newCart);
    saveCart(newCart);
  };

  const clearCart = () => {
    setCart({});
    saveCart({});
  };

  const buyNow = (itemCode, qty, price, name, size, variant) => {
    let newCart = {}
    newCart[itemCode] = { qty: 1, price, name, size, variant };
    setCart(newCart);
    saveCart(newCart);

    router.push('/checkout');
  };

  const removefromCart = (itemCode, qty, price, name, size, variant) => {
    let newCart = { ...cart }; // Create a copy of cart
    if (itemCode in cart) {
      newCart[itemCode].qty = cart[itemCode].qty - qty;
      if (newCart[itemCode].qty <= 0) {
        delete newCart[itemCode];
      }
    }

    setCart(newCart);
    saveCart(newCart);
  };

  return (
    <>
      <LoadingBar
        color='blue'
        progress={progress}
        waitingTime={500}
        onLoaderFinished={() => setProgress(0)}
      />
      {key && <Navbar logout={logout} user={user} key={key} cart={cart} addtoCart={addtoCart} removefromCart={removefromCart} clearCart={clearCart} subTotal={subTotal} />}
      <Component cart={cart} buyNow={buyNow} addtoCart={addtoCart} removefromCart={removefromCart} clearCart={clearCart} subTotal={subTotal} {...pageProps} />
      <Footer />
    </>
  );
}
