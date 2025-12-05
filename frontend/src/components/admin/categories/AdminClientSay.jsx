import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/client";

// ⭐ Custom Message Box
const MessageBox = ({ msg, type, onClose }) => {
    if (!msg) return null;

    const colors = {
        success: "bg-green-100 text-green-700 border-green-500",
        error: "bg-red-100 text-red-700 border-red-500",
        info: "bg-blue-100 text-blue-700 border-blue-500"
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-28 z-50">
            <div className={`p-4 rounded-lg border-l-4 w-80 shadow-xl ${colors[type]}`}>
                <p className="font-bold capitalize">{type}</p>
                <p>{msg}</p>

                <button
                    onClick={onClose}
                    className="mt-2 text-sm font-semibold border-b border-current"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

const AdminClientSay = () => {
    const [reviews, setReviews] = useState([]);
    const [form, setForm] = useState({ name: "", review: "", rating: "" });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ msg: "", type: "info" });

    // GET ALL REVIEWS
    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await axios.get(API);
            setReviews(res.data);
        } catch (err) {
            setMsg({ msg: "Failed to load reviews", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // ADD REVIEW
    const handleAdd = async () => {
        const { name, review, rating } = form;
        if (!name || !review || !rating) {
            return setMsg({ msg: "All fields required", type: "error" });
        }

        try {
            await axios.post(API, form);
            setMsg({ msg: "Review Added Successfully", type: "success" });
            setForm({ name: "", review: "", rating: "" });
            fetchReviews();
        } catch (err) {
            setMsg({ msg: "Failed to add review", type: "error" });
        }
    };

    // UPDATE REVIEW
    const handleUpdate = async (id) => {
        try {
            await axios.put(`${API}/${id}`, {
                review: "This review was updated by admin",
            });
            setMsg({ msg: "Review Updated", type: "success" });
            fetchReviews();
        } catch (err) {
            setMsg({ msg: "Update failed", type: "error" });
        }
    };

    // DELETE REVIEW
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this review?")) return;

        try {
            await axios.delete(`${API}/${id}`);
            setMsg({ msg: "Review Deleted", type: "success" });
            fetchReviews();
        } catch (err) {
            setMsg({ msg: "Delete failed", type: "error" });
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            <MessageBox
                msg={msg.msg}
                type={msg.type}
                onClose={() => setMsg({ msg: "", type: "info" })}
            />

            <h1 className="text-4xl font-bold text-pink-600 mb-6 text-center">
                Client Review Manager (MongoDB)
            </h1>

            {/* ADD FORM */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-10 max-w-lg mx-auto">
                <h2 className="text-xl font-bold mb-4">Add Review</h2>

                <input
                    type="text"
                    placeholder="Client Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border p-2 rounded mb-3"
                />

                <textarea
                    placeholder="Client Review"
                    value={form.review}
                    onChange={(e) => setForm({ ...form, review: e.target.value })}
                    className="w-full border p-2 rounded mb-3"
                />

                <input
                    type="number"
                    placeholder="Rating (1–5)"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className="w-full border p-2 rounded mb-3"
                />

                <button
                    onClick={handleAdd}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700"
                >
                    Add Review
                </button>
            </div>

            {/* LIST REVIEWS */}
            {loading ? (
                <p className="text-center text-xl text-gray-600">Loading...</p>
            ) : reviews.length === 0 ? (
                <p className="text-center text-gray-500">No Reviews Found</p>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    {reviews.map((r) => (
                        <div key={r._id} className="p-5 bg-white shadow rounded-xl relative">
                            <h3 className="text-xl font-bold">{r.name}</h3>
                            <p className="text-yellow-500">{'⭐'.repeat(r.rating)}</p>
                            <p className="text-gray-700 mt-2">{r.review}</p>

                            <div className="flex justify-end mt-4 space-x-2">
                                <button
                                    onClick={() => handleUpdate(r._id)}
                                    className="bg-blue-500 px-3 py-1 text-white rounded"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDelete(r._id)}
                                    className="bg-red-500 px-3 py-1 text-white rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminClientSay;
