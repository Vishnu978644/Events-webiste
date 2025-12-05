import React from "react";
import { Sparkles, Camera, Star } from "lucide-react";

const BirthdayReasons = () => {
  const reasons = [
    {
      icon: <Sparkles className="w-10 h-10 text-pink-400" />,
      title: "Magical Moments",
      desc: "Each moment is filled with color, laughter, and sparkle — just like you!",
    },
    {
      icon: <Camera className="w-10 h-10 text-pink-400" />,
      title: "Cherished Captures",
      desc: "From giggles to surprises, every click freezes a sweet memory forever.",
    },
    {
      icon: <Star className="w-10 h-10 text-pink-400" />,
      title: "Brightest Celebrations",
      desc: "From décor to delight, everything shines brighter on your special day!",
    },
  ];

  return (
    <section className="py-20  text-center ">
      <h2 className="text-4xl font-black text-pink-700 mb-24">Why Birthdays Shine with Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {reasons.map((r, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition border border-pink-100"
          >
            <div className="flex justify-center mb-4">{r.icon}</div>
            <h3 className="text-xl font-semibold text-pink-700 mb-3">{r.title}</h3>
            <p className="text-gray-600">{r.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BirthdayReasons;
