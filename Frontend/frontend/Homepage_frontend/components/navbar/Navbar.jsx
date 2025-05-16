import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdownMobile, setOpenDropdownMobile] = useState(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/student/login"); // or whatever your login route is
  };

  const navItems = [
    {
      title: "HOME",
      hasDropdown: false,
      
    },
    {
      title: "ABOUT",
      hasDropdown: true,
      dropdownItems: [
        { title: "About Us", link: "/about-us" },
        { title: "Our Aim", link: "/our-aim" },
        { title: "Accreditation", link: "/accreditation" },
        { title: "Refund & Cancellation Policy", link: "/refund-policy" },
        { title: "Public Note", link: "/public-note" },
      ],
    },
    {
      title: "STUDENT ZONE",
      hasDropdown: true,
      dropdownItems: [
        { title: "Student Zone", link: "/dashboard" },
        { title: "Book for Student", link: "/results" },
        { title: "Login Panel", link: "/resources" },
        { title: "Student Enquiry Form", link: "/resources" },
      ],
    },
    {
      title: "COURSES",
      hasDropdown: true,
      dropdownItems: [
        { title: "Computer Software", link: "/programming" },
        { title: "Computer Hardware", link: "/web-development" },
        { title: "Vocational Course", link: "/data-science" },
        { title: "Nursery Teacher Traning", link: "/data-science" },
        { title: "Top Job oriented classes courses", link: "/data-science" },
      ],
    },
    {
      title: "AFFILIATION PROCESS",
      hasDropdown: true,
      dropdownItems: [
        {
          title: "Affiliation Process for registration",
          link: "/how-to-affiliate",
        },
        { title: "Reason Partners", link: "/benefits" },
        { title: "How To Get Franchise (Affiliation)", link: "/benefits" },
        { title: "How to Register Institute", link: "/benefits" },
        { title: "NTT Franchise Process", link: "/benefits" },
        { title: "Institute List in India", link: "/benefits" },
        { title: "Live: Top Center List", link: "/benefits" },
      ],
    },
    
    {
      title: "DOWNLOAD",
      hasDropdown: true,
      dropdownItems: [
        { title: "Download ", link: "/brochures" },
        { title: "Admission Form", link: "DEMO.pdf" },
        { title: "Franchise Form", link: "/study-materials" },
      ],
    },
    {
      title: "CONTACT",
      hasDropdown: true,
      dropdownItems: [
        { title: "Contact Us", link: "/contact-us" },
        { title: "Career", link: "/career" },
      ],
    },
    {
      title: "GALLERY",
      // link: "/gallery",
      hasDropdown: false,
      dropdownItems: [
        {link: "/gallery" },
      
      ],
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Track if user has scrolled at all
      if (window.scrollY > 10) {
        setHasScrolled(true);
      }

      // Track if user has scrolled beyond threshold
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      {/* Static navbar that's always visible at the top of the page on initial load */}

      {
        // !hasScrolled ||window.screenY==0&&
        // !hasScrolled &&

        <div className="top-0 left-0 w-full z-20 flex gap-15 shadow-md items-center bg-white">
          {/* Logo */}
          <div className="py-4 w-44 ml-15">
            <img src="/assets/Logo.jpg" alt="Logo" />
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex">
            <ul className="flex">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(index)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  
                  <a
                    href="/gallery"
                    className={`flex items-center px-4 py-6 text-sm font-medium transition-colors duration-300 ${
                      activeDropdown === index
                        ? "text-blue-500"
                        : "text-gray-700 hover:text-blue-500"
                    }`}
                  >
                    {item.title}
                    {item.hasDropdown && (
                      <svg
                        className={`w-4 h-4 ml-1 transform transition-transform duration-300 ${
                          activeDropdown === index ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    )}
                  </a>


                  {/* If dropdown is false ex:gallery
                  {item.hasDropdown==false && (
                      
                      {item.dropdownItems.map((dropdownItem, idx) => (
                        <a
                          key={idx}
                          href={dropdownItem.link}
                        >
                        </a>
                      ))}

                      

                   
                  )} */}

                  {/* Dropdown menu */}
                  {item.hasDropdown && (
                    <div
                      className={`absolute left-0 w-52 z-10 bg-white shadow-lg py-2 rounded-b-lg transform transition-all duration-300 ease-in-out origin-top ${
                        activeDropdown === index
                          ? "opacity-100 scale-y-100"
                          : "opacity-0 scale-y-0 invisible"
                      }`}
                    >
                      {item.dropdownItems.map((dropdownItem, idx) => (
                        <a
                          key={idx}
                          href={dropdownItem.link}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500 transition-colors duration-300"
                        >
                          {dropdownItem.title}
                        </a>
                      ))}

                      

                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <button onClick={handleLoginClick} className="hidden lg:block bg-transparent hover:bg-[#003366] text-[#003366] font-semibold text-xl hover:text-white py-2 px-8 m border border-[#003366] hover:border-transparent rounded-md duration-300">
            Login
          </button>

          
          
          {/* Mobile Menu Button */}
          <button
            
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>

          {/* Mobile Menu */}
          <div
            className={`fixed top-0 right-0 h-full w-2/3 bg-white shadow-lg transition-transform transform ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            } lg:hidden z-30`}
          >
            <button
              className="absolute top-4 right-4 text-xl"
              onClick={() => setIsMenuOpen(false)}
            >
              ✖
            </button>
            <ul className="mt-16 space-y-">
              {navItems.map((item, index) => (
                <li key={index} className="relative">
                  <button
                    onClick={() =>
                      setOpenDropdownMobile(
                        openDropdownMobile === index ? null : index
                      )
                    }
                    className="w-full text-left px-6 py-2 text-gray-700 flex justify-between items-center"
                  >
                    {item.title}{" "}
                    {item.hasDropdown && (
                      <svg
                        className={`w-4 h-4 ml-1 transform transition-transform duration-300 ${
                          openDropdownMobile === index ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    )}
                  </button>

                  {item.hasDropdown && openDropdownMobile === index && (
                    <div className="pl-8">
                      {item.dropdownItems.map((dropdownItem, idx) => (
                        <a
                          key={idx}
                          href={dropdownItem.link}
                          className="block px-6 py-2 text-gray-500 hover:text-gray-700"
                        >
                          {dropdownItem.title}
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              ))}

              {/* Login Button for Mobile */}
              <li className="px-6 mt-4">
                <a
                  href="/login"
                  // className="block text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
                  className="bg-[#003366] text-white font-semibold text-xl py-2 px-14 border rounded-md"
                >
                  Login
                </a>
              </li>
            </ul>
          </div>
        </div>
      }

      {/* Scrolling navbar that appears/disappears based on scroll position */}
      <div
        className={`fixed top-0 left-0 w-full z-20 flex gap-15 shadow-md items-center transition-transform duration-400 ${
          isScrolled ? "translate-y-0 bg-white shadow-lg" : "-translate-y-full"
        }`}
        style={{ display: hasScrolled ? "flex" : "none" }}
      >
        {/* Logo */}
        <div className="py-4 w-44 ml-15">
          <img src="/public/assets/Logo.jpg" alt="Logo" />
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex">
          <ul className="flex">
            {navItems.map((item, index) => (
              <li
                key={index}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href="#"
                  className={`flex items-center px-4 py-6 text-sm font-medium transition-colors duration-300 ${
                    activeDropdown === index
                      ? "text-blue-500"
                      : "text-gray-700 hover:text-blue-500"
                  }`}
                >
                  {item.title}
                  {item.hasDropdown && (
                    <svg
                      className={`w-4 h-4 ml-1 transform transition-transform duration-300 ${
                        activeDropdown === index ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  )}
                </a>

                {/* Dropdown menu */}
                {item.hasDropdown && window.scrollY && (
                  <div
                    className={`absolute left-0 w-52 z-10 bg-white shadow-lg py-2 rounded-b-lg transform transition-all duration-300 ease-in-out origin-top ${
                      activeDropdown === index
                        ? "opacity-100 scale-y-100"
                        : "opacity-0 scale-y-0 invisible"
                    }`}
                  >
                    {item.dropdownItems.map((dropdownItem, idx) => (
                      <a
                        key={idx}
                        href={dropdownItem.link}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500 transition-colors duration-300"
                      >
                        {dropdownItem.title}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <button className="hidden lg:block bg-transparent hover:bg-[#003366] text-[#003366] font-semibold text-xl hover:text-white py-2 px-8 m border border-[#003366] hover:border-transparent rounded-md duration-300">
          Login
        </button>
        
        {/* Mobile Menu Button */}
        <button
            
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        
      </div>
    </div>
  );
};

export default Navbar;

