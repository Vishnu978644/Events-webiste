// import React from "react";

// const Connection = () => {
//   const items = [
//     { img: "/model1.jpg", text: "Hall",path:'<Decorationvendore.jsx/>' },
//     { img: "/model2.jpg", text: "Hotel" ,path:'' },
//     { img: "/model3.jpg", text: "Decoration" ,path:'' },
//     { img: "/model4.jpg", text: "Transport" ,path:'' },
//   ];

//   return (
//     <div className="w-full flex justify-center mt-[50px] z-10">
//       <div className="flex gap-x-[70px] flex-wrap justify-center">
//         {items.map((item, index) => (
//           <div
//             key={index}
//             className="relative w-[300px] h-[300px] rounded-full overflow-hidden group"
//           >
//             <img
//               src={item.img}
//               alt={item.text}
//               className="w-full h-full object-cover border-4 border-purple-300 rounded-full transition-transform duration-500 group-hover:scale-105 hover:cursor-pointer"
//             />
//             <a href={item.path}></a>
//             {/* Centered Text Overlay */}
//             <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full">
//               <h1 className="text-white text-4xl font-bold hover:cursor-pointer">{item.text}</h1>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Connection;
