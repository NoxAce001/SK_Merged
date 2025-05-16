// client/src/components/layout/MarqueeDisplay.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const MarqueeDisplay = () => {
  const [marquees, setMarquees] = useState({ top: null, bottom: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActiveMarquees();

    // Poll for updates every 5 minutes
    const interval = setInterval(fetchActiveMarquees, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchActiveMarquees = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/marquee/active"
      );

      // Organize marquees by position
      const topMarquee = res.data.find(
        (m) => m.position === "top" && m.isActive
      );
      const bottomMarquee = res.data.find(
        (m) => m.position === "bottom" && m.isActive
      );

      setMarquees({
        top: topMarquee || null,
        bottom: bottomMarquee || null,
      });

      setError(null);
    } catch (err) {
      setError("Failed to load marquees");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null; // Don't render anything while loading
  }

  return (
    <div className="marquee-container">
      {/* Top Marquee */}
      {marquees.top && (
        <div
          // className="bg-blue-600 text-white py-1 overflow-hidden"
          className="rounded-2xl mx-10 mb-8 bg-black py-4 overflow-hidden whitespace-nowrap"
        >
          {/* <div className="overflow-hidden rounded-2xl mx-10 mb-8 bg-black py-4"> */}
            <div className="inline-block whitespace-nowrap animate-marquee text-lg font-bold text-white">
              {marquees.top.text}
            </div>
          {/* </div> */}
        </div>
      )}

      {/* Content would go here */}

      {/* Bottom Marquee */}
      {marquees.bottom && (
        <div
          // className="bg-green-600 text-white py-1 overflow-hidden mt-auto"
          className="rounded-2xl mx-10 mb-8 bg-black py-4 overflow-hidden whitespace-nowrap"
        >
          <div
            // className="marquee-content"
            // className="marquee text-lg font-bold"
            className="inline-block py-1 text-lg font-bold text-white animate-marquee whitespace-nowrap"
          >
            {marquees.bottom.text}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarqueeDisplay;

// Add this CSS to your global styles or tailwind config
/*
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-marquee {
  animation: marquee 15s linear infinite;
}

.marquee-content {
  width: 100%;
  overflow: hidden;
}
*/
