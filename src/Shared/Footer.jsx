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
import { NavLink } from "react-router-dom";
import footerLogo from "../assets/Footer/logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#1b1b1b] text-white pt-10 text-center">
      {/* Logo */}
      <div className="mb-8">
        <img src={footerLogo} alt="Tailwag Logo" className="h-10 mx-auto" />
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm text-gray-300 mb-10">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-[#f55252] font-semibold transition"
              : "hover:text-white transition"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/petsListing"
          className={({ isActive }) =>
            isActive
              ? "text-[#f55252] font-semibold transition"
              : "hover:text-white transition"
          }
        >
          Pet Listing
        </NavLink>
        <NavLink
          to="/donations"
          className={({ isActive }) =>
            isActive
              ? "text-[#f55252] font-semibold transition"
              : "hover:text-white transition"
          }
        >
          Donation Campaigns
        </NavLink>
      </div>

      {/* Info Cards */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-10 lg:gap-14 mb-10 px-6">
        {/* Address */}
        <div className="text-center">
          <div className="bg-[#f55252] rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-lg">
            <FaMapMarkerAlt className="text-white text-2xl" />
          </div>
          <p className="mt-4 text-sm text-gray-300 leading-relaxed">
            BG Press Staff Quarter
            <br />
            Tejgaon, Dhaka -1208
          </p>
        </div>

        {/* Phone */}
        <div className="text-center">
          <div className="bg-[#f55252] rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-lg">
            <FaPhoneAlt className="text-white text-2xl" />
          </div>
          <p className="mt-4 text-sm text-gray-300 leading-relaxed">
            Office: 772-619-6309
            <br />
            Inquiries: 772-619-6432
          </p>
        </div>

        {/* Hours */}
        <div className="text-center">
          <div className="bg-[#f55252] rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-lg">
            <FaSyncAlt className="text-white text-2xl" />
          </div>
          <p className="mt-4 text-sm text-gray-300 leading-relaxed">
            Mon - Fri: 9am - 8pm
            <br />
            Sat – Sun: Closed
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 px-6 flex flex-col items-center text-sm text-gray-400 gap-3">
        <p>
          © Copyrights are Reserved by{" "}
          <span className="text-white font-medium">Hasnat Kallol</span>
        </p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-white transition">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-white transition">
            <FaEnvelope />
          </a>
          <a href="#" className="hover:text-white transition">
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
