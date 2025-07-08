// CallToAction.jsx
import React from "react";

const CallToAction = () => {
  return (
    <section className="py-16 px-6 bg-base-100">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        {/* Image Grid */}
        <div className="grid grid-cols-2 gap-4">
          <img
            src="https://i.ibb.co/JFQKH6QK/img1.webp"
            alt="Happy pet 1"
            className="rounded-xl h-48 object-cover"
          />
          <img
            src="https://i.ibb.co/rKjbnr1m/img2.jpg"
            alt="Happy pet 2"
            className="rounded-xl h-48 object-cover"
          />
        
          <img
            src="https://i.ibb.co/6RN0cfxX/img5.jpg"
            alt="Happy pet 4"
            className="rounded-xl h-48 object-cover"
          />
            <img
            src="https://i.ibb.co/XfNvvnHy/img3.jpg"
            alt="Happy pet 3"
            className="rounded-xl h-48 object-cover"
          />
        </div>

        {/* Text Content */}
        <div className="text-center lg:text-left">
          <h2 className="text-4xl font-bold mb-4 text-primary">
            Make a Difference – Adopt a Life 🐾
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Every pet deserves a second chance at happiness. By choosing adoption, you're not just saving a life — you're gaining a loyal companion.
            Join us in our mission to give every pet a loving home.
          </p>
          <button className="btn btn-primary text-lg px-8">
            View Available Pets
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
