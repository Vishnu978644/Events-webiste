import mongoose from "mongoose";

const servicePackageSchema = new mongoose.Schema({
    // Head: The sub-title or label above the main title (e.g., "International Explorer" on the middle card)
    head: {
        type: String,
        trim: true,
        default: "" // Not required, as the first and third cards don't have it
    },
    // Title: The main package name (e.g., "Weekend Getaway")
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true // Ensures no two packages have the exact same title
    },
    // Description: The short, descriptive text below the title (e.g., "Perfect for short, local trips...")
    description: {
        type: String,
        trim: true,
        default: "" // Not required, as the middle card doesn't have it
    },
    // Price: Stored as a Number for sorting/calculations
    price: {
        type: Number, 
        required: true,
        min: 0 
    },
    // Currency: Stores the currency code for display and calculation context
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'INR', 'GBP', 'AUD'],
        default: 'INR', // Based on the image
        trim: true
    },
    // Features: The list of bullet points included in the package
    features: { 
        type: [String], // Array of Strings
        required: true,
    },
    // Button Text: The text displayed on the call-to-action button
    buttonText: {
        type: String,
        required: true,
        trim: true
    },
    // Design/Variant Flag: A field to control the unique styling (e.g., the dark background of the middle card)
    variant: {
        type: String,
        enum: ['default', 'primary', 'secondary'], // 'default' (white), 'primary' (dark), 'secondary' (pink border/button style)
        default: 'default'
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

export default mongoose.model("ServicePackage", servicePackageSchema);