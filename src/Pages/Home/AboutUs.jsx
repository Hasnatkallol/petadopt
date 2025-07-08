// AboutUs.jsx
import React from "react";
import Image from '../../assets/ImageForCallToSection/aboutImg.jpg'

const AboutUs = () => {
  return (
    <section className="py-16 px-6 bg-base-100">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left Side - Image */}
        <div>
          {/* Subtitle with left line */}
          <div className="flex items-center mb-2">
            <div className="w-12 h-1 bg-primary mr-3 rounded"></div>
            <h4 className="text-primary text-lg font-semibold uppercase">
              About Us
            </h4>
          </div>

          <h2 className="text-4xl font-bold mb-4">Connecting Pets with Loving Families</h2>
          <p className="text-gray-700 text-lg mb-4">
            We believe every animal deserves a chance to be loved. Our platform
            was created to bridge the gap between homeless pets and compassionate
            families ready to adopt.
          </p>
          <p className="text-gray-600">
            Using our site, you can explore a wide range of pets, connect with verified
            shelters, and take the first step toward giving a pet a forever home.
            Together, we can change lives — one adoption at a time.
          </p>
        </div>

        {/* Right Side - Text */}
        

        <div>
          <img
            src={Image}
            alt="About Us"
            className="rounded-2xl shadow-lg w-full object-cover h-[520px]"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
