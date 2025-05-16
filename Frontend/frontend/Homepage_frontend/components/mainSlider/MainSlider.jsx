import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const mainSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [sliderImages, setSliderImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch images from API using Axios
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await axios.get('http://localhost:8000/api/v1/mainSliderImages/');
        
        // Axios automatically throws errors for non-2xx responses
        // and puts the response data in response.data
        
        // Sort images by order property if needed
        const sortedImages = response.data.sort((a, b) => a.order - b.order);
        
        setSliderImages(sortedImages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching slider images:', err);
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    
    fetchImages();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isAutoPlaying && sliderImages.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, sliderImages.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    if (sliderImages.length === 0) return;
    const newIndex = (currentIndex - 1 + sliderImages.length) % sliderImages.length;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    if (sliderImages.length === 0) return;
    const newIndex = (currentIndex + 1) % sliderImages.length;
    setCurrentIndex(newIndex);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="mb-5 flex items-center justify-center h-64 bg-gray-100">
        <p className="text-gray-500">Loading slider images...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="mb-5 flex items-center justify-center h-64 bg-red-50">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  // If no images found
  if (sliderImages.length === 0) {
    return (
      <div className="mb-5 flex items-center justify-center h-64 bg-gray-100">
        <p className="text-gray-500">No slider images available</p>
      </div>
    );
  }

  return (
    <div className="mb-5 relative max-w-full lg:h-[500px] overflow-hidden">
      {/* Images */}
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {sliderImages.map((image, index) => (
          <div key={image._id} className="w-full h-full flex-shrink-0">
            <img 
              src={image.url} 
              alt={image.name || `Slide ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={goToPrevious} 
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        onClick={goToNext} 
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {sliderImages.map((image, index) => (
          <button
            key={`indicator-${image._id}`}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          />
        ))}
      </div>
    </div>
  );
};

export default mainSlider;

