import mongoose from 'mongoose';

// Setting up the schema definition
const BridemakeupSchema = new mongoose.Schema({
    // Image URL (String)
    url: {
        type: String,
        required: [true, 'Image URL is required']
    },
    // Title/Name of the service (String)
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: 100
    },
    // Description of the service (String)
    // NOTE: Changed 'desc' to 'description' for consistency with common conventions and client-side code
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: 500
    },
    // Design/Style of the makeup package (String)
    // You might want to rename this to something clearer like 'package_name' or 'style'
    design: {
        type: String,
        required: [true, 'Design/Style field is required']
    },
    // Price of the service (Number)
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    }
}, { 
    // Mongoose option to automatically add createdAt and updatedAt fields
    timestamps: true 
});

// Exporting the Mongoose Model
export default mongoose.model('Bridemakeup', BridemakeupSchema);