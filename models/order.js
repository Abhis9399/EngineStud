const mongoose = require("mongoose")
const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  orderId: { type: String, required: true },
  paymentInfo: { type: String, default: '' },
  products: { type: Object, require: true },
  address: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'initiated', required: true },

}, { timestamps: true });

mongoose.models = {}
export default mongoose.model("Order", OrderSchema)