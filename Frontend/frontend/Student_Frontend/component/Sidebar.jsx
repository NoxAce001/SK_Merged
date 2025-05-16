import { useState } from "react";
import { 
  FaTrophy, 
  FaUser, 
  FaMoneyBill, 
  FaRegStickyNote, 
  FaVideo, 
  FaBook, 
  FaGraduationCap 
} from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { MdFeedback } from "react-icons/md";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai"; // For Mobile Toggle

const Sidebar = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", icon: <FaTrophy /> },
    { name: "Manage Profile", icon: <FaUser /> },
    { name: "Fees", icon: <FaMoneyBill /> },
    { name: "Notes", icon: <FaRegStickyNote /> },
    { name: "Course Videos", icon: <FaVideo /> },
    { name: "Exam", icon: <FaBook /> },
    { name: "Certificate", icon: <FaGraduationCap /> },
    {name: "Feedback", icon: <MdFeedback />},
    {name: "Help and Support", icon: <MdSupportAgent />}
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden p-3 fixed top-4 left-4 z-50 bg-gray-800 text-white rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen bg-gray-900 text-white p-4 w-64 
                      transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <h2 className="text-2xl font-bold text-center text-blue-400 mb-6">SKEDUTEH</h2>

        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-700"
                onClick={() => onSelect(item.name)}
              >
                {item.icon} {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
