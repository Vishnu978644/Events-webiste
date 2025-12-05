import React, { useState } from 'react';
import { conce } from '../../../utils/Constant';
import { useNavigate } from 'react-router-dom';

const Convence = () => {
  const [activeIndex, setActiveIndex] = useState(null); // track which service card is open
  const [activePackage, setActivePackage] = useState(null); // track which package is open

  const navigate = useNavigate();
  const handleContact = () => navigate('/contact');

  // Default packages for all services with features
  const defaultPackages = [
    {
      name: "Basic Package",
      price: "$200 - $300",
      features: [
        "Venue decoration with standard floral arrangements",
        "Basic lighting setup",
        "Standard table and chair setup",
        "1-hour photography coverage"
      ]
    },
    {
      name: "Gold Package",
      price: "$400",
      features: [
        "Premium venue decoration with flowers and drapes",
        "Enhanced lighting and ambient setup",
        "Customized table and chair arrangements",
        "2-hour professional photography",
        "Welcome drinks for guests"
      ]
    },
    {
      name: "Diamond Package",
      price: "$500",
      features: [
        "Luxury venue decoration with thematic designs",
        "Advanced lighting and sound setup",
        "VIP seating arrangements",
        "Full-day professional photography and videography",
        "Catering of appetizers and beverages",
        "Personal event coordinator"
      ]
    },
    {
      name: "Platinum Package",
      price: "$600",
      features: [
        "Exquisite venue decoration with premium florals and props",
        "Professional lighting, sound, and stage setup",
        "VIP and guest seating management",
        "Full-day photography and cinematic video coverage",
        "Catering with customized menu",
        "Dedicated event manager and assistants"
      ]
    },
    {
      name: "Super Duper Package",
      price: "$800",
      features: [
        "Exclusive venue decoration with themed luxury design",
        "State-of-the-art lighting, sound, and special effects",
        "Luxury seating and lounge arrangements for guests",
        "Full-day photography, videography, and drone coverage",
        "Catering with premium gourmet menu and beverages",
        "Personal event planner, on-site coordinators, and VIP services",
        "Live entertainment and special performances"
      ]
    },
  ];


  return (
    <div className="max-w-[1730px] mx-auto px-6 md:px-10 mt-32">
      <h1 className="text-5xl text-center mb-16 font-bold text-rose-500">
        Our Services
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {conce.map((item, index) => (
          <div key={index}>
            {/* Service Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-rose-200 p-6 transition hover:shadow-2xl">
              <img
                src={item.imgURL}
                alt={item.text1}
                className="w-24 h-24 object-cover rounded-full shadow-lg border-2 border-rose-300 mb-4 cursor-pointer"
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
              />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{item.text1}</h2>
              <p className="text-gray-600 mb-4 text-sm">{item.text2}</p>
            </div>

            {/* Service Modal */}
            {activeIndex === index && (
              <div className='fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4'>
                <div className="relative bg-rose-50 rounded-xl p-6 shadow-xl max-w-[600px] w-full">
                  <p
                    className='absolute top-2 right-4 text-2xl font-bold cursor-pointer'
                    onClick={() => { setActiveIndex(null); setActivePackage(null); }}
                  >
                    X
                  </p>
                  <h3 className="text-2xl font-bold mb-4 text-rose-700">{item.text1} Packages</h3>

                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {defaultPackages.map((pkg, pkgIndex) => (
                      <div
                        key={pkgIndex}
                        className="bg-white p-3 rounded-lg shadow-md cursor-pointer hover:bg-rose-100"
                        onClick={() => setActivePackage(pkgIndex)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">{pkg.name}</span>
                          <span className="text-gray-600">{pkg.price}</span>
                        </div>

                        {/* Show Features if clicked */}
                        {activePackage === pkgIndex && (
                          <div className="mt-2 bg-gray-50 p-2 rounded-lg border-l-4 border-rose-500">
                            <ul className="list-disc list-inside text-gray-700">
                              {pkg.features.map((feature, fIndex) => (
                                <li key={fIndex}>{feature}</li>
                              ))}
                            </ul>
                            <button
                              className="mt-2 bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded-full text-sm font-semibold"
                              onClick={handleContact}
                            >
                              Contact
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => { setActiveIndex(null); setActivePackage(null); }}
                    className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-full font-semibold transition duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Convence;
