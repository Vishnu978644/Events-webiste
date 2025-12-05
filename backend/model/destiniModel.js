import mongoose from "mongoose";

const destiniSchema = new mongoose.Schema({
    pass: { type: String, required: true },
    imgURL: { type: String, required: true }, // Mongoose Name
    title: { type: String, required: true },     // Mongoose Name
    description: { type: String, required: true }, // Mongoose Name
    place: { type: String, required: true },
    price: { type: String, required: true },
    gallery: { type: [String], required: true },
});

export default mongoose.model("Destini", destiniSchema);

