import User from "../../models/user";
import connectDb from "../../middleware/mongo";
var jwt = require('jsonwebtoken');

var CryptoJS = require("crypto-js")

const handler = async (req, res) => {

    if (req.method === 'POST') {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ success: false, error: "Email and password are required" });
            }

            const existingUser = await User.findOne({ email });
            // Decrypt
            var bytes = CryptoJS.AES.decrypt(existingUser.password, process.env.AES_SECRET);
            var originalText = bytes.toString(CryptoJS.enc.Utf8);

            if (!existingUser || originalText !== password) {
                return res.status(401).json({ success: false, error: "Invalid credentials" });
            }

            // If user exists and passwords match, return user data
            // res.status(200).json({ success: true, email: existingUser.email, name: existingUser.name });
            var token = jwt.sign({ email: existingUser.email, name: existingUser.name }, process.env.JWT_SECRET,{
                expiresIn:'2d'
            });
            res.status(200).json({ success: true, token })
        } catch (error) {
            console.error("Error in login:", error);
            res.status(500).json({ success: false, error: "Internal Server Error" });
        }
    } else {
        res.status(400).json({ success: false, error: "Invalid request method" });
    }
};

export default connectDb(handler);
