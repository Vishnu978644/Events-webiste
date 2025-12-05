// models/bgalleryModel.js
import mongoose from "mongoose";

const bgallerySchema = new mongoose.Schema({
    img: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: false, // ✅ CORRECTION: Must be false to allow saving without video
        default: "" 
    }
});

export default mongoose.model("bgallery", bgallerySchema);