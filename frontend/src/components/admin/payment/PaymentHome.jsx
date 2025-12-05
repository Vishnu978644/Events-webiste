import React, { useState, useMemo, useEffect, useContext } from "react";
import { 
    CheckCircle, Eye, XCircle, CreditCard, DollarSign, Bell, ListChecks, 
    Calendar, Clock, Tag, Search, Loader, AlertTriangle, Trash2, PlusCircle
} from "lucide-react";
import { PaymentContext } from '../../../context/PaymentContext.jsx'

// --- 1. Constants and Helper Functions (Unchanged) ---

const API_BASE_URL = "http://localhost:5000/payment"; 

// Helper function for consistent currency formatting
const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

// Helper function to get badge class based on method
const getMethodBadge = (method) => {
    switch (method) {
        case 'UPI':
            return 'bg-blue-100 text-blue-800';
        case 'Card':
        case 'Credit Card': // Added check for common variants
            return 'bg-indigo-100 text-indigo-800';
        case 'Net Banking':
            return 'bg-purple-100 text-purple-800';
        case 'Cash':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const PaymentHome = () => {
    // 💡 FIX: Consume the context correctly inside the functional component
    const { paymentData, setPaymentData } = useContext(PaymentContext);
    
    // --- 2. State Management for Data and UI ---
    const [payments, setPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState(null);

    // --- 3. Global Context Update Logic ---
    const updateGlobalStats = (latestPayments) => {
        const totalPayments = latestPayments.length;
        const totalAmount = latestPayments.reduce((sum, p) => sum + (p.amountPaid || 0), 0); 
        const unreadCount = latestPayments.filter((p) => !p.isRead).length;

        // Call the setter provided by the context
        setPaymentData({ totalPayments, totalAmount, unreadCount });
    };

    // --- 4. Data Fetching (GET API - Read) ---
    const fetchPayments = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPayments(data);
            
            // 💡 FIX: Update global context after successful fetch
            updateGlobalStats(data);

        } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to load payment data from the server.");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchPayments();
    }, []);

    // --- 5. State Update Logic (PUT API - Update Status) ---
    const markStatus = async (paymentId, newStatus) => {
        try {
            // Optimistic update
            const updatedPayments = payments.map(p =>
                p.paymentId === paymentId ? { ...p, isRead: newStatus } : p
            );
            setPayments(updatedPayments);
            // 💡 FIX: Update global context immediately
            updateGlobalStats(updatedPayments); 

            const response = await fetch(`${API_BASE_URL}/${paymentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isRead: newStatus }),
            });

            if (!response.ok) {
                // If API fails, revert the state change and update context back
                const originalPayments = payments;
                setPayments(originalPayments);
                updateGlobalStats(originalPayments);
                throw new Error("Failed to update status on server.");
            }
        } catch (err) {
            console.error("Status update failed:", err);
            setError(err.message || "Failed to mark status.");
            fetchPayments(); 
        }
    };

    const markAsRead = (id) => markStatus(id, true);
    const markAsUnread = (id) => markStatus(id, false);

    // --- 6. Delete Logic (DELETE API - Delete) ---
    const deletePayment = async (paymentId) => {
        if (!window.confirm(`Are you sure you want to delete payment ${paymentId}?`)) return;

        try {
            // Optimistic deletion
            const originalPayments = payments;
            const updatedPayments = payments.filter(p => p.paymentId !== paymentId);
            setPayments(updatedPayments);
            // 💡 FIX: Update global context immediately
            updateGlobalStats(updatedPayments);

            const response = await fetch(`${API_BASE_URL}/${paymentId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                // Revert state if API fails
                setPayments(originalPayments);
                updateGlobalStats(originalPayments);
                throw new Error("Failed to delete payment on server.");
            }
        } catch (err) {
            console.error("Delete failed:", err);
            setError(err.message || "Failed to delete payment.");
            fetchPayments(); 
        }
    };

    // --- 7. Add Logic (POST API - Create) ---
    const addMockPayment = async () => {
        const mockData = {
            paymentId: `PAY${String(payments.length + 1).padStart(3, '0')}`,
            bookingId: `BOOK${String(payments.length + 1).padStart(3, '0')}`,
            amountPaid: Math.floor(Math.random() * 5000) + 100,
            paymentMethod: ['UPI', 'Card', 'Net Banking', 'Cash'][Math.floor(Math.random() * 4)],
            transactionRef: Math.random().toString(36).substring(2, 10).toUpperCase(),
            // Ensure transactionDate is included for display
            transactionDate: new Date().toISOString(),
            isRead: false // Default
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add new payment.");
            }

            // After successful creation, re-fetch all data to refresh the list and update context
            fetchPayments();
        } catch (err) {
            console.error("Add failed:", err);
            setError(err.message || "Failed to add payment.");
        }
    };
    
    // --- 8. Computed Values (useMemo) ---
    // Dashboard Stats are taken from context, but we need local stats for the table search filter.
    const { totalPayments, totalAmount, unreadCount } = paymentData;

    // Filtered Payments (based on search term)
    const filteredPayments = useMemo(() => {
        if (!searchTerm) {
            return payments;
        }
        const lowerCaseSearch = searchTerm.toLowerCase();
        return payments.filter(p => 
            p.name?.toLowerCase().includes(lowerCaseSearch) || 
            p.paymentId?.toLowerCase().includes(lowerCaseSearch) || 
            p.email?.toLowerCase().includes(lowerCaseSearch) ||
            p.bookingId?.toLowerCase().includes(lowerCaseSearch) 
        );
    }, [payments, searchTerm]);

    // --- 9. Conditional Rendering for Loading/Error ---

    if (error) {
        return (
            <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-lg flex items-center">
                    <AlertTriangle className="w-6 h-6 mr-3" />
                    <p className="font-semibold">Error Loading Data: </p>
                    <p className="ml-2">{error}</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center">
                <Loader className="w-8 h-8 text-blue-500 animate-spin mr-3" />
                <h2 className="text-xl font-semibold text-gray-700">Loading Dashboard Data...</h2>
            </div>
        );
    }
    
    // --- 10. Main Component Render ---
    return (
        <div className="p-8 bg-gray-50 min-h-screen">

            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2 flex items-center">
                <DollarSign className="w-7 h-7 mr-2 text-green-600" />
                Payment Dashboard
            </h1>

            {/* 💳 Summary Cards (Uses context state now) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Payments */}
                <div className="bg-white shadow-xl rounded-xl p-6 border-l-4 border-blue-500 hover:shadow-2xl transition duration-300">
                    <h2 className="text-sm font-medium text-gray-500 uppercase flex items-center">
                        <CreditCard size={18} className="mr-2 text-blue-400" /> Total Payments
                    </h2>
                    <p className="text-3xl font-bold mt-2 text-blue-800">{totalPayments}</p>
                </div>

                {/* Total Amount */}
                <div className="bg-white shadow-xl rounded-xl p-6 border-l-4 border-green-500 hover:shadow-2xl transition duration-300">
                    <h2 className="text-sm font-medium text-gray-500 uppercase flex items-center">
                        <DollarSign size={18} className="mr-2 text-green-400" /> Total Revenue
                    </h2>
                    <p className="text-3xl font-bold mt-2 text-green-800">{formatCurrency(totalAmount)}</p>
                </div>

                {/* Unread Payments */}
                <div className="bg-white shadow-xl rounded-xl p-6 border-l-4 border-red-500 hover:shadow-2xl transition duration-300">
                    <h2 className="text-sm font-medium text-gray-500 uppercase flex items-center">
                        <Bell size={18} className="mr-2 text-red-400 animate-pulse" /> Unread Notifications
                    </h2>
                    <p className="text-3xl font-bold mt-2 text-red-800">{unreadCount}</p>
                </div>
            </div>

            {/* --- Search, Header, and Add Button --- */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-700 flex items-center">
                    <ListChecks className="w-5 h-5 mr-2 text-pink-500" />
                    Payment Transactions ({filteredPayments.length} of {payments.length})
                </h2>
                
                <div className="flex items-center space-x-4">
                    {/* Add Mock Payment Button */}
                    <button
                        onClick={addMockPayment}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150"
                        title="Add a New Mock Payment"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Add Payment
                    </button>

                    {/* Search Bar */}
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by ID, Name, or Email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        />
                    </div>
                </div>
            </div>
            {/* --- End Search and Header --- */}


            {/* 📊 Payment Table */}
            <div className="overflow-x-auto bg-white shadow-2xl rounded-xl border border-gray-200">
                <table className="w-full text-left table-auto">
                    <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                            <th scope="col" className="p-4 text-sm font-semibold text-gray-600">ID</th>
                            <th scope="col" className="p-4 text-sm font-semibold text-gray-600">Customer</th>
                            <th scope="col" className="p-4 text-sm font-semibold text-gray-600">Amount</th>
                            <th scope="col" className="p-4 text-sm font-semibold text-gray-600">Method</th>
                            <th scope="col" className="p-4 text-sm font-semibold text-gray-600 hidden sm:table-cell">Date/Ref</th>
                            <th scope="col" className="p-4 text-sm font-semibold text-gray-600 text-center">Status</th>
                            <th scope="col" className="p-4 text-sm font-semibold text-gray-600 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredPayments.map((p) => (
                            <tr 
                                key={p.paymentId} 
                                className={`border-b border-gray-100 transition duration-150 ${!p.isRead ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}`}
                            >
                                {/* ID */}
                                <td className="p-4 font-mono text-xs text-gray-500">{p.paymentId}</td>
                                
                                {/* Customer Name/Email */}
                                <td className="p-4">
                                    <p className="font-semibold text-gray-800">{p.bookingId || "N/A"}</p>
                                    <p className="text-xs text-gray-500">{p.transactionRef || "No Ref"}</p>
                                </td>

                                {/* Amount */}
                                <td className="p-4 font-bold text-green-700">
                                    {formatCurrency(p.amountPaid)}
                                </td>

                                {/* Method (Badge) */}
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getMethodBadge(p.paymentMethod)}`}>
                                        <Tag size={12} className="mr-1" /> {p.paymentMethod}
                                    </span>
                                </td>

                                {/* Date/Ref (Combined for clarity) */}
                                <td className="p-4 hidden sm:table-cell text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <Calendar size={14} className="mr-1 text-gray-400" /> {new Date(p.transactionDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center mt-1">
                                        <Clock size={14} className="mr-1 text-gray-400" /> {new Date(p.transactionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </td>

                                {/* Status (Button/Badge) */}
                                <td className="p-4 text-center">
                                    {p.isRead ? (
                                        <button
                                            onClick={() => markAsUnread(p.paymentId)} 
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white hover:bg-green-600 transition shadow-sm"
                                            title="Mark as Unread"
                                        >
                                            <CheckCircle size={14} className="mr-1" />
                                            Read
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => markAsRead(p.paymentId)} 
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition shadow-sm"
                                            title="Mark as Read"
                                        >
                                            <XCircle size={14} className="mr-1" />
                                            New
                                        </button>
                                    )}
                                </td>

                                {/* Action Buttons (View/Delete) */}
                                <td className="p-4 text-center space-x-2">
                                    <button className="text-blue-600 hover:text-blue-800 transition p-2 rounded-full hover:bg-blue-50" title="View Details">
                                        <Eye size={18} />
                                    </button>
                                    <button 
                                        onClick={() => deletePayment(p.paymentId)}
                                        className="text-red-600 hover:text-red-800 transition p-2 rounded-full hover:bg-red-50" 
                                        title="Delete Payment"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Empty State */}
            {filteredPayments.length === 0 && (
                <div className="text-center py-10 text-gray-500 border border-dashed mt-4 rounded-lg">
                    {searchTerm ? (
                        <p className="font-medium">No transactions match your search "{searchTerm}".</p>
                    ) : (
                        <p className="font-medium">No payment records found. Click "Add Payment" to create one.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default PaymentHome;