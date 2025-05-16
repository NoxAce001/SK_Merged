import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { StudentProvider } from "../AdminPanel_frontend/context/StudentContext";

import Sidebar from "../AdminPanel_frontend/Sidebar/Sidebar";
import StudentAchievementsPanel from "../AdminPanel_frontend/OurAchievers/Achievers";
import MainSliderUploadPage from "../AdminPanel_frontend/MainSlider/MainSliderImgUpload";
import AdminGalleryPanel from "../AdminPanel_frontend/GalleryPanel/AdminGalleryPanel";
import EventBox from "../AdminPanel_frontend/OurAchievers/EventBox";
import MarqueeManager from "../AdminPanel_frontend/MarqueeLine/Marquee";
import Dashboard from "../AdminPanel_frontend/Dashboard/Dashboard";

const AdminPanel = () => {
  return (
    <StudentProvider>
      <div className="h-screen flex flex-col">

        {/* Main Content */}
        <div className="flex flex-1">

          <Sidebar/>
 
          {/* Content Area */}
          <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
            <Routes>
              <Route path="dashboard" element={<Dashboard/>} /> 
              <Route path="achievers" element={<StudentAchievementsPanel/>} />
              <Route path="mainslider" element={<MainSliderUploadPage/>} /> 

              <Route path="gallery" element={<AdminGalleryPanel/>} />
           
              <Route path="marqueeline" element={<MarqueeManager />} />              

              <Route path="MM" element={<MarqueeManager/>} />
              <Route path="EventBox" element={<EventBox/>} />

            
            </Routes>
          </div>
        </div>
      </div>
    </StudentProvider>
  );
};

export default AdminPanel;
