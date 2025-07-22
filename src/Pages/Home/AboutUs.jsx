import React, { useContext } from "react";
import Image from '../../assets/ImageForCallToSection/aboutImg.jpg';
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";

const AboutUs = () => {
  const { theme } = useContext(FirebaseAuthContext);

  return (
    <section className={`py-16 px-6 ${
      theme === "dark" ? "bg-gray-900" : "bg-gray-100"
    }`}>
      <div className="w-11/12  mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left Side - Text Content */}
        <div>
          {/* Subtitle with left line - matches banner's accent color */}
          <div className="flex items-center mb-2">
            <div className="w-12 h-1 bg-[#FBAE02] mr-3 rounded"></div>
            <h4 className="text-[#FBAE02] text-lg font-semibold uppercase">
              About Us
            </h4>
          </div>

          {/* Headings with same theme-based colors as banner */}
          <h2 className={`${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          } text-3xl sm:text-4xl font-bold mb-4`}>
            Connecting Pets with Loving Families
          </h2>
          
          {/* Paragraphs with theme-appropriate colors */}
          <p className={`${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          } text-base sm:text-lg mb-4`}>
            We believe every animal deserves a chance to be loved. Our platform
            was created to bridge the gap between homeless pets and compassionate
            families ready to adopt.
          </p>
          
          <p className={`${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          } text-base sm:text-lg mb-8`}>
            Using our site, you can explore a wide range of pets, connect with verified
            shelters, and take the first step toward giving a pet a forever home.
            Together, we can change lives — one adoption at a time.
          </p>
          
          {/* CTA Button - identical to Banner */}
          <Link to='/petsListing' className="inline-block">
            <button 
              className="bg-[#FBAE02] flex items-center gap-2 text-black font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-[#e09e00] hover:scale-105 transition duration-300"
            >
              View Puppies
              <FaArrowRight className="text-lg" />
            </button>
          </Link>
        </div>

        {/* Right Side - Image */}
        <div>
          <img
            src={Image}
            alt="Happy adopted pet"
            className={`rounded-2xl shadow-lg w-full object-cover h-[400px] sm:h-[450px] md:h-[520px] border-4 ${
              theme === "dark" ? "border-[#FBAE02]/30" : "border-[#FBAE02]/20"
            }`}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;