import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Sign = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    Email: "",
    Password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Register
  const handleRegister = async () => {
    const { firstName, lastName, Email, Password } = formData;

    if (!firstName || !lastName || !Email || !Password) {
      alert("🚨 Please ensure all required fields are filled out.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ this is needed
        body: JSON.stringify({ name: `${firstName} ${lastName}`, email: Email, password: Password }),
      });


      const data = await response.json();

      if (data.message === "User Registered") {
        alert("✅ Account Successfully Created! Please Login.");

        navigate("/home"); // Go to login after registration
      } else {
        alert("❌ Registration Failed: " + data.message);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("⚠️ Network Error. Could not reach server.");
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      style={{ backgroundColor: "#e8f5e9" }}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center bg-white p-16 rounded-2xl shadow-xl text-green-600">
          <Loader2 className="animate-spin mb-6" size={70} />
          <p className="text-3xl font-semibold">Creating Account...</p>
        </div>
      ) : (
        <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* LEFT PANEL */}
          <div className="hidden lg:flex w-1/2 p-12 flex-col justify-center items-center bg-rose-200 text-white relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-center px-6">
              <h1 className="text-5xl font-extrabold mb-4">Welcome!</h1>
              <p className="text-lg text-lime-100 mb-8">
                Your digital workspace is waiting.
              </p>
              <div className="w-[500px] h-[350px] rounded-3xl flex items-center justify-center shadow-xl">
                <img
                  src="https://i.pinimg.com/1200x/8d/3a/06/8d3a067b81b67d1ef5ba6c0d0cc09e87.jpg"
                  alt="illustration"
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-full lg:w-1/2 p-10 space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src="./logo.jpg"
                alt="Logo"
                className="w-[100px] h-12 object-cover rounded-full"
              />
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Create account
            </h2>

            {/* NAME FIELDS */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400"
              />

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* EMAIL */}
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400"
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-xl pr-14 focus:ring-2 focus:ring-green-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-rose-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className={`w-full text-white text-lg font-semibold py-3 rounded-xl shadow-lg transition 
                  ${loading ? "bg-rose-400 cursor-not-allowed" : "bg-rose-500 hover:bg-rose-400"}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 w-5 h-5" /> Processing...
                </span>
              ) : (
                "Create account"
              )}
            </button>

            <p className="text-center text-gray-600">
              Already have an account?
              <Link to="/login" className="text-green-600 font-bold ml-1 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sign;
