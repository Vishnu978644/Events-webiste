import mongoose from "mongoose"


const bridejewel1Schema=new mongoose.Schema({
     url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

export default mongoose.model("Bridejewel1",bridejewel1Schema)