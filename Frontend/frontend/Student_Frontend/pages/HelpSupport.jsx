import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const HelpSupport = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
      <h2 className="text-3xl font-bold text-center mb-6">Help & Support</h2>

      <div className="space-y-6 text-lg">
        <div className="flex items-center gap-4">
          <FaPhone className="text-blue-600 text-2xl" />
          <div>
            <p className="font-semibold">Phone Support:</p>
            <p>+91 9876543210</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <FaEnvelope className="text-green-600 text-2xl" />
          <div>
            <p className="font-semibold">Email Support:</p>
            <p>support@skeduteh.com</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <FaMapMarkerAlt className="text-red-600 text-2xl" />
          <div>
            <p className="font-semibold">Location:</p>
            <p>Skeduteh Tuition Centre, Sector 15, Noida, Uttar Pradesh, India</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-8 text-sm text-gray-500">
        We're here to help! Reach out anytime between <strong>10:00 AM - 6:00 PM</strong> (Mon - Sat)
      </div>
    </div>
  );
};

export default HelpSupport;
