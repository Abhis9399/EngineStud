import user from "../../models/user";
import connectDb from "../../middleware/mongo";

var CryptoJS = require("crypto-js")

const handler = async (req, res) => {
    if (req.method == 'POST') {
        console.log(req.body);

        const { name, email, password, confirmPassword } = req.body


        let u = new user({ name, email, password: CryptoJS.AES.encrypt(req.body.password, process.env.AES_SECRET).toString(), confirmPassword: CryptoJS.AES.encrypt(req.body.confirmPassword, process.env.AES_SECRET).toString() })
        await u.save()

        res.status(200).json({ success: "Success" });
    } else {
        res.status(400).json({ error: "This method is not allowed" });
    }
};

export default connectDb(handler);
