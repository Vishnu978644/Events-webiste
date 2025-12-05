import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Loader2, AlertTriangle, Save } from "lucide-react";

// The API URL should ideally point to the correct endpoint
const API_URL = "http://localhost:5000/services";; 
// CATEGORIES constant removed as requested
const CURRENCIES = ["INR", "USD", "EUR", "GBP"];
const VARIANTS = ["default", "primary", "secondary"];

const PlanningService = () => {
    const [packages, setPackages] = useState([]);
    const [formData, setFormData] = useState({ 
        head: "", // Now initialized as a simple string
        name: "", 
        description: "", 
        price: "", 
        currency: "INR", 
        featuresString: "", 
        buttonText: "", 
        variant: "default" 
    }); 
    const [isEditing, setIsEditing] = useState(false);
    const [editID, setEditID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    // --- Data Mapper (Unchanged) ---
    const mapDataToState = (data) =>
        data.map(item => ({
            id: item._id, 
            head: item.head || "", 
            name: item.title, 
            description: item.description || "",
            price: item.price,
            currency: item.currency || "INR",
            features: Array.isArray(item.features) ? item.features : [], 
            buttonText: item.buttonText || "Choose Plan",
            variant: item.variant || "default",
        }));

    // --- R: READ (Fetch) Operation (Unchanged) ---
    const fetchPackages = async () => {
        setLoading(true);
        setApiError(null);
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error(`Failed to fetch packages. Status: ${res.status}`);
            const data = await res.json();
            setPackages(mapDataToState(data));
        } catch (err) {
            console.error("Fetch Error:", err);
            setApiError(`Could not load packages: ${err.message}. Check server status.`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const parseFeaturesString = (featuresString) => {
        return featuresString.split('\n')
            .map(f => f.trim())
            .filter(f => f.length > 0);
    };

    // --- C / U: CREATE (POST) & UPDATE (PUT) Operation (Unchanged logic) ---
    const handleAdd = async () => {
        const featuresArray = parseFeaturesString(formData.featuresString);
        const priceNum = parseFloat(formData.price);

        // Validation check - relies on formData.head being a non-empty string
        if (!formData.head.trim() || !formData.name.trim() || isNaN(priceNum) || priceNum < 0 || featuresArray.length === 0 || !formData.buttonText.trim()) {
            return setApiError("Category/Head, Name, Valid Price, Button Text, and at least one Feature are all required fields.");
        }

        setLoading(true);
        setApiError(null);

        const packageData = {
            head: formData.head.trim(), 
            title: formData.name.trim(),
            description: formData.description.trim(), 
            price: priceNum, 
            currency: formData.currency, 
            features: featuresArray, 
            buttonText: formData.buttonText.trim(), 
            variant: formData.variant, 
        };

        let method = isEditing ? "PUT" : "POST";
        let url = isEditing ? `${API_URL}/${editID}` : API_URL;

        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(packageData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Server error: Status ${res.status}`);
            }

            await fetchPackages(); 
            
            // Clear all input fields after successful operation
            setFormData({ 
                head: "", // Reset head after submission
                name: "", 
                description: "", 
                price: "", 
                currency: "INR", 
                featuresString: "", 
                buttonText: "", 
                variant: "default" 
            });
            setIsEditing(false);
            setEditID(null);

        } catch (err) {
            console.error(`${method} Error:`, err.message); 
            setApiError(`Operation failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // --- D: DELETE Operation (Unchanged) ---
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this package?")) return;
        
        setLoading(true);
        setApiError(null);
        
        const originalPackages = packages;
        setPackages(packages.filter((pkg) => pkg.id !== id));

        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Server error: Status ${res.status}`);
            }
        } catch (err) {
            console.error("Delete Error:", err.message);
            setApiError(`Deletion failed: ${err.message}. Reverting list.`);
            setPackages(originalPackages); 
        } finally {
            setLoading(false);
        }
    };


    // --- Local State Handlers (Unchanged logic, just resetting 'head' to empty string) ---
    const handleEdit = (pkg) => {
        const featuresString = Array.isArray(pkg.features) ? pkg.features.join('\n') : "";

        setFormData({ 
            head: pkg.head, 
            name: pkg.name, 
            description: pkg.description, 
            price: String(pkg.price), 
            currency: pkg.currency, 
            featuresString: featuresString, 
            buttonText: pkg.buttonText, 
            variant: pkg.variant, 
        });
        setIsEditing(true);
        setEditID(pkg.id);
        setApiError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setFormData({ 
            head: "", 
            name: "", 
            description: "", 
            price: "", 
            currency: "INR", 
            featuresString: "", 
            buttonText: "", 
            variant: "default" 
        });
        setIsEditing(false);
        setEditID(null);
        setApiError(null);
    };

    return (
        <div className="w-full flex justify-center py-10 min-h-screen mt-[-20px]">
            <div className="w-[90%] lg:w-[90%] bg-white p-6 rounded-xl shadow-2xl border border-pink-300">
                {/* --- HEADER --- */}
                <hgroup className="mb-6">
                    <h2 className="text-3xl font-extrabold text-pink-700">
                        {isEditing ? `Editing ${formData.name}` : formData.head || "General"} Service Packages Administration
                    </h2>
                    <p className="text-gray-600">Manage all service tiers for client offerings.</p>
                </hgroup>
                <hr className="mb-6 border-pink-100" />
                
                {/* --- API Error Display --- */}
                {apiError && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex items-center" role="alert">
                        <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
                        <p>{apiError}</p>
                    </div>
                )}
                
                {/* --- Add / Edit Form --- */}
                <div className="bg-pink-50 p-4 rounded-xl mb-6 border border-pink-200">
                    <h3 className="text-xl font-semibold text-pink-600 mb-3">
                        {isEditing ? "Edit Package Details" : "Add New Package"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* New Input for Head/Category */}
                        <input
                            type="text"
                            placeholder="Category/Head (e.g., International Explorer)"
                            className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                            value={formData.head}
                            onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                            disabled={loading}
                        />

                        {/* Package Name (Title) */}
                        <input
                            type="text"
                            placeholder="Package Name (Title)"
                            className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-pink-300 col-span-2"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={loading}
                        />

                        {/* Currency */}
                        <select
                            className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                            value={formData.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            disabled={loading}
                        >
                            {CURRENCIES.map(curr => (
                                <option key={curr} value={curr}>{curr}</option>
                            ))}
                        </select>

                        {/* Price */}
                        <input
                            type="number"
                            placeholder="Price (e.g., 400.00)"
                            className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-pink-300"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            disabled={loading}
                        />

                        {/* Button Text */}
                        <input
                            type="text"
                            placeholder="Button Text (e.g., Book Luxury)"
                            className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-pink-300"
                            value={formData.buttonText}
                            onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                            disabled={loading}
                        />
                    </div>

                    {/* Description */}
                    <textarea
                        placeholder="Short Description (Appears below title on the card)"
                        className="w-full p-3 border rounded-lg mt-3 outline-none resize-none focus:ring-2 focus:ring-pink-300"
                        rows={2} 
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        disabled={loading}
                    />

                    {/* Features */}
                    <textarea
                        placeholder="Package Features (Enter each feature on a new line)"
                        className="w-full p-3 border rounded-lg mt-3 outline-none resize-none focus:ring-2 focus:ring-pink-300"
                        rows={5} 
                        value={formData.featuresString} 
                        onChange={(e) => setFormData({ ...formData, featuresString: e.target.value })}
                        disabled={loading}
                    />

                    {/* Variant/Design Select */}
                    <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Design Variant</label>
                        <select
                            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                            value={formData.variant}
                            onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                            disabled={loading}
                        >
                            {VARIANTS.map(v => (
                                <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleAdd}
                            className={`text-white px-5 py-2 rounded-lg flex items-center gap-2 transition duration-150 disabled:opacity-50 ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-pink-600 hover:bg-pink-700'}`}
                            disabled={loading || !formData.head.trim() || !formData.name.trim() || !formData.buttonText.trim() || isNaN(parseFloat(formData.price)) || parseFeaturesString(formData.featuresString).length === 0}
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : isEditing ? <Save size={18} /> : <Plus size={18} />}
                            {isEditing ? "Update Package" : "Add Package"}
                        </button>
                        
                        {isEditing && (
                            <button
                                onClick={handleCancelEdit}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition duration-150"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
                
                {/* --- Packages List --- */}
                <h3 className="text-xl font-semibold text-pink-700 mb-3">Current Packages List ({packages.length})</h3>

                {loading && packages.length === 0 ? (
                    <div className="text-center p-10 text-gray-500">
                        <Loader2 className="w-6 h-6 animate-spin inline mr-2" /> Loading packages...
                    </div>
                ) : packages.length === 0 ? (
                    <div className="text-center p-10 border-2 border-dashed border-pink-200 rounded-lg text-gray-500">
                        No packages found. Use the form above to add your first service package.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {packages.map((pkg) => (
                            <div
                                key={pkg.id}
                                className="flex flex-col md:flex-row justify-between items-start md:items-center bg-pink-50 p-4 rounded-xl border border-pink-200 shadow-md"
                            >
                                <div className="max-w-4/5">
                                    <p className="text-xs font-bold text-pink-600 uppercase mb-1">{pkg.head} | Variant: {pkg.variant}</p>
                                    <p className="text-lg font-bold text-pink-800">{pkg.name} ({pkg.currency} {pkg.price})</p>
                                    <p className="text-sm text-gray-700 italic">{pkg.description}</p>
                                    <p className="text-sm font-semibold text-gray-700 mt-1">Button: {pkg.buttonText}</p>
                                    
                                    {/* Display features from the array */}
                                    <ul className="list-disc list-inside text-gray-500 mt-1 text-sm italic">
                                        {pkg.features && pkg.features.length > 0 ? (
                                            pkg.features.map((feature, idx) => (
                                                <li key={idx}>{feature}</li>
                                            ))
                                        ) : (
                                            <li>No features listed.</li>
                                        )}
                                    </ul>
                                </div>

                                <div className="flex gap-3 mt-2 md:mt-0">
                                    <button
                                        onClick={() => handleEdit(pkg)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition disabled:opacity-50"
                                        disabled={loading}
                                        title="Edit Package"
                                    >
                                        <Pencil size={18} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(pkg.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition disabled:opacity-50"
                                        disabled={loading}
                                        title="Delete Package"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlanningService;