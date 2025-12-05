import React from "react";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen px-4"
      style={{
        backgroundImage:
          "url('https://t3.ftcdn.net/jpg/15/14/49/42/360_F_1514494224_WdXYkYmxyTokfaYAPrpiA8aaxilm9Txn.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Glassmorphic Card */}
      <div className="bg-white/25 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl w-[900px] h-[500px] border-4 border-white/40 text-white flex flex-col justify-between">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-4 text-white tracking-widest uppercase drop-shadow-lg">
          Forgot Password
        </h2>

        <p className="text-center text-gray-200 text-lg sm:text-xl mb-4">
          Enter your registered email address, and we’ll send you a link to reset your password.
        </p>

        {/* Email Input */}
        <div>
          <label className="block text-lg sm:text-xl font-semibold mb-1">
            Email
          </label>
          <div className="flex items-center border-b-2 border-white/70 pb-2">
            <Mail className="text-white mr-2" size={24} />
            <input
              type="email"
              placeholder="Enter your registered email"
              className="bg-transparent w-full outline-none text-white placeholder-gray-300 text-lg sm:text-xl py-1"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button className="w-full bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 text-white font-bold text-lg sm:text-xl py-3 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 mt-6">
          Send Reset Link
        </button>

        {/* Back to Login */}
        <p className="text-center text-white/80 mt-4 text-lg sm:text-xl">
          Remember your password?{" "}
          <Link
            to="/"
            className="text-yellow-300 font-bold hover:underline hover:text-pink-400 transition-all text-lg sm:text-xl"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
