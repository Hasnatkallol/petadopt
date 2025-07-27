import React from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSyncAlt,
  FaFacebookF,
  FaTwitter,
  FaEnvelope,
  FaInstagram,
} from "react-icons/fa";
import footerLogo from "../assets/Footer/logo.png"; // Update path as needed
import { NavLink } from "react-router-dom"; // Use react-router-dom, not react-router

const Footer = () => {
  // Active link classes
  const activeClass =
    "text-[#f55252] font-semibold border-b-2 border-[#f55252] pb-1";

  return (
    <footer className="bg-[#1b1b1b] text-white w-full">
      {/* Top Section: Logo */}
      <div className="flex justify-center items-center py-8">
        <img src={footerLogo} alt="Tailwag Logo" className="h-10" />
      </div>

      {/* Info Cards */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-3 gap-8 px-6 md:px-20 text-center mb-10 min-w-[320px]">
          {/* Address */}
          <div className="flex flex-col items-center">
            <div className="bg-[#f55252] rounded-full w-14 h-14 flex items-center justify-center mb-3">
              <FaMapMarkerAlt className="text-white text-xl" />
            </div>
            <p className="text-sm">
              5/16 Tejgaon,
              <br />
              Dhaka - 1208
            </p>
          </div>

          {/* Phone */}
          <div className="flex flex-col items-center">
            <div className="bg-[#f55252] rounded-full w-14 h-14 flex items-center justify-center mb-3">
              <FaPhoneAlt className="text-white text-xl" />
            </div>
            <p className="text-sm">
              Office: 772-619-6309
              <br />
              Inquiries: 772-619-6432
            </p>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="bg-[#f55252] rounded-full w-14 h-14 flex items-center justify-center mb-3">
              <FaSyncAlt className="text-white text-xl" />
            </div>
            <p className="text-sm">
              Mon - Fri: 9am – 8pm
              <br />
              Sat – Sun: Closed
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="border-t mx-2 border-gray-800 py-5">
        <ul className="flex flex-wrap justify-center gap-8 text-sm text-gray-300">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? activeClass : "hover:text-[#f55252] transition"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/petsListing"
            className={({ isActive }) =>
              isActive ? activeClass : "hover:text-[#f55252] transition"
            }
          >
            Pet Listing
          </NavLink>

          <NavLink
            to="/donations"
            className={({ isActive }) =>
              isActive ? activeClass : "hover:text-[#f55252] transition"
            }
          >
            Donation Campaigns
          </NavLink>
        </ul>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-4 px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <p className="mb-2 md:mb-0 text-center md:text-left">
          © Copyrights are Reserved by{" "}
          <span className="text-white font-medium">Hasnat Kallol</span>
        </p>
        <div className="flex gap-4 justify-center md:justify-start">
          <a href="#" className="hover:text-white transition" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-white transition" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-white transition" aria-label="Email">
            <FaEnvelope />
          </a>
          <a href="#" className="hover:text-white transition" aria-label="Instagram">
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
