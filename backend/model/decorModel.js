import mongoose from "mongoose"

const decorSchema = new mongoose.Schema({
   
    title: {
        type: String,
        required: true,
        trim: true,
    },

    price: {
       
        type: String,
        required: true
    },
    
    description: {
        type: String,
        required: true,
    },

    mainImageUrl: {
        type: String,
        required: true
    },

    thumbnailUrls: {
        type: [String], // Array of strings for additional image URLs
        required: true,
        default: [], // Best practice to initialize array fields with a default empty array
    },
}, {
    // 💡 Best Practice: Automatically adds 'createdAt' and 'updatedAt' fields
    timestamps: true 
});

// Export the Mongoose model
export default mongoose.model("Decor", decorSchema)


