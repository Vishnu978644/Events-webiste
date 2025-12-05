import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
    User, Mail, Phone, Calendar, Clock,
    CheckCircle, CreditCard, Tag, DollarSign,
    List, Lock, Check, X, Loader, AlertTriangle
} from 'lucide-react';

// --- Constants ---
const BOOKING_API_URL = "http://localhost:5000/payment";
const STATIC_PLACEHOLDER_IMAGE = "https://via.placeholder.com/64x64/2a2a2a/ffffff?text=Service";

// --- Helper Functions ---
const formatCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return 'N/A';
    // Using Indian Rupee locale for formatting
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

// --- Image Component with Fallback ---
const ImageWithFallback = ({ src, alt, className }) => {
    const initialSrc = src || STATIC_PLACEHOLDER_IMAGE;
    const [imgSrc, setImgSrc] = useState(initialSrc);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        // Reset image source and error state when the source changes
        setImgSrc(src || STATIC_PLACEHOLDER_IMAGE);
        setHasError(false);
    }, [src]);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={() => {
                // Only set fallback if the error hasn't been set already
                if (!hasError) {
                    setImgSrc(STATIC_PLACEHOLDER_IMAGE);
                    setHasError(true);
                }
            }}
        />
    );
};

// --- Main Booking Component ---
const Booking = () => {
    const location = useLocation();
    // Safely extract vendor/service details from location state
    const vendor = location.state?.vendor || location.state?.service || location.state || {};
    const isVendorDataAvailable = vendor.name || vendor.title || vendor.title1 || vendor.place || vendor.img;

    // Data mapping for consistency
    const image = vendor.img || vendor.img1 || vendor.imgURL || vendor.image || STATIC_PLACEHOLDER_IMAGE;
    const title = vendor.name || vendor.title || vendor.title1 || vendor.place || "Default Booking Service";
    const description = vendor.desc || vendor.designer || vendor.rev || vendor.description || "Professional service designed for exceptional results";
    const price = vendor.price || "₹1,500"; // Display price string

    const packageDetails = vendor.packageDetails || [
        "Dedicated consultation time",
        "High-priority scheduling",
        "Full support and revisions included",
        "Access to premium materials/tools"
    ];

    // Function to extract numeric price from a string (e.g., "₹1,500" -> 1500)
    const getNumericPrice = (p) => {
        const cleaned = String(p || 0).replace(/[^\d.]/g, '');
        return parseFloat(cleaned) || 0;
    };

    // State management
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", date: "", time: "" });
    const [paymentMode, setPaymentMode] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [paymentError, setPaymentError] = useState(false);
    const [bookingsList, setBookingsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    // Fetch confirmed bookings from the API
    const fetchBookings = useCallback(async () => {
        setIsLoading(true);
        setApiError(null);
        try {
            const response = await fetch(BOOKING_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Sort by transaction date descending
            data.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
            setBookingsList(data);
        } catch (err) {
            console.error("Fetch Bookings Error:", err);
            setApiError(err.message || "Failed to load confirmed bookings.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch bookings on initial load
    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    // Form change handlers
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handlePaymentChange = (mode) => {
        setPaymentMode(mode);
        setPaymentError(false);
    };

    // Handle booking submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!paymentMode) return setPaymentError(true);
        
        setIsLoading(true);
        setApiError(null);

        const timestamp = Date.now();
        const payload = {
            paymentId: `PAY-${timestamp}`,
            bookingId: `BOOK-${timestamp}`,
            amountPaid: getNumericPrice(price),
            paymentMethod: paymentMode,
            transactionRef: 'REF_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
            transactionDate: new Date().toISOString(),

            // CLIENT DETAILS
            customerName: formData.name,
            clientEmail: formData.email,
            clientPhone: formData.phone,

            // BOOKING DATE/TIME
            bookingDate: formData.date,
            bookingTime: formData.time,

            serviceTitle: title,
            servicePrice: price,
            serviceImage: image,
        };

        try {
            const response = await fetch(BOOKING_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create booking on the server.");
            }

            setSubmitted(true);
            // Refresh the list to include the new booking
            fetchBookings(); 
        } catch (error) {
            console.error("Booking failed:", error);
            setApiError(error.message || "Booking failed due to a network or server error.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle booking deletion
    const handleDelete = async (bookingId) => {
        setApiError(null);
        try {
            const response = await fetch(`${BOOKING_API_URL}/${bookingId}`, { method: "DELETE" });
            if (!response.ok) {
                 throw new Error(`Failed to delete booking. Status: ${response.status}`);
            }
            // Refresh the list after successful deletion
            fetchBookings();
        } catch (error) {
            console.error("Deletion failed:", error);
            setApiError(error.message || "Failed to delete booking.");
        }
    };

    // Reusable Input Field Component
    const InputField = ({ Icon, name, placeholder, type = "text", value, onChange, required }) => (
        <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 w-4 h-4" />
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full border border-gray-200 pl-9 pr-2 py-2 rounded-lg text-sm bg-gray-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150"
            />
        </div>
    );

    // --- Confirmed Bookings List Component (FIXED) ---
    const ConfirmedBookingsList = () => {
        return (
            <div className="w-[900px] mx-auto mt-20 p-4 bg-white rounded-xl shadow-2xl">
                <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center">
                    <List className="w-6 h-6 mr-2 text-pink-500" /> All Confirmed Bookings
                </h2>

                {isLoading && (
                    <div className="flex justify-center items-center p-8">
                        <Loader className="w-6 h-6 animate-spin text-indigo-500 mr-2" />
                        <p className="text-gray-500">Loading bookings...</p>
                    </div>
                )}
                
                {apiError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        <span>Error: {apiError}</span>
                    </div>
                )}

                {!isLoading && bookingsList.length === 0 && !apiError && (
                    <p className="text-center text-gray-500 p-8">No bookings confirmed yet.</p>
                )}

                <div className="space-y-4 max-h-[400px] overflow-y-auto">

                    {bookingsList.map((booking) => {
                        const serviceTitle = booking.serviceTitle || "Service Title Missing";
                        const serviceImage = booking.serviceImage || STATIC_PLACEHOLDER_IMAGE;

                        // CORRECTED ACCESS: These fields now reliably display the data saved in the POST request.
                        const clientName = booking.customerName || "No Name";
                        const clientEmail = booking.clientEmail || "No Email";
                        const clientPhone = booking.clientPhone || "No Phone";

                        const bookingDate = booking.bookingDate || "No Date";
                        const bookingTime = booking.bookingTime || "No Time";

                        const servicePrice = formatCurrency(booking.amountPaid);

                        return (
                            <div key={booking._id} className="border border-green-200 p-4 rounded-lg bg-green-50 flex justify-between items-start relative transition hover:shadow-md">

                                <button
                                    onClick={() => handleDelete(booking._id)}
                                    className="absolute top-1 right-1 p-1 text-red-500 bg-white rounded-full hover:text-red-700 transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="flex items-start gap-4 flex-1 pr-8">
                                    <ImageWithFallback
                                        src={serviceImage}
                                        alt={serviceTitle}
                                        className="w-16 h-16 rounded-lg object-cover border-2 border-green-300"
                                    />

                                    <div className="space-y-1">
                                        <p className="text-lg font-bold text-green-700">{serviceTitle}</p>

                                        {/* Client Name Display (FIXED) */}
                                        <p className="text-sm font-semibold flex items-center">
                                            <User className="w-4 h-4 mr-1 text-indigo-500" />
                                            **{clientName}**
                                        </p>

                                        {/* Client Email Display (FIXED) */}
                                        <p className="text-sm text-gray-600 flex items-center">
                                            <Mail className="w-4 h-4 mr-1 text-gray-500" />
                                            {clientEmail}
                                        </p>

                                        {/* Client Phone Display (FIXED) */}
                                        <p className="text-sm text-gray-600 flex items-center">
                                            <Phone className="w-4 h-4 mr-1 text-gray-500" />
                                            {clientPhone}
                                        </p>

                                        <p className="text-sm font-semibold flex items-center mt-1 pt-1 border-t border-green-100">
                                            <Calendar className="w-4 h-4 mr-1 text-pink-500" />
                                            {bookingDate} at <Clock className="w-4 h-4 mx-1 text-pink-500" /> {bookingTime}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right space-y-3">
                                    <p className="font-bold text-indigo-600 text-xl">{servicePrice}</p>
                                    <p className="text-xs text-gray-500 flex items-center justify-end">
                                        <CreditCard className="w-3 h-3 mr-1" /> Paid via {booking.paymentMethod}
                                    </p>
                                    <p className="text-xs text-gray-400">ID: {booking.bookingId}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };
    // --- End Confirmed Bookings List Component ---

    // Display the list of confirmed bookings after submission
    if (submitted) return (
        <div className="w-[900px] mx-auto mt-8">
            <ConfirmedBookingsList />
        </div>
    );

    // Display the main booking form
    return (
        <div className="w-[900px] mx-auto mt-20 mb-8 flex items-center justify-center">
            <div className="w-[880px] h-[580px] bg-white rounded-2xl shadow-2xl p-4 flex overflow-hidden">

                {/* Left Panel: Service Details */}
                <div className="w-1/3 border-r pr-3 flex flex-col">
                    <ImageWithFallback src={image} alt={title} className="w-full h-40 rounded-lg object-cover" />
                    <h3 className="text-lg font-bold text-pink-600 mt-3 flex items-center">
                        <Tag className="w-4 h-4 mr-1" /> {title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 flex-shrink-0">{description}</p>

                    <div className="mt-3 bg-indigo-50 p-3 rounded-lg flex-shrink-0">
                        <p className="text-xl font-bold text-indigo-700 flex items-center justify-between">
                            <span>Total Price:</span> 
                            <span className="text-pink-600"><DollarSign className="w-5 h-5 inline mr-1" /> {price}</span>
                        </p>
                    </div>

                    <h4 className="text-sm font-semibold text-gray-700 mt-3 mb-1">Package Includes:</h4>
                    <ul className="mt-1 space-y-1 text-xs text-gray-600 overflow-y-auto custom-scrollbar flex-grow">
                        {packageDetails.map((d, i) => (
                            <li key={i} className="flex items-start">
                                <Check className="w-3 h-3 mt-1 mr-2 text-green-500 flex-shrink-0" /> {d}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Panel: Booking Form */}
                <form onSubmit={handleSubmit} className="flex-1 pl-4 flex flex-col justify-between">

                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        <h1 className="text-center text-[32px] font-extrabold text-indigo-800 mb-3 border-b pb-2">
                            <CheckCircle className="inline w-7 h-7 mr-2 text-pink-600" />
                            Secure Your Appointment
                        </h1>

                        {/* Booking Date and Time */}
                        <h3 className="font-bold text-indigo-700">1. Select Date & Time</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <InputField Icon={Calendar} name="date" type="date" placeholder="Booking Date" value={formData.date} onChange={handleChange} required />
                            <InputField Icon={Clock} name="time" type="time" placeholder="Booking Time" value={formData.time} onChange={handleChange} required />
                        </div>

                        {/* Client Details */}
                        <h3 className="font-bold text-indigo-700 mt-4">2. Your Contact Information</h3>
                        <div className="space-y-3">
                            <InputField Icon={User} name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                            <InputField Icon={Mail} name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                            <InputField Icon={Phone} name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                        </div>

                        {/* Payment Mode */}
                        <div className="mt-4">
                            <h3 className="font-bold text-indigo-700 mb-2">3. Select Payment Mode</h3>
                            <div className="flex flex-wrap gap-2">
                                {["GPay", "PayPal", "UPI", "Card"].map((mode) => (
                                    <button
                                        key={mode}
                                        type="button"
                                        onClick={() => handlePaymentChange(mode)}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition duration-200 flex items-center ${paymentMode === mode ? "bg-pink-600 text-white border-pink-600 shadow-md" : "bg-gray-100 text-indigo-700 border-gray-200 hover:border-indigo-400"}`}
                                    >
                                        <CreditCard className="inline w-4 h-4 mr-2" /> {mode}
                                    </button>
                                ))}
                            </div>
                            {paymentError && <p className="text-xs text-red-600 mt-1 flex items-center"><AlertTriangle className="w-3 h-3 mr-1" /> Please select a payment mode to proceed.</p>}
                        </div>
                    </div>

                    {/* Submit Button and Loading/Error State */}
                    <div className="pt-3 border-t mt-4 flex-shrink-0">
                        {apiError && (
                            <div className="bg-red-100 text-red-700 text-xs p-2 rounded mb-2 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                API Error: {apiError}
                            </div>
                        )}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full py-3 text-white font-bold rounded-lg shadow-lg transition duration-200 flex items-center justify-center ${isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                                    Processing Payment...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5 mr-2" />
                                    Confirm Booking & Pay {price}
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Booking;