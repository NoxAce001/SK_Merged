import {
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
    FaInstagram,
    FaYoutube,
} from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-6">
                <div className="flex flex-wrap justify-between gap-10 md:gap-6">
                    
                    {/* Logo & Description */}
                    <div className="w-full md:w-1/4 flex flex-col items-start">
                        <img
                            src="/assets/Logo.jpg"
                            alt="SkEdutech"
                            className="w-40 h-14 rounded-md border-2"
                        />
                        <p className="text-gray-400 mt-4 text-sm">
                            Empowering education through technology & excellence.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="w-full md:w-3/4 grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
                            <ul className="space-y-2">
                                <li className="cursor-pointer hover:text-orange-400">Home</li>
                                <li className="cursor-pointer hover:text-orange-400">Our Services</li>
                                <li className="cursor-pointer hover:text-orange-400">About Us</li>
                                <li className="cursor-pointer hover:text-orange-400">Contact Us</li>
                                <li className="cursor-pointer hover:text-orange-400">Certifications</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-3">Franchise</h3>
                            <ul className="space-y-2">
                                <li className="cursor-pointer hover:text-orange-400">Verifications</li>
                                <li className="cursor-pointer hover:text-orange-400">Franchise Registration</li>
                                <li className="cursor-pointer hover:text-orange-400">Franchise Details</li>
                                <li className="cursor-pointer hover:text-orange-400">Our Team</li>
                                <li className="cursor-pointer hover:text-orange-400">Registered Centers</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-3">More Info</h3>
                            <ul className="space-y-2">
                                <li className="cursor-pointer hover:text-orange-400">Gallery</li>
                                <li className="cursor-pointer hover:text-orange-400">Our Blogs</li>
                                <li className="cursor-pointer hover:text-orange-400">Terms & Conditions</li>
                                <li className="cursor-pointer hover:text-orange-400">Privacy Policy</li>
                                <li className="cursor-pointer hover:text-orange-400">Refund Policy</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 my-8"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    
                    {/* Language Selector */}
                    <button className="border border-white text-white px-6 py-2 rounded-lg hover:bg-white hover:text-black transition">
                        English
                    </button>

                    {/* Social Media Links */}
                    <div className="flex space-x-5">
                        <a href="https://facebook.com" className="text-blue-500 hover:text-blue-700 transition">
                            <FaFacebookF size={20} />
                        </a>
                        <a href="https://twitter.com" className="text-blue-400 hover:text-blue-600 transition">
                            <FaTwitter size={20} />
                        </a>
                        <a href="https://linkedin.com" className="text-blue-600 hover:text-blue-800 transition">
                            <FaLinkedinIn size={20} />
                        </a>
                        <a href="https://instagram.com" className="text-pink-500 hover:text-pink-700 transition">
                            <FaInstagram size={20} />
                        </a>
                        <a href="https://youtube.com" className="text-red-500 hover:text-red-700 transition">
                            <FaYoutube size={20} />
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <p className="text-center text-gray-400 mt-6 text-sm">
                    © 2024 SkEdutech. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;