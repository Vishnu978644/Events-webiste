import mongoose from "mongoose";

const typeSchema = new mongoose.Schema({
    img: { 
        type: String, 
        required: true // Must be provided (Image URL 1)
    },
    img1: { 
        type: String, 
        required: false, // ⬅️ FIX: Changed to optional
        default: null      // Recommended: Set a default value 
    },
    title: { 
        type: String, 
        required: true // Must be provided (Heading)
    },
    details: { 
        type: String, 
        required: false, // ⬅️ Recommended: Make details/description optional
        default: "" 
    }
});

export default mongoose.model("Type", typeSchema);