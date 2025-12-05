import React from "react";
import { Heart } from "lucide-react";

const BirthdayMessage = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-pink-100 to-pink-200 text-center mb-16">
      <h2 className="text-4xl font-extrabold text-pink-700 mb-6 flex items-center justify-center gap-3">
        <Heart className="text-pink-600 w-6 h-6" /> Made with Love & Laughter
      </h2>
      <p className="max-w-2xl mx-auto text-gray-700 text-lg">
        Every birthday tells a story — of joy, friends, and dreams. Let’s make yours unforgettable, filled with colors that
        stay in your heart forever.
      </p>
    </section>
  );
};

export default BirthdayMessage;
