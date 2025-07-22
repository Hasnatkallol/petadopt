import React, { useContext } from "react";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import { Link } from "react-router";

const CallToAction = () => {
  const { theme } = useContext(FirebaseAuthContext);
  const isDark = theme === "dark";

  return (
    <section className={`py-16 px-4 ${isDark ? "bg-[#0F172A]" : "bg-white"}`}>
      <div className="w-11/12  mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Image Grid */}
        <div className="grid grid-cols-2 gap-4">
          <img
            src="https://i.ibb.co/JFQKH6QK/img1.webp"
            alt="Happy pet 1"
            className={`rounded-xl h-48 w-full object-cover ${
              isDark ? "border-[#1E293B]" : "border-gray-200"
            } border-2`}
          />
          <img
            src="https://i.ibb.co/rKjbnr1m/img2.jpg"
            alt="Happy pet 2"
            className={`rounded-xl h-48 w-full object-cover ${
              isDark ? "border-[#1E293B]" : "border-gray-200"
            } border-2`}
          />
          <img
            src="https://i.ibb.co/6RN0cfxX/img5.jpg"
            alt="Happy pet 4"
            className={`rounded-xl h-48 w-full object-cover ${
              isDark ? "border-[#1E293B]" : "border-gray-200"
            } border-2`}
          />
          <img
            src="https://i.ibb.co/XfNvvnHy/img3.jpg"
            alt="Happy pet 3"
            className={`rounded-xl h-48 w-full object-cover ${
              isDark ? "border-[#1E293B]" : "border-gray-200"
            } border-2`}
          />
        </div>

        {/* Text Content */}
        <div className="text-center lg:text-left">
          <h2
            className={`text-4xl font-bold mb-6 ${
              isDark ? "text-[#60A5FA]" : "text-[#FBAE02]"
            }`}
          >
            Make a Difference – Adopt a Life 🐾
          </h2>
          <p
            className={`text-lg mb-8 ${
              isDark ? "text-[#CBD5E1]" : "text-gray-600"
            }`}
          >
            Every pet deserves a second chance at happiness. By choosing
            adoption, you're not just saving a life — you're gaining a loyal
            companion. Join us in our mission to give every pet a loving home.
          </p>
          <Link to='/petsListing' >
            <button
              className={`px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                isDark
                  ? "bg-[#60A5FA] hover:bg-[#3B82F6] text-white"
                  : "bg-[#FBAE02] hover:bg-[#e09e00] text-gray-900"
              }`}
            >
              View Available Pets
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
