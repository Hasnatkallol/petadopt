import React from "react";

const steps = [
  {
    id: 1,
    title: "Find Your Perfect Pet",
    description: "Browse our categories and profiles to discover pets looking for a loving home.",
    icon: "🐾",
  },
  {
    id: 2,
    title: "Connect With Shelters",
    description: "Reach out directly to shelters or foster families through our platform.",
    icon: "📞",
  },
  {
    id: 3,
    title: "Adopt & Give Love",
    description: "Complete the adoption process and welcome your new furry friend home!",
    icon: "🏠",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 px-6 bg-base-200">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-primary mb-4">How It Works</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Our easy 3-step process helps you find and adopt the perfect pet hassle-free.
        </p>
      </div>
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center">
        {steps.map(({ id, title, description, icon }) => (
          <div key={id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
