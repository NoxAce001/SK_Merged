import React, { useState, useEffect } from "react";

const Navbar2 = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdownMobile, setOpenDropdownMobile] = useState(null);

  const navItems = [
    {
      title: "HOME",
      hasDropdown: true,
      dropdownItems: [
        { title: "Home Page 1", link: "/home1" },
        { title: "Home Page 2", link: "/home2" },
      ],
    },
    {
      title: "ABOUT",
      hasDropdown: true,
      dropdownItems: [
        { title: "About Us", link: "/about-us" },
        { title: "Our Aim", link: "/our-aim" },
        { title: "Accreditation", link: "/accreditation" },
      ],
    },
    {
      title: "STUDENT ZONE",
      hasDropdown: true,
      dropdownItems: [
        { title: "Student Zone", link: "/dashboard" },
        { title: "Book for Student", link: "/results" },
      ],
    },
    {
      title: "COURSES",
      hasDropdown: true,
      dropdownItems: [
        { title: "Computer Software", link: "/programming" },
        { title: "Computer Hardware", link: "/web-development" },
      ],
    },
    {
      title: "AFFILIATION PROCESS",
      hasDropdown: true,
      dropdownItems: [
        { title: "Computer Software", link: "/programming" },
        { title: "Computer Hardware", link: "/web-development" },
      ],
    },
    {
      title: "GALLERY",
      hasDropdown: true,
      dropdownItems: [
        { title: "Photos", link: "/programming" },
        { title: "Videos", link: "/web-development" },
      ],
    },
    {
      title: "DOWNLOAD",
      hasDropdown: true,
      dropdownItems: [
        { title: "Admission Form", link: "/programming" },
        { title: "Franchise Form", link: "/web-development" },
      ],
    },
    { title: "CONTACT", hasDropdown: false, link: "/contact-us" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-20 bg-white transition-all ${
        isScrolled ? "py-2 shadow-lg" : "py-4 shadow-md"
      }`}
    >
      <div className="max-w-full mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="w-40">
          <img src="/public/assets/Logo.jpg" alt="Logo" />
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex space-x-4">
          {navItems.map((item, index) => (
            <li key={index} className="relative group">
              <a
                href={item.link || "#"}
                className={`flex items-center px-4 py-6 text-sm font-medium transition-colors duration-300 ${
                  activeDropdown === index
                    ? "text-blue-500"
                    : "text-gray-700 hover:text-blue-500"
                }`}
                onMouseEnter={() => setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
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

              {/* Dropdown */}
              {item.hasDropdown && (
                <div
                  className={`absolute left-0 w-40 bg-white shadow-lg py-2 rounded-md transition-all duration-300 ${
                    activeDropdown === index
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }`}
                >
                  {item.dropdownItems.map((dropdownItem, idx) => (
                    <a
                      key={idx}
                      href={dropdownItem.link}
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-100"
                    >
                      {dropdownItem.title}
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Login Button for Desktop */}
        {/* <a href="/login" className="hidden lg:block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
          Login
        </a> */}

        <button 
        className="hidden lg:block bg-transparent hover:bg-[#003366] text-[#003366] font-semibold text-xl hover:text-white py-2 px-8 m border border-[#003366] hover:border-transparent rounded-md duration-300"
        >
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
          } lg:hidden`}
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
    </nav>
  );
};

export default Navbar2;
