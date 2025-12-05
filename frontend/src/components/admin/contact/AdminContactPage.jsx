import React, { useState, useEffect, useCallback } from "react";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

// --- API Endpoint ---
const CONTACT_API_URL = "http://localhost:5000/contact"; 

const AdminContactPage = () => {
    // --- State Initialization ---
    const [messages, setMessages] = useState([]);
    const [selected, setSelected] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    
    // 🎯 MATCHES MONGOOSE SCHEMA 🎯
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        emailAddress: "", 
        phoneNumber: "",   
        subjectLine: "",   
        messageBody: "",   
    });
    
    const [editId, setEditId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Helper to reset form
    const resetForm = () => {
        setFormData({
            firstName: "", lastName: "", emailAddress: "",
            phoneNumber: "", subjectLine: "", messageBody: "",
        });
        setEditId(null);
    };

    // --- R: READ (GET) - Fetch all messages ---
    const fetchMessages = useCallback(async () => {
        setIsLoading(true);
        setApiError(null);
        try {
            const response = await fetch(CONTACT_API_URL);
            if (!response.ok) {
                throw new Error(`Failed to fetch messages. Status: ${response.status}`);
            }
            const data = await response.json();
            setMessages(data);
        } catch (err) {
            console.error("Fetch Error:", err);
            setApiError(err.message || "Could not connect to the API.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    // --- C: CREATE (POST) - Add new message ---
    const handleAddMessage = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setApiError(null);

        // 🟢 FIX APPLIED HERE: Add the required 'dateSent' and 'isRead' fields
        const payload = { 
            ...formData,
            dateSent: new Date(), // Required by Mongoose schema
            isRead: false,        // Required by Mongoose schema (default for new message)
        };

        try {
            const response = await fetch(CONTACT_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Message submission failed. Check required fields.");
            }

            resetForm();
            setShowAddForm(false);
            fetchMessages(); 
        } catch (err) {
            console.error("Add Error:", err);
            setApiError(err.message || "Failed to add message.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- U: UPDATE (PUT) - Edit message content ---
    const handleEditMessage = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setApiError(null);
        // For PUT, we only send fields that are part of the form state
        const payload = { ...formData }; 

        try {
            const response = await fetch(`${CONTACT_API_URL}/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Message update failed.");
            }

            resetForm();
            setShowEditForm(false);
            fetchMessages();
        } catch (err) {
            console.error("Edit Error:", err);
            setApiError(err.message || "Failed to edit message.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- U: UPDATE (PUT) - Mark message as read/unread ---
    const handleRead = async (id, currentReadStatus) => {
        // Prevent API call if already loading
        if (isLoading) return;

        setIsLoading(true);
        setApiError(null);
        
        try {
            // Note: dateSent is not explicitly sent here, relying on $set in the controller
            const response = await fetch(`${CONTACT_API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isRead: !currentReadStatus }), 
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Status update failed.");
            }

            // Update the selected item immediately for responsiveness
            if (selected?._id === id) {
                 setSelected(prev => ({ ...prev, isRead: !currentReadStatus }));
            }
            fetchMessages(); // Refresh the list in the background

        } catch (err) {
            console.error("Read Status Error:", err);
            setApiError(err.message || "Failed to update read status.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- D: DELETE (DELETE) - Delete message ---
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        setIsLoading(true);
        setApiError(null);

        try {
            const response = await fetch(`${CONTACT_API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Message deletion failed.");
            }

            if (selected?._id === id) setSelected(null);
            fetchMessages();

        } catch (err) {
            console.error("Delete Error:", err);
            setApiError(err.message || "Failed to delete message.");
        } finally {
            setIsLoading(false);
        }
    };

    // Open edit form
    const openEditForm = (msg) => {
        setEditId(msg._id);
        setFormData({
            firstName: msg.firstName,
            lastName: msg.lastName,
            emailAddress: msg.emailAddress,
            phoneNumber: msg.phoneNumber,
            subjectLine: msg.subjectLine,
            messageBody: msg.messageBody,
        });
        setShowEditForm(true);
    };

    return (
        <div className="p-5 grid grid-cols-2 gap-5">
            {/* Display Loading/Error Status */}
            {(isLoading || apiError) && (
                <div className="col-span-2 fixed top-0 left-0 right-0 p-3 text-center z-50">
                    {isLoading && (
                        <p className="bg-yellow-100 text-yellow-800 p-2 rounded flex items-center justify-center font-semibold">
                            <FaSpinner className="animate-spin mr-2" /> Processing request...
                        </p>
                    )}
                    {apiError && (
                        <p className="bg-red-100 text-red-800 p-2 rounded flex items-center justify-center font-semibold">
                            <FaExclamationTriangle className="mr-2" /> Error: {apiError}
                        </p>
                    )}
                </div>
            )}

            {/* LEFT SIDE - SELECTED MESSAGE DETAILS */}
            <div className="p-5 rounded-xl shadow min-h-[400px] mt-14 border-4">
                <h2 className="text-xl font-bold mb-3">Customer Details</h2>

                {!selected ? (
                    <p className="text-gray-500">Select a customer from the right side list</p>
                ) : (
                    <div>
                        <p>
                            <strong>Name:</strong> {selected.firstName} {selected.lastName}
                        </p>
                        <p>
                            <strong>Email:</strong> {selected.emailAddress}
                        </p>
                        <p>
                            <strong>Phone:</strong> {selected.phoneNumber}
                        </p>
                        <p>
                            <strong>Subject:</strong> {selected.subjectLine}
                        </p>
                        <p className="mt-3">
                            <strong>Message:</strong>
                        </p>
                        <p className="p-3 bg-gray-100 rounded">{selected.messageBody}</p>
                        <p className="mt-3">
                            <strong>Status:</strong>{" "}
                            <span
                                className={selected.isRead ? "text-green-600" : "text-orange-500"}
                            >
                                {selected.isRead ? "Read" : "Unread"}
                            </span>
                        </p>

                        <button
                            onClick={() => handleRead(selected._id, selected.isRead)}
                            className={`mt-4 px-4 py-2 text-white rounded flex items-center gap-1 transition ${
                                selected.isRead ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
                            }`}
                        >
                            {selected.isRead ? <FaEdit /> : <FaCheckCircle />} 
                            {selected.isRead ? "Mark as Unread" : "Mark as Read"}
                        </button>
                    </div>
                )}
            </div>

            {/* RIGHT SIDE - LIST OF CUSTOMERS */}
            <div className="mt-12">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Contact Messages</h1>

                    <button
                        onClick={() => { resetForm(); setShowAddForm(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        <FaPlus /> Add Contact
                    </button>
                </div>

                {messages.length === 0 && !isLoading && !apiError ? (
                    <p className="text-center text-gray-500">No contact messages found.</p>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`border p-3 rounded-lg mb-3 shadow cursor-pointer transition ${
                                selected?._id === msg._id ? "bg-blue-100 border-blue-500" : "bg-white hover:bg-gray-50"
                            }`}
                            onClick={() => { setSelected(msg); }} 
                        >
                            <h2 className="font-bold">
                                {msg.firstName} {msg.lastName}
                            </h2>
                            <p>{msg.emailAddress}</p>
                            
                            <p className="text-sm">
                                Subject: <span className="font-medium">{msg.subjectLine}</span>
                            </p>

                            <div className="mt-3 flex gap-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openEditForm(msg);
                                    }}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded flex items-center gap-1 hover:bg-yellow-600"
                                >
                                    <FaEdit /> Edit
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(msg._id);
                                    }}
                                    className="px-3 py-1 bg-red-500 text-white rounded flex items-center gap-1 hover:bg-red-600"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>

                            <p className="mt-2 text-sm">
                                Status:{" "}
                                <span className={msg.isRead ? "text-green-600" : "text-orange-500 font-semibold"}>
                                    {msg.isRead ? "Read" : "Unread"}
                                </span>
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* ADD FORM MODAL */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-40">
                    <form onSubmit={handleAddMessage} className="bg-white p-6 rounded shadow-lg w-[350px]">
                        <h2 className="text-xl font-bold mb-4">Add Contact</h2>
                        <input type="text" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border p-2 rounded mb-3" required />
                        <input type="text" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border p-2 rounded mb-3" required />
                        <input type="email" placeholder="Email" name="emailAddress" value={formData.emailAddress} onChange={handleChange} className="w-full border p-2 rounded mb-3" required />
                        <input type="text" placeholder="Phone" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full border p-2 rounded mb-3" required />
                        <input type="text" placeholder="Subject" name="subjectLine" value={formData.subjectLine} onChange={handleChange} className="w-full border p-2 rounded mb-3" required />
                        <textarea placeholder="Message" name="messageBody" value={formData.messageBody} onChange={handleChange} className="w-full border p-2 rounded mb-3" rows="3" required></textarea>

                        <div className="flex justify-between">
                            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" disabled={isLoading}>
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* EDIT FORM MODAL */}
            {showEditForm && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-40">
                    <form onSubmit={handleEditMessage} className="bg-white p-6 rounded shadow-lg w-[350px]">
                        <h2 className="text-xl font-bold mb-4">Edit Contact (ID: {editId})</h2>
                        <input type="text" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border p-2 rounded mb-3" required />
                        <input type="text" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border p-2 rounded mb-3" required />
                        <input type="email" placeholder="Email" name="emailAddress" value={formData.emailAddress} onChange={handleChange} className="w-full border p-2 rounded mb-3" required />
                        <input type="text" placeholder="Phone" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full border p-2 rounded mb-3" required />
                        <input type="text" placeholder="Subject" name="subjectLine" value={formData.subjectLine} onChange={handleChange} className="w-full border p-2 rounded mb-3" required />
                        <textarea placeholder="Message" name="messageBody" value={formData.messageBody} onChange={handleChange} className="w-full border p-2 rounded mb-3" rows="3" required></textarea>

                        <div className="flex justify-between">
                            <button type="button" onClick={() => setShowEditForm(false)} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600" disabled={isLoading}>
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminContactPage;