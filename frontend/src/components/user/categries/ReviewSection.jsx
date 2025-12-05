import React, { useState, useEffect } from "react";
import { Star, MessageSquare, X } from "lucide-react";

const ReviewSection = ({ theme = "pink" }) => {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    comment: "",
    rating: 0,
  });
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Theme colors
  const colorClass = theme === "blue" ? "text-blue-700" : "text-pink-700";
  const bgClass = theme === "blue" ? "bg-blue-50" : "bg-pink-50";
  const buttonClass =
    theme === "blue"
      ? "bg-blue-500 hover:bg-blue-600 transition duration-300"
      : "bg-pink-500 hover:bg-pink-600 transition duration-300";

  // Fetch Reviews
  const fetchReviews = async () => {
    try {
      // NOTE: This uses a mock API endpoint and will not work without a local server running.
      const res = await fetch("http://localhost:5000/client"); 
      const data = await res.json();
      setReviews(data.reverse());
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      // Fallback to mock data if fetch fails (due to no local server)
      const mockReviews = [
        { _id: '1', name: 'Alice M.', review: 'Excellent service and prompt delivery. Highly recommended!', rating: 5 },
        { _id: '2', name: 'Bob J.', review: 'The product was good, but the shipping was slow.', rating: 3 },
        { _id: '3', name: 'Charlie P.', review: 'The best experience I have had with customer support.', rating: 5 },
      ];
      setReviews(mockReviews);
      setMessage({ type: "error", text: "Failed to load real-time reviews. Using mock data." });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Submit Review
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newReview.name || !newReview.comment || newReview.rating === 0) {
      setMessage({
        type: "warning",
        text: "Please fill all fields and add rating.",
      });
      return;
    }

    try {
      // NOTE: This uses a mock API endpoint and will not work without a local server running.
      const res = await fetch("http://localhost:5000/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newReview.name,
          review: newReview.comment, // Assumes backend field name is 'review'
          rating: newReview.rating,
        }),
      });

      if (!res.ok) throw new Error("Submit failed");

      setMessage({ type: "success", text: "Review submitted successfully!" });
      setNewReview({ name: "", comment: "", rating: 0 });
      setShowForm(false);

      // Re-fetch to show the new review (if the mock server supports persistence)
      fetchReviews();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to submit review. Mock server unavailable." });
      // If submission fails, manually add to state for demonstration purposes
      setReviews([
        { 
          _id: Date.now().toString(), 
          name: newReview.name, 
          review: newReview.comment, 
          rating: newReview.rating 
        },
        ...reviews
      ]);
      setNewReview({ name: "", comment: "", rating: 0 });
      setShowForm(false);
    }
  };

  // Notification Component
  const Notification = ({ msg }) => (
    <div
      className={`fixed top-4 right-4 p-4 rounded-xl shadow-2xl text-white max-w-xs z-50 transition-transform duration-300 transform ${
        msg.type === "success"
          ? "bg-green-500"
          : msg.type === "error"
          ? "bg-red-500"
          : "bg-yellow-500"
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium">{msg.text}</span>
        <button onClick={() => setMessage(null)} className="ml-4 p-1 rounded-full hover:bg-white/20">
          <X size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className={`py-12 md:py-20 ${bgClass} text-center font-inter min-h-screen antialiased`}>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
      `}</style>

      {message && <Notification msg={message} />}

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <h2
          className={`text-4xl font-extrabold ${colorClass} mb-8 flex justify-center items-center gap-3`}
        >
          <MessageSquare className="w-8 h-8" /> Client Reviews
        </h2>

        {/* Action Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className={`${buttonClass} text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition duration-300`}
        >
          {showForm ? "Hide Review Form" : "Write a Review"}
        </button>

        {/* Review Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto mt-10 bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-left border border-gray-100"
          >
            <h3 className={`text-2xl font-bold mb-6 ${colorClass}`}>Share Your Feedback</h3>

            <label className="block font-semibold mb-2 text-gray-700">Your Name</label>
            <input
              type="text"
              value={newReview.name}
              onChange={(e) =>
                setNewReview({ ...newReview, name: e.target.value })
              }
              className="w-full border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition rounded-xl px-4 py-3 mb-4 outline-none"
              placeholder="e.g., Jane Doe"
              required
            />

            <label className="block font-semibold mb-2 text-gray-700">Your Review</label>
            <textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              className="w-full border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition rounded-xl px-4 py-3 mb-4 h-32 resize-none outline-none"
              placeholder="Share your experience..."
              required
            />

            <label className="block font-semibold mb-2 text-gray-700">Rating</label>
            <div className="flex gap-2 mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                  className={`w-8 h-8 cursor-pointer transition duration-150 ${
                    i < newReview.rating
                      ? "text-yellow-400 fill-yellow-400 transform scale-110"
                      : "text-gray-300 hover:text-yellow-300"
                  }`}
                />
              ))}
            </div>

            <button
              type="submit"
              className={`${buttonClass} text-white font-bold text-lg px-8 py-3 rounded-full w-full shadow-md`}
            >
              Submit Review
            </button>
          </form>
        )}

        {/* Reviews Display */}
        {isLoading ? (
          <div className="mt-12">
            <p className="text-xl text-gray-500 flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 mr-3 text-gray-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Loading reviews...
            </p>
          </div>
        ) : (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-700 mb-8">
                {reviews.length} Customer Testimonials
            </h3>
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-6 pb-4">
                {reviews.length > 0 ? (
                  reviews.map((r) => (
                    <div
                      // Using r._id as key based on original code structure
                      key={r._id} 
                      className="bg-white rounded-3xl shadow-xl p-8 inline-block w-80 shrink-0 transform hover:shadow-2xl hover:scale-[1.02] transition duration-300 border border-gray-100"
                    >
                      {/* Using r.review based on original code structure */}
                      <p className="text-gray-700 mb-4 italic text-left h-20 overflow-hidden">
                        “{r.review}” 
                      </p>

                      <div className="flex justify-between items-end border-t pt-4">
                        <div className="text-left">
                            <h3 className={`font-bold text-lg ${colorClass}`}>{r.name}</h3>
                            {/* Removed timestamp as it wasn't available in the original structure */}
                        </div>
                        

                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`w-5 h-5 ${
                                index < r.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center py-10">
                    <p className="text-gray-600 text-xl">
                        No reviews yet. Be the first to share your experience!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;