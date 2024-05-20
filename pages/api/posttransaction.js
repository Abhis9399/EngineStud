import React from 'react';
import Order from '@/models/order';
import connectDb from '@/middleware/mongo';

const handler = async (req, res) => {
    try {
        // Validate paytm checksum -- pending

        let orderInstance;

        if (req.body.STATUS === 'TXN_SUCCESS') {
            orderInstance = await Order.findOneAndUpdate(
                { orderId: req.body.ORDERID },
                { status: 'paid', paymentInfo: JSON.stringify(req.body) },
            );
        } else if (req.body.STATUS === 'PENDING') {
            orderInstance = await Order.findOneAndUpdate(
                { orderId: req.body.ORDERID },
                { status: 'pending', paymentInfo: JSON.stringify(req.body) },
            );

            // If you want to initiate shipping or any other action, do it here
        }

        // Redirect user to the order confirmation page with the order ID
        if (orderInstance) {
            res.redirect(`/order?id=${orderInstance._id}`);
        } else {
            // Handle case when order is not found or not updated
            res.status(404).json({ error: 'Order not found or not updated' });
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default connectDb(handler);
