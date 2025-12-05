import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input
  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  // Login Function
  const handleLogin = async () => {
    if (!formdata.email || !formdata.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const saved = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });

      const data = await saved.json();

      if (saved.ok) {
        localStorage.setItem("token", data.token);
        alert("✅ Login Successful!");
        navigate("/home");
      } else {
        alert("❌ " + data.message);
      }

      setLoading(false);
    } catch (error) {
      alert("⚠️ Cannot reach server");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-rose-50">
      {loading ? (
        <div className="flex flex-col items-center justify-center bg-white p-16 rounded-2xl shadow-xl text-rose-500">
          <Loader2 className="animate-spin mb-6" size={70} />
          <p className="text-3xl font-semibold">Logging in...</p>
        </div>
      ) : (
        <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* LEFT PANEL */}
          <div className="hidden lg:flex w-1/2 p-12 flex-col justify-center items-center bg-rose-200 text-white relative">
            <div className="absolute inset-0 bg-black/10"></div>

            <div className="relative z-10 text-center px-6">
              <h1 className="text-5xl font-extrabold mb-4">Welcome Back!</h1>
              <p className="text-lg text-white/80 mb-8">
                Access your workspace anytime.
              </p>

              <div className="w-[500px] h-[350px] rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="https://i.pinimg.com/1200x/8d/3a/06/8d3a067b81b67d1ef5ba6c0d0cc09e87.jpg"
                  alt="login"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-full lg:w-1/2 p-10 space-y-6">

            {/* Branding */}
            <div className="flex items-center space-x-4">
          <img
            src="./logo.jpg"
            alt="Logo"
            className="w-[100px] h-12 object-cover rounded-full"
          />
        </div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Login
            </h2>

            {/* Email */}
            <div className="flex items-center border p-3 rounded-xl shadow-sm">
              <Mail size={20} className="text-rose-500" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formdata.email}
                onChange={handleChange}
                className="w-full outline-none ml-2"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="flex items-center border p-3 rounded-xl shadow-sm">
                <Lock size={20} className="text-rose-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formdata.password}
                  onChange={handleChange}
                  className="w-full outline-none ml-2 pr-12"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-rose-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Button */}
            <button
              onClick={handleLogin}
              className="w-full bg-rose-500 text-white text-lg font-semibold py-3 rounded-xl shadow-lg hover:bg-rose-400 transition"
            >
              Login
            </button>

            {/* Link */}
            <p className="text-center text-gray-600">
              Don't have an account?
              <Link to="/" className="text-rose-600 font-bold ml-1 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

        </div>
      )}
    </div>
  );
};

export default Login;
