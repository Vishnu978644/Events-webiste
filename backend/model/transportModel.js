import mongoose from "mongoose";


const TransportSchema = new mongoose.Schema({
  url: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
})

export default mongoose.model("Transport", TransportSchema)