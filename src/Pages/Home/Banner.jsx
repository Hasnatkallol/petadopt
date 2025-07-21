import React from "react";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className=" dark:bg-gray-900 text-black dark:text-white py-16 px-4 lg:px-24 transition-colors duration-300">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-primary">
          Welcome to <span>PetShop</span>
        </h1>
        <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8">
          Discover, adopt, and support our furry friends. Join our mission to help every pet find a loving home.
        </p>
        <Link
          to="/petsListing"
          className="inline-block bg-accent text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition"
        >
          Browse Pets
        </Link>
      </div>
    </div>
  );
};

export default Banner;
