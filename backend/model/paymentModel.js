import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema({
    // --- PAYMENT/TRANSACTION DETAILS (Existing) ---
    paymentId: { type: String, required: true, unique: true },
    bookingId: { type: String, required: true },
    amountPaid: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    transactionDate: { type: Date, default: Date.now },
    transactionRef: { type: String, unique: true, required: true },
    isRead: { type: Boolean, default: false }, 

    // --- CLIENT/BOOKING DETAILS (NEWLY ADDED) ---
    customerName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String, required: true },

    // Service & Schedule Details
    serviceTitle: { type: String, required: true },
    serviceImage: { type: String }, // Assuming image URL is optional/can be null
    bookingDate: { type: String, required: true }, // Storing as String from form input
    bookingTime: { type: String, required: true }, // Storing as String from form input
})

export default mongoose.model("Payment", paymentSchema)