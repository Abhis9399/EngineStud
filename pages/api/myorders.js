import React from 'react';
import Order from '@/models/order';
import connectDb from '@/middleware/mongo';
import JsonWebToken from 'jsonwebtoken';

const handler = async (req, res) => {
    const token = req.body.token
    const data = JsonWebToken.verify(token, process.env.JWT_SECRET);
    let order = await Order.find({ email: data.email })
    res.status(200).json({ order });
}

export default connectDb(handler);
