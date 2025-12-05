import React, { useState, useContext } from "react";
import {
    Layers,
    Store,
    Users,
    HeartHandshake,
    CalendarDays,
    PhoneCall,
    DollarSign,
    ShoppingCart,
    UserCheck,
    Plus, 
    Minus, 
} from "lucide-react";
import { PaymentContext } from "../../../context/PaymentContext"; 

// --- Helper Functions ---

// CORRECTED: Displays the full amount in INR without abbreviating large numbers (e.g., ₹10,000,000 instead of ₹10M).
const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '₹0';
    
    return `${amount.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
};

// --- Dashboard Card Component ---
const DashboardCard = ({ 
    title, 
    value, 
    icon, 
    stacked = false, 
    className = "",
    onIncrement, 
    onDecrement, 
    isInteractive = false 
}) => {
    
    // Convert value to string for display, handling numeric types for formatting
    const displayValue = typeof value === 'number' ? value.toLocaleString() : value || "0";

    return (
        <div
            className={`
                p-6 rounded-xl shadow-xl text-white flex flex-col justify-between
                transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl
                border-b-4
                ${className}
            `}
        >
            {stacked ? (
                // --- Stacked layout for interactive lower cards ---
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 rounded-xl shadow-inner">
                        {React.cloneElement(icon, { size: 26, className: "text-white" })}
                    </div>
                    
                    <h3 className="text-sm font-medium tracking-wider uppercase opacity-90 text-white">
                        {title}
                    </h3>
                    
                    <div className="flex items-center space-x-3">
                        {isInteractive && onDecrement && (
                            <button 
                                onClick={onDecrement} 
                                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 transition-all shadow-lg"
                                title={`Decrease ${title}`}
                            >
                                <Minus size={18} />
                            </button>
                        )}
                        
                        <p className="text-3xl font-bold drop-shadow-md">{displayValue}</p>
                        
                        {isInteractive && onIncrement && (
                            <button 
                                onClick={onIncrement} 
                                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 transition-all shadow-lg"
                                title={`Increase ${title}`}
                            >
                                <Plus size={18} />
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                // --- Default layout for top metrics ---
                <>
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-xl bg-white bg-opacity-30 shadow-inner">
                            {React.cloneElement(icon, { size: 24, className: "text-white" })}
                        </div>
                        <h3 className="text-sm font-medium tracking-wider uppercase opacity-90 pt-1 text-white">
                            {title}
                        </h3>
                    </div>
                    <p className="text-3xl font-bold mt-4 drop-shadow-md">{displayValue}</p>
                </>
            )}
        </div>
    );
};

// --- Dashbox (Main Dashboard View) Component ---
const Dashbox = () => {
    // Context for Top Metrics (Payments)
    const { paymentData } = useContext(PaymentContext);
    const { totalPayments, totalAmount } = paymentData;
    
    // State for Lower Metrics (Simulated interactivity)
    const [lowerMetrics, setLowerMetrics] = useState({
        categories: 12,
        vendors: 2100,
        bridesGrooms: 7900,
        weddingHalls: 450,
        planningGuides: 25,
        contactLeads: 89,
    });
    
    // Function to handle increment/decrement for any key
    const updateMetric = (key, delta) => {
        setLowerMetrics(prevMetrics => ({
            ...prevMetrics,
            [key]: Math.max(0, prevMetrics[key] + delta) 
        }));
    };

    // Calculate dynamic customer count (based on the total number of bookings/payments)
    const totalCustomers = totalPayments; 

    return (
        <div className="p-6 sm:p-10 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-pink-500 mb-10 text-center font-music">Dashboard Overview</h1>

            {/* Top Metrics (Linked and Dynamic) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                
                {/* Total Customers (Now linked to totalPayments) */}
                <DashboardCard
                    title="Total Customers"
                    value={totalCustomers.toLocaleString() || "0"} 
                    icon={<UserCheck />}
                    className="min-h-[160px] bg-gradient-to-br from-indigo-500 to-indigo-600 border-indigo-800"
                />
                
                {/* Total Bookings */}
                <DashboardCard
                    title="Total Bookings"
                    value={totalPayments.toLocaleString() || "0"} 
                    icon={<ShoppingCart />}
                    className="min-h-[160px] bg-gradient-to-br from-indigo-500 to-indigo-600 border-indigo-800"
                />
                
                {/* Payments Received (Uses corrected formatCurrency) */}
                <DashboardCard
                    title="Payments Received"
                    value={formatCurrency(totalAmount)}
                    icon={<DollarSign />}
                    className="min-h-[160px] bg-gradient-to-br from-indigo-500 to-indigo-600 border-indigo-800"
                />
            </div>

            {/* Lower Metrics (Interactive) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                
                <DashboardCard
                    title="Categories"
                    value={lowerMetrics.categories}
                    icon={<Layers />}
                    stacked={true}
                    isInteractive={true}
                    onIncrement={() => updateMetric('categories', 1)}
                    onDecrement={() => updateMetric('categories', -1)}
                    className="min-h-[140px] bg-gradient-to-br from-teal-400 to-teal-500 border-teal-700"
                />
                <DashboardCard
                    title="Vendors"
                    value={lowerMetrics.vendors}
                    icon={<Store />}
                    stacked={true}
                    isInteractive={true}
                    onIncrement={() => updateMetric('vendors', 100)} 
                    onDecrement={() => updateMetric('vendors', -100)}
                    className="min-h-[140px] bg-gradient-to-br from-rose-400 to-rose-500 border-rose-700"
                />
                <DashboardCard
                    title="Brides / Grooms"
                    value={lowerMetrics.bridesGrooms}
                    icon={<Users />}
                    stacked={true}
                    isInteractive={true}
                    onIncrement={() => updateMetric('bridesGrooms', 100)}
                    onDecrement={() => updateMetric('bridesGrooms', -100)}
                    className="min-h-[140px] bg-gradient-to-br from-amber-400 to-amber-500 border-amber-700"
                />
                <DashboardCard
                    title="Wedding Halls"
                    value={lowerMetrics.weddingHalls}
                    icon={<HeartHandshake />}
                    stacked={true}
                    isInteractive={true}
                    onIncrement={() => updateMetric('weddingHalls', 1)}
                    onDecrement={() => updateMetric('weddingHalls', -1)}
                    className="min-h-[140px] bg-gradient-to-br from-blue-400 to-blue-500 border-blue-700"
                />
                <DashboardCard
                    title="Planning Guides"
                    value={lowerMetrics.planningGuides}
                    icon={<CalendarDays />}
                    stacked={true}
                    isInteractive={true}
                    onIncrement={() => updateMetric('planningGuides', 1)}
                    onDecrement={() => updateMetric('planningGuides', -1)}
                    className="min-h-[140px] bg-gradient-to-br from-purple-400 to-purple-500 border-purple-700"
                />
                <DashboardCard
                    title="Contact Leads"
                    value={lowerMetrics.contactLeads}
                    icon={<PhoneCall />}
                    stacked={true}
                    isInteractive={true}
                    onIncrement={() => updateMetric('contactLeads', 1)}
                    onDecrement={() => updateMetric('contactLeads', -1)}
                    className="min-h-[140px] bg-gradient-to-br from-green-400 to-green-500 border-green-700"
                />
            </div>
        </div>
    );
};

export default Dashbox;