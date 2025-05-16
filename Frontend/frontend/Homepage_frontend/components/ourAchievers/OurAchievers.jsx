import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import AchieverSlider from "./AchieverSlider";


const OurAchievers = () => {
  
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
    <div className="mx-auto my-6 justify-center p-8 flex flex-col lg:flex-row gap-8 ">
      {/* Left div for images from API */}
      {/* Also called as EVENT BOX */}
      <div className="max-w-[550px] max-h-[500px] relative rounded-3xl overflow-hidden bg-gray-100">

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

      {/* Right content div */}
      <div className="lg:w-2/3">
        {/* Text content */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Our Achievers
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Our people make empowering great cultures possible. We know what it
            takes to drive greater engagement because we live it every day — and
            we're passionate about sharing our know-how with your organization.
          </p>
        </div>

        {/* Profile icons grid */}
        <div className="">
          {/* {achievers.map((achiever) => (
            <div key={achiever.id} className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-cyan-100 mb-2">
                <img 
                  src={achiever.image} 
                  alt={achiever.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-gray-800 text-center">{achiever.name}</h3>
            </div>
          ))} */}
          <AchieverSlider />
        </div>
      </div>
    </div>
  );
};

export default OurAchievers;

// import React from "react";
// import AchieverSlider from "./AchieverSlider";
// import { useState, useEffect } from "react";

// const OurAchievers = () => {
//   // Sample data for achievers highlight
//   const highlightAchievers = [
//     { id: 1, name: "Satish Kumar", achievement: "IIT JEE All India Rank 45", image: "/api/placeholder/150/150" },
//     { id: 2, name: "Rajesh Singh", achievement: "NEET Top Scorer", image: "/api/placeholder/150/150" },
//     { id: 3, name: "Satbir Kumar", achievement: "Software Engineer at Microsoft", image: "/api/placeholder/150/150" },
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);

//   // Sample images for the gallery display
//   const images =  [
//         "https://th.bing.com/th/id/R.48c60b5051614cf538bb8eaa57511cc5?rik=Czu%2bFhmCsjYwqg&riu=http%3a%2f%2fperpetualstudent.net%2fwp-content%2fuploads%2f2015%2f03%2fIndian-students.jpg&ehk=vqfvl%2bN9gaJg0zKHdcvsthe91EzcURS1fhhe3Ac%2bCyg%3d&risl=&pid=ImgRaw&r=0",
    
//         "https://th.bing.com/th/id/R.48c60b5051614cf538bb8eaa57511cc5?rik=Czu%2bFhmCsjYwqg&riu=http%3a%2f%2fperpetualstudent.net%2fwp-content%2fuploads%2f2015%2f03%2fIndian-students.jpg&ehk=vqfvl%2bN9gaJg0zKHdcvsthe91EzcURS1fhhe3Ac%2bCyg%3d&risl=&pid=ImgRaw&r=0",
    
//         "https://th.bing.com/th/id/R.48c60b5051614cf538bb8eaa57511cc5?rik=Czu%2bFhmCsjYwqg&riu=http%3a%2f%2fperpetualstudent.net%2fwp-content%2fuploads%2f2015%2f03%2fIndian-students.jpg&ehk=vqfvl%2bN9gaJg0zKHdcvsthe91EzcURS1fhhe3Ac%2bCyg%3d&risl=&pid=ImgRaw&r=0",
    
//         "https://th.bing.com/th/id/R.48c60b5051614cf538bb8eaa57511cc5?rik=Czu%2bFhmCsjYwqg&riu=http%3a%2f%2fperpetualstudent.net%2fwp-content%2fuploads%2f2015%2f03%2fIndian-students.jpg&ehk=vqfvl%2bN9gaJg0zKHdcvsthe91EzcURS1fhhe3Ac%2bCyg%3d&risl=&pid=ImgRaw&r=0",
//       ];

//   useEffect(() => {
//     let interval;
//     if (isAutoPlaying) {
//       interval = setInterval(() => {
//         setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//       }, 5000);
//     }
//     return () => clearInterval(interval);
//   }, [isAutoPlaying, images.length]);

//   const goToSlide = (index) => {
//     setCurrentIndex(index);
//   };

//   const goToPrevious = () => {
//     const newIndex = (currentIndex - 1 + images.length) % images.length;
//     setCurrentIndex(newIndex);
//   };

//   const goToNext = () => {
//     const newIndex = (currentIndex + 1) % images.length;
//     setCurrentIndex(newIndex);
//   };

//   return (
//     <div className="bg-gradient-to-b from-white to-blue-50 py-12">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl font-bold text-gray-900 mb-2">Student Excellence</h2>
//           <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             We take pride in our students' accomplishments and celebrate their journey toward excellence.
//             Our supportive environment helps nurture talent and achieve exceptional results.
//           </p>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-10">
//           {/* Left div for achievement gallery */}
//           <div className="lg:w-2/5">
//             <div className="bg-white rounded-xl overflow-hidden shadow-lg">
//               <div className="p-6 border-b">
//                 <h3 className="text-2xl font-bold text-gray-800">Achievement Gallery</h3>
//               </div>
              
//               <div className="relative h-[400px] overflow-hidden">
//                 {/* Images */}
//                 <div
//                   className="flex transition-transform duration-700 ease-out h-full"
//                   style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//                 >
//                   {images.map((image, index) => (
//                     <div key={index} className="w-full h-full flex-shrink-0 relative">
//                       <img
//                         src={image}
//                         alt={`Achievement ${index + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
//                         <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
//                           <h4 className="text-xl font-bold">Student Achievement {index + 1}</h4>
//                           <p className="text-sm opacity-90">Celebrating excellence in academics and beyond</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Navigation Arrows */}
//                 <button
//                   onClick={goToPrevious}
//                   className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-all duration-300"
//                   onMouseEnter={() => setIsAutoPlaying(false)}
//                   onMouseLeave={() => setIsAutoPlaying(true)}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//                     <polyline points="15 18 9 12 15 6"></polyline>
//                   </svg>
//                 </button>

//                 <button
//                   onClick={goToNext}
//                   className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-all duration-300"
//                   onMouseEnter={() => setIsAutoPlaying(false)}
//                   onMouseLeave={() => setIsAutoPlaying(true)}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//                     <polyline points="9 18 15 12 9 6"></polyline>
//                   </svg>
//                 </button>

//                 {/* Indicators */}
//                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
//                   {images.map((_, index) => (
//                     <button
//                       key={index}
//                       onClick={() => goToSlide(index)}
//                       className={`w-2 h-2 rounded-full transition-colors ${
//                         index === currentIndex ? "w-6 bg-white" : "bg-white/50 hover:bg-white/70"
//                       }`}
//                       onMouseEnter={() => setIsAutoPlaying(false)}
//                       onMouseLeave={() => setIsAutoPlaying(true)}
//                     />
//                   ))}
//                 </div>
//               </div>

//               {/* Highlighted achievers */}
//               <div className="p-6">
//                 <h4 className="text-lg font-bold text-gray-800 mb-4">Highlighted Achievers</h4>
//                 <div className="grid grid-cols-3 gap-4">
//                   {highlightAchievers.map((achiever) => (
//                     <div key={achiever.id} className="flex flex-col items-center">
//                       <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-blue-100 mb-2 border-2 border-blue-500">
//                         <img 
//                           src={achiever.image} 
//                           alt={achiever.name} 
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <h3 className="font-semibold text-gray-800 text-center text-sm">{achiever.name}</h3>
//                       <p className="text-xs text-blue-600 text-center">{achiever.achievement}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right content div */}
//           <div className="lg:w-3/5">
//             {/* Text content */}
//             <div className="mb-8">
//               <h2 className="text-3xl font-bold mb-4 text-gray-900">
//                 Celebrating Academic Excellence
//               </h2>
//               <p className="text-gray-700 leading-relaxed mb-4">
//                 Our students consistently achieve outstanding results through dedication, hard work, and the guidance of our expert faculty. We believe in creating an environment that nurtures talent and encourages students to push beyond their limits.
//               </p>
//               <p className="text-gray-700 leading-relaxed">
//                 From academic achievements to professional placements, our achievers showcase the quality of education and mentorship provided at our institution. Their success is a testament to our commitment to excellence in education.
//               </p>
//             </div>

//             {/* Achiever slider */}
//             <div className="bg-white rounded-xl overflow-hidden shadow-lg">
//               <AchieverSlider />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OurAchievers;

