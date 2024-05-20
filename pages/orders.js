import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Orders = ({ orders }) => {
  const router = useRouter();
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!localStorage.getItem('token')) {
          router.push('/');
        } else {
          let response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/myorders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: localStorage.getItem('token') }),
          });
          if (response.ok) {
            let data = await response.json();
            setUserOrders(data.orders);
          } else {
            console.error("Failed to fetch orders");
          }
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className='container mx-auto'>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <h1 className='font-bold px-8 py-8 text-xl text-center'>My Orders</h1>
        {userOrders.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No orders found.</div>
        ) : (
          <table className="w-full text-sm text-left rtl:text-right text-blue-500 dark:text-blue-400">
            <thead className="text-xs text-blue-700 uppercase dark:text-blue-400">
              <tr>
                <th scope="col" className="px-6 py-3 bg-blue-50 dark:bg-blue-800">
                  Product name
                </th>
                <th scope="col" className="px-6 py-3">
                  Color
                </th>
                <th scope="col" className="px-6 py-3 bg-blue-50 dark:bg-blue-800">
                  Category
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {userOrders.map((order) => (
                <tr key={order.id} className="border-b border-blue-200 dark:border-blue-700">
                  <th scope="row" className="px-6 py-4 font-medium text-blue-900 whitespace-nowrap bg-blue-50 dark:text-white dark:bg-blue-800">
                    {order.productName}
                  </th>
                  <td className="px-6 py-4">
                    {order.color}
                  </td>
                  <td className="px-6 py-4 bg-blue-50 dark:bg-blue-800">
                    {order.category}
                  </td>
                  <td className="px-6 py-4">
                    ${order.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};


export default Orders;
