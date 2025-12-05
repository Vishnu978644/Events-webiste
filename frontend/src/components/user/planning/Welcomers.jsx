import React, { useState, useEffect } from 'react';
import { Check, Loader2, AlertTriangle } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

// NOTE: This URL must match the base path where your Express server mounts the serviceRoutes.
const API_URL = "http://localhost:5000/services"; 

const Welcomers = () => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Helper Component for Checkmark List Items (using li for proper structure) ---
    const CheckItem = ({ children, isDark = false }) => (
        <li className={`flex items-center mt-3 text-base sm:text-lg text-left ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            <Check className="w-5 h-5 mr-3 flex-shrink-0 text-green-500" />
            <span className='flex-grow'>{children}</span>
        </li>
    );

    // --- Data Fetching Logic ---
    const fetchPackages = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(API_URL);
            if (!res.ok) {
                // Throw an error if the status is not 2xx, which covers your 404 issue
                throw new Error(`Failed to fetch packages. Status: ${res.status}`);
            }
            const data = await res.json();
            
            // Map the fetched data structure to ensure we have all required fields for rendering
            const mappedPackages = data.map(item => ({
                id: item._id,
                head: item.head || "",
                title: item.title,
                description: item.description || "",
                price: item.price,
                currency: item.currency || "INR",
                features: Array.isArray(item.features) ? item.features : [],
                buttonText: item.buttonText || "Choose Plan",
                variant: item.variant || "default", // Used for styling
            }));
            
            setPackages(mappedPackages);
        } catch (err) {
            console.error("Fetch Error:", err);
            setError(`Could not load packages: ${err.message}. Please ensure your Node.js server is running and the Express route is set up correctly (app.use('/api/services', serviceRoutes)).`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    // Navigate to booking page with package info
    const handleBooking = (packageName, price) => {
        navigate("/booking", { state: { packageName, price } });
    };

    // --- Utility to determine Tailwind classes based on 'variant' (recreating your original styles) ---
    const getCardStyles = (variant) => {
        switch (variant) {
            case 'primary': // International Explorer style
                return {
                    cardClass: "bg-gray-800 text-white ring-4 ring-yellow-400/50 scale-[1.03]",
                    titleClass: "text-white",
                    priceClass: "text-yellow-400",
                    descriptionClass: "text-gray-300",
                    buttonClass: "bg-yellow-600 text-white hover:bg-yellow-700 shadow-lg shadow-yellow-500/50",
                    isDark: true,
                };
            case 'secondary': // Bespoke Dream Trip style (Blue price/Rose border)
                return {
                    cardClass: "bg-white border-4 border-rose-500/20",
                    titleClass: "text-gray-800",
                    priceClass: "text-blue-600",
                    descriptionClass: "text-gray-600",
                    buttonClass: "bg-rose-100 text-gray-800 border-2 border-rose-500 hover:bg-rose-200 shadow-md",
                    isDark: false,
                };
            case 'default': // Weekend Getaway style (Green price/Rose border)
            default:
                return {
                    cardClass: "bg-white border-4 border-rose-500/20",
                    titleClass: "text-gray-800",
                    priceClass: "text-green-600",
                    descriptionClass: "text-gray-600",
                    buttonClass: "bg-rose-100 text-gray-800 border-2 border-rose-500 hover:bg-rose-200 shadow-md",
                    isDark: false,
                };
        }
    };

    const MAX_WIDTH_CLASS = "max-w-[1730px] mx-auto px-4 md:px-8";

    return (
        <div className="min-h-screen bg-gray-50 py-16 font-sans">
            <div className={MAX_WIDTH_CLASS}>
                
                <div className="text-center">
                    <p className="text-center text-xl sm:text-2xl mt-16 tracking-widest uppercase text-yellow-600 border-b border-yellow-600 inline-block px-2 pb-1 mb-8">
                        PLANNING
                    </p>
                    <h1 className="text-3xl sm:text-4xl md:text-4xl font-serif text-gray-800 leading-snug mb-12 sm:mb-20">
                        Select the perfect package for your next adventure
                    </h1>
                </div>

                {/* --- Loading State --- */}
                {loading && (
                    <div className="text-center p-10 text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin inline mr-2 text-rose-500" /> Fetching exciting packages...
                    </div>
                )}

                {/* --- Error State --- */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 flex items-start mx-auto max-w-lg rounded-lg shadow-md" role="alert">
                        <AlertTriangle className="w-5 h-5 mt-1 mr-3 flex-shrink-0" />
                        <p className='text-sm'>{error}</p>
                    </div>
                )}

                {/* --- Dynamic Packages Grid --- */}
                {!loading && packages.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {packages.map((pkg) => {
                            const styles = getCardStyles(pkg.variant);
                            // Format price for display
                            const displayPrice = `${pkg.currency} ${pkg.price.toLocaleString('en-IN')}`; 

                            return (
                                <div 
                                    key={pkg.id} 
                                    // Apply dynamic styles and hover effects
                                    className={`rounded-xl shadow-2xl p-6 sm:p-8 transition duration-300 ease-in-out transform hover:scale-[1.02] flex flex-col justify-between h-[600px] ${styles.cardClass}`}
                                >
                                    <div>
                                        {/* Head (e.g., "Most Popular") */}
                                        {pkg.head && (
                                            <p className={`text-xs font-bold uppercase mb-1 tracking-widest ${styles.isDark ? 'text-yellow-300' : 'text-rose-500'}`}>{pkg.head}</p>
                                        )}
                                        
                                        {/* Title */}
                                        <h2 className={`text-3xl sm:text-2xl font-semibold mb-3 ${styles.titleClass}`}>{pkg.title}</h2>
                                        
                                        {/* Price */}
                                        <p className={`text-4xl sm:text-3xl font-bold mb-4 ${styles.priceClass}`}>
                                            <span className='text-3xl align-top'>₹</span>{pkg.price.toLocaleString('en-IN')} <span className='text-base font-normal'>{pkg.currency}</span>
                                        </p>
                                        
                                        {/* Description */}
                                        {pkg.description && (
                                            <p className={`text-base sm:text-[15px] md:text-[15px] mb-6 ${styles.descriptionClass}`}>
                                                {pkg.description}
                                            </p>
                                        )}
                                        
                                        {/* Features List */}
                                        <ul className="space-y-2">
                                            {pkg.features.map((feature, index) => (
                                                <CheckItem key={index} isDark={styles.isDark}>{feature}</CheckItem>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    {/* Booking Button */}
                                    <button
                                        onClick={() => handleBooking(pkg.title, displayPrice)}
                                        className={`mt-6 py-3 sm:py-4 px-6 rounded-full font-semibold text-xl md:text-xl transition duration-300 w-full ${styles.buttonClass}`}
                                    >
                                        {pkg.buttonText}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* --- Empty State --- */}
                {!loading && packages.length === 0 && !error && (
                    <div className="text-center p-10 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 max-w-lg mx-auto">
                        <p className='text-lg font-medium'>No service packages available right now.</p>
                        <p className='text-sm mt-2'>Please use the admin panel to create your first package!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Welcomers;