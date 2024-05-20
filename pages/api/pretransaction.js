const https = require('https');
const PaytmChecksum = require('paytmchecksum'); // Make sure to import PaytmChecksum

import Order from '@/models/order'; // Updated: Use proper capitalization for model name
import connectDb from '@/middleware/mongo';
import product from '@/models/product';

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            //check if the cart is tampered with--[pending]
            let Fetchedproduct,subTotal=0;
            let cart=req.body.cart;
            for(let item in cart){
                subTotal+=cart[item].price * cart[item].qty
                Fetchedproduct=await product.findOne({slug:item})
                if(Fetchedproduct.price!=cart[item].price){
                    res.status(200).json({success:false,"error":"the price of some items in your cart has been changed,please try again"})
                    return
                }
            }
            if(subTotal!==req.body.subTotal){
                res.status(200).json({success:false,"error":"the price of some items in your cart has been changed,please try again"})
                return
            }
            // Initiate the order corresponding to this order id
            let newOrder = new Order({
                email: req.body.email,
                orderId: req.body.oid,
                address: req.body.address,
                amount: req.body.subTotal,
                products: req.body.cart
            });
            await newOrder.save();

            // Prepare Paytm parameters
            var paytmParams = {
                body: {
                    "requestType": "Payment",
                    "mid": process.env.NEXT_PUBLIC_PAYTM_MID,
                    "websiteName": "YOUR_WEBSITE_NAME", // Update with your website name
                    "orderId": req.body.oid,
                    "callbackUrl": `${process.env.NEXT_PUBLIC_HOST}/api/posttransaction`,
                    "txnAmount": {
                        "value": req.body.subTotal,
                        "currency": "INR",
                    },
                    "userInfo": {
                        "custId": req.body.email,
                        // Add more user info if needed
                    },
                },
                head: {}
            };

            // Generate checksum with correct key (Paytm Merchant Key)
            const checksum = await PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.NEXT_PUBLIC_PAYTM_MKEY);
            paytmParams.head = {
                "signature": checksum
            };
            var post_data = JSON.stringify(paytmParams);

            // Make API request to Paytm
            const requestAsync = async () => {
                return new Promise((resolve, reject) => {
                    var options = {
                        hostname: 'securegw.paytm.in',
                        port: 443,
                        path: `/theia/api/v1/initiateTransaction?mid=${process.env.NEXT_PUBLIC_PAYTM_MID}&orderId=${req.body.oid}`,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': Buffer.byteLength(post_data)
                        }
                    };

                    var response = "";
                    var post_req = https.request(options, function (post_res) {
                        post_res.on('data', function (chunk) {
                            response += chunk;
                        });

                        post_res.on('end', function () {
                            let ress=JSON.parse(response).body
                            ress.success=true
                            resolve(ress);
                        });
                    });

                    post_req.on('error', function (error) {
                        console.error('Error in API request:', error);
                        reject(error);
                    });

                    post_req.write(post_data);
                    post_req.end();
                });
            }

            // Await the API request and send response
            let paytmResponse = await requestAsync();
            res.status(200).json(paytmResponse);
        } catch (error) {
            console.error('Error in API handler:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

export default connectDb(handler);