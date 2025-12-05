import React, { useState } from "react";
import { useLocation } from "react-router-dom";

// --- API Endpoint ---
const CONTACT_API_URL = "http://localhost:5000/contact";

// --- SVG ICONS (unchanged for brevity) ---
const MapMarkerIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
  </svg>
);
const EnvelopeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);
const PhoneIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.01.24l-2.07 2.07c-3.15-1.56-5.83-4.24-7.39-7.38l2.07-2.07c.27-.27.35-.66.24-1.01C8.75 5.45 8.5 4.25 8.5 3c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1C3 12.45 11.55 21 21 21c.55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z" />
  </svg>
);
const FacebookIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);
const TwitterIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.46 6c-.77.35-1.6.58-2.46.68.87-.52 1.54-1.34 1.85-2.32-.82.49-1.74.85-2.72 1.05C18.18 4.7 17.15 4 15.98 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.4 5.4 7.8 3.55 5.25c-.37.63-.58 1.36-.58 2.14 0 1.48.75 2.8 1.88 3.56-.69-.02-1.34-.21-1.91-.53v.03c0 2.08 1.48 3.82 3.44 4.21-.36.1-.73.15-1.11.15-.27 0-.53-.02-.79-.08 1.4 4.2 5.47 7.21 10.3 7.21-4.7 3.7-10.64 5.9-17.06 5.9-1.1 0-2.2-.06-3.29-.19C5.35 20.9 9.9 22 15.03 22c7.22 0 11.17-5.9 11.17-11.02 0-.17 0-.35-.01-.52.77-.55 1.44-1.24 1.97-2.03z" />
  </svg>
);
const InstagramIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2zm-.2 4.4A2.4 2.4 0 005 6.4v8.4c0 1.3.9 2.4 2.2 2.4h8.4c1.3 0 2.4-.9 2.4-2.2V6.4c0-1.3-.9-2.4-2.2-2.4H7.6zm9.6 1.6a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4zM12 9a3 3 0 100 6 3 3 0 000-6zm0 2a1 1 0 110 2 1 1 0 010-2z" />
  </svg>
);
const LinkedinIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zm-11 19h-3V8h3v11zm-1.5-12h-.03c-.98 0-1.5 0-1.5-1.5S5.5 4 7 4s1.5.52 1.5 1.5-1.5 1.5-1.5 1.5zm12 12h-3V14c0-1.1-.9-2-2-2s-2 .9-2 2v5h-3V8h3v1.73c.48-.56 1.15-.93 1.94-.93 1.9 0 3.06 1.48 3.06 3.52v5.68z" />
  </svg>
);
// --- END SVG ICONS ---

const ContactWithUs = () => {
  const location = useLocation();
  const destination = location.state?.destination;
  let mainHeading = destination ? `Enquire About ${destination}` : "Get In Touch";

  // 1. State for Form Data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emailAddress: "",
    subjectLine: "",
    messageBody: "", // Mapped to the <textarea> content
  });

  // 2. State for Submission Status: 'idle', 'loading', 'success', 'error'
  const [apiStatus, setApiStatus] = useState('idle');
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    // Dynamically update the state field based on the input's 'name' attribute
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      firstName: "", lastName: "", emailAddress: "",
      phoneNumber: "", subjectLine: "", messageBody: "",
    });
  };

  // 3. Submitting the form (POST request)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation check
    if (Object.values(formData).some(value => !value) || !formData.emailAddress.includes('@')) {
        setApiError("Please fill out all required fields and provide a valid email.");
        setApiStatus('error');
        return;
    }

    setApiStatus('loading');
    setApiError(null);

    // Prepare payload (field names match the backend controller/schema)
    const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        emailAddress: formData.emailAddress,
        subjectLine: formData.subjectLine,
        // The backend expects messageBody for the text area content
        messageBody: formData.messageBody, 
    };

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Handle 400 or 500 status codes from the server
        const errorData = await response.json();
        // Use the message provided by the backend (e.g., "Validation Failed. Check required fields.")
        throw new Error(errorData.message || `API failed with status ${response.status}`);
      }

      // Success
      resetForm();
      setApiStatus('success');
    } catch (err) {
      console.error("API Submission Error:", err);
      setApiError(err.message);
      setApiStatus('error');
    }
  };

  // --- Conditional Success Message ---
  if (apiStatus === 'success') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
        <div className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-xl">
          <h1 className="text-4xl font-bold text-rose-600 mb-4">Thank You!</h1>
          <p className="text-lg text-gray-700 mb-6">
            We have received your message and appreciate you reaching out. Our team is currently busy creating unforgettable experiences, but we will contact you shortly. 🌸
          </p>
          <button
            onClick={() => setApiStatus('idle')}
            className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-semibold transition"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  // --- Main Component Render (includes form) ---
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 font-inter mt-0">
      
      {/* 🌸 GET IN TOUCH HERO SECTION */}
      <div className="text-center mb-20 px-4 mt-12 flex flex-col justify-center max-w-[1730px] mx-auto">
        <h1 className="text-5xl md:text-7xl lg:text-5xl font-extrabold text-gray-900 mb-5 tracking-tight leading-tight">
          {mainHeading}
        </h1>
        <p className="text-xl md:text-xl text-rose-600 font-medium uppercase tracking-widest">
          Sociis natoque penatibus et magnis dis parturient
        </p>
        <div className="w-24 h-1 bg-rose-500 mx-auto mt-6 rounded-full"></div>
      </div>

      {/* API Status Indicator */}
      {(apiStatus === 'loading' || apiStatus === 'error') && (
        <div className="text-center max-w-lg mx-auto mb-4 p-3 rounded-lg">
          {apiStatus === 'loading' && (
            <p className="text-blue-600 font-semibold">
              Sending message...
            </p>
          )}
          {apiStatus === 'error' && (
            <p className="text-red-600 font-semibold bg-red-100 border border-red-300">
              Error: {apiError || "Could not submit your message. Please try again."}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col lg:flex-row justify-between w-[1000px] h-[600px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100">
          
          {/* LEFT SIDE (Contact Info) */}
          <div className="bg-rose-700 w-full lg:w-5/12 p-10 sm:p-12 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-6 tracking-wide">Contact Information</h2>
              <p className="text-rose-200 mb-12 text-lg leading-relaxed">
                We are available 24/7 via email or phone. Feel free to contact us for any inquiry.
              </p>

              <div className="space-y-10">
                <div className="flex items-start gap-5">
                  <MapMarkerIcon className="text-rose-300 w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-xl mb-1">Head Office</h3>
                    <p className="text-rose-100 text-base">Jalan Cempaka Wangi No 22 Jakarta - Indonesia</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <EnvelopeIcon className="text-rose-300 w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-xl mb-1">Email Us</h3>
                    <p className="text-rose-100 text-base">support@yourdomain.tld</p>
                    <p className="text-rose-100 text-base">hello@yourdomain.tld</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <PhoneIcon className="text-rose-300 w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-xl mb-1">Call Us</h3>
                    <p className="text-rose-100 text-base">Phone: +6221.2002.2012</p>
                    <p className="text-rose-100 text-base">Fax: +6221.2002.2013</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-6 mt-8 pt-6 border-t border-rose-600/50">
              <FacebookIcon className="text-rose-300 hover:text-white w-6 h-6 transition duration-300" />
              <TwitterIcon className="text-rose-300 hover:text-white w-6 h-6 transition duration-300" />
              <InstagramIcon className="text-rose-300 hover:text-white w-6 h-6 transition duration-300" />
              <LinkedinIcon className="text-rose-300 hover:text-white w-6 h-6 transition duration-300" />
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="w-full lg:w-7/12 p-10 sm:p-12 overflow-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 tracking-tight">Send Us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-7 text-base">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* First Name */}
                <input 
                  required 
                  placeholder="First Name" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  className="border border-gray-400 p-3 rounded-lg w-full focus:ring-2 focus:ring-rose-100 focus:border-rose-500" 
                />
                {/* Last Name */}
                <input 
                  required 
                  placeholder="Last Name" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  className="border border-gray-400 p-3 rounded-lg w-full focus:ring-2 focus:ring-rose-100 focus:border-rose-500" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Phone Number */}
                <input 
                  required 
                  placeholder="Phone Number" 
                  name="phoneNumber" 
                  value={formData.phoneNumber} 
                  onChange={handleChange} 
                  className="border border-gray-400 p-3 rounded-lg w-full focus:ring-2 focus:ring-rose-100 focus:border-rose-500" 
                />
                {/* Email Address */}
                <input 
                  required 
                  type="email" 
                  placeholder="Email Address" 
                  name="emailAddress" 
                  value={formData.emailAddress} 
                  onChange={handleChange} 
                  className="border border-gray-400 p-3 rounded-lg w-full focus:ring-2 focus:ring-rose-100 focus:border-rose-500" 
                />
              </div>

              {/* Subject Line */}
              <input 
                required 
                placeholder="Subject Line" 
                name="subjectLine" 
                value={formData.subjectLine} 
                onChange={handleChange} 
                className="border border-gray-400 p-3 rounded-lg w-full focus:ring-2 focus:ring-rose-100 focus:border-rose-500" 
              />
              {/* Message Body (using name="messageBody" to match backend) */}
              <textarea 
                required 
                placeholder="Your Message..." 
                name="messageBody" 
                value={formData.messageBody} 
                onChange={handleChange} 
                rows="4" 
                className="border border-gray-400 p-3 rounded-lg w-full focus:ring-2 focus:ring-rose-100 focus:border-rose-500"
              ></textarea>

              <button 
                type="submit" 
                disabled={apiStatus === 'loading'}
                className={`
                  ${apiStatus === 'loading' ? 'bg-gray-400 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600'}
                  text-white px-8 py-3 rounded-full font-bold text-lg uppercase tracking-wide shadow-md shadow-rose-300/50 transform transition duration-300 sm:w-[25%] w-full mx-auto
                `}
              >
                {apiStatus === 'loading' ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactWithUs;