import React, { useState, useEffect } from 'react'
import { ImagePlus, Images, MessageSquareText, ArrowDownNarrowWide, Plus, Minus } from 'lucide-react'

const FiltersAdmin = () => {

    const datas = [
        {
            name: "Wedding",
            icon: <ImagePlus size={24} />,
            color: "bg-indigo-600",
            darkColor: "bg-indigo-700",
            sublink: [
                { label: "Wedding Types", number: 320 },
                { label: " Gallery", number: 510 }
            ]
        },
        {
            name: "Birthday",
            icon: <Images size={24} />,
            color: "bg-teal-600",
            darkColor: "bg-teal-700",
            sublink: [
                { label: " Gallery", number: 80 },
            ]
        },
        {
            name: "Corporate Events",
            icon: <MessageSquareText size={24} />,
            color: "bg-rose-600",
            darkColor: "bg-rose-700",
            sublink: [
                { label: " Recent Events", number: 150 },
                { label: " Gallery", number: 260 },
            ]
        }
    ]

    // 1. STATE MANAGEMENT
    const [openIndex, setOpenIndex] = useState(null)
    const [selectedValues, setSelectedValues] = useState({})
    const [dynamicCounts, setDynamicCounts] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    
    // NEW STATE: Tracks local adjustments made by the user with the +/- buttons
    const [localValueAdjustments, setLocalValueAdjustments] = useState({});

    // 2. HELPER FUNCTIONS
    const toggleDropdown = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    const selectSubItem = (cardIndex, numberValue) => {
        setSelectedValues({
            ...selectedValues,
            [cardIndex]: numberValue,
        })
        setOpenIndex(null) // Closes the dropdown
        // Clear any local adjustment when a sub-item is selected
        setLocalValueAdjustments(prev => {
            const newAdjustments = { ...prev };
            delete newAdjustments[cardIndex];
            return newAdjustments;
        });
    }

    // NEW FUNCTION: Handles increment/decrement
    const handleValueChange = (index, delta) => {
        setLocalValueAdjustments(prev => {
            // Determine the base value for adjustment (either the dynamic count or the selected sub-value)
            const initialDynamicValue = dynamicCounts[datas[index].name] ?? 0;
            const selectedSubValue = selectedValues[index] ?? null;
            
            // Get the current displayed value, incorporating any existing local adjustment
            const currentBaseValue = selectedSubValue ?? initialDynamicValue;
            const currentAdjustment = prev[index] ?? 0;
            const currentValue = currentBaseValue + currentAdjustment;

            // Calculate the new adjustment
            const newAdjustment = currentAdjustment + delta;

            // Optional: Prevent count from dropping below zero
            if (currentValue + delta < 0) return prev; 

            // Update the state with the new adjustment
            return {
                ...prev,
                [index]: newAdjustment,
            };
        });
    };

    /**
     * Fetches the latest counts from the server (simulated).
     * This data is the "source of truth" until overridden by user selection or +/-.
     */
    const fetchEventCounts = async () => {
        setIsLoading(true);
        
        // --- START: Simulate Real API Data with changing values ---
        const baseWedding = 550;
        const baseBirthday = 120;
        const baseCorporate = 85;
        
        // Add a random increment to simulate continuous dynamic changes (bookings/sales)
        const newWeddingCount = baseWedding + Math.floor(Math.random() * 20); 
        const newBirthdayCount = baseBirthday + Math.floor(Math.random() * 10);
        const newCorporateCount = baseCorporate + Math.floor(Math.random() * 5);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500)); 
        
        const fetchedData = {
            "Wedding": newWeddingCount, 
            "Birthday": newBirthdayCount, 
            "Corporate Events": newCorporateCount 
        };
        // --- END: Simulate Real API Data ---

        setDynamicCounts(fetchedData);
        setIsLoading(false);
        
        // When dynamic data updates, clear local adjustments IF a sub-item isn't selected,
        // so the card immediately reflects the new polled data.
        // If a sub-item is selected, the sub-item value takes precedence.
        setLocalValueAdjustments(prev => {
            const newAdjustments = { ...prev };
            datas.forEach((_, index) => {
                if (!selectedValues[index]) {
                    delete newAdjustments[index];
                }
            });
            return newAdjustments;
        });
    };

    // 3. EFFECT FOR DYNAMIC POLLING
    useEffect(() => {
        fetchEventCounts(); 
        const intervalId = setInterval(fetchEventCounts, 15000); 
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array means this runs only on mount/unmount

    // 4. RENDER
    return (
        <div className='p-4 md:p-6 bg-gray-50 rounded-xl mt-[-20px]'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {datas.map((item, index) => {
                    
                    // CORE LOGIC: Get the base value
                    const initialDynamicValue = dynamicCounts[item.name] ?? 0;
                    const selectedSubValue = selectedValues[index] ?? null;
                    
                    // The base value is the selected sub-item OR the latest dynamic count
                    const baseValue = selectedSubValue ?? initialDynamicValue;
                    
                    // Add any local adjustment made by the +/- buttons
                    const adjustment = localValueAdjustments[index] ?? 0;
                    
                    // FINAL displayed value
                    const displayedValue = baseValue + adjustment;

                    return (
                        <div
                            key={index}
                            className={`
                                ${item.color}
                                text-white p-6 rounded-xl shadow-lg 
                                flex flex-col justify-between h-[170px]
                                transition-all duration-300
                                hover:scale-[1.03] hover:shadow-2xl cursor-pointer relative
                            `}
                        >

                            {/* TOP ROW */}
                            <div className="flex justify-between items-start">
                                <div className={`p-3 rounded-full ${item.darkColor}`}>
                                    {item.icon}
                                </div>

                                <h1 className='text-sm font-semibold uppercase pt-1'>
                                    {item.name}
                                </h1>

                                <ArrowDownNarrowWide
                                    className="cursor-pointer"
                                    onClick={() => toggleDropdown(index)}
                                />
                            </div>

                            {/* VALUE & BUTTONS ROW */}
                            <div className="flex justify-between items-center mt-2">
                                {/* VALUE → The main count displayed on the card */}
                                <p className='text-4xl font-extrabold'>
                                    {isLoading && adjustment === 0 ? '...' : displayedValue}
                                </p>

                                {/* NEW: Increment/Decrement Buttons */}
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevents card click/dropdown toggle
                                            handleValueChange(index, -1);
                                        }}
                                        className={`p-2 rounded-full ${item.darkColor} hover:opacity-80 transition-opacity`}
                                        aria-label="Decrement value"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevents card click/dropdown toggle
                                            handleValueChange(index, 1);
                                        }}
                                        className={`p-2 rounded-full ${item.darkColor} hover:opacity-80 transition-opacity`}
                                        aria-label="Increment value"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>


                            {/* DROPDOWN MENU */}
                            {openIndex === index && (
                                <div 
                                    className='absolute right-4 top-[50px] bg-pink-200 text-black shadow-lg rounded-md p-2 z-50 text-[12px] w-[130px] border-2 border-white'
                                    // Prevents closing the dropdown when clicking inside it
                                    onClick={(e) => e.stopPropagation()} 
                                >
                                    {item.sublink.map((sub, i) => (
                                        <div
                                            key={i}
                                            className='p-2 rounded hover:bg-gray-100 cursor-pointer flex justify-between'
                                            onClick={() => selectSubItem(index, sub.number)}
                                        >
                                            {sub.label} 
                                            <span className="font-bold ml-2">({sub.number})</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default FiltersAdmin