// PetsCategory.jsx
import React from "react";

const categories = [
  { name: "Cats", icon: "🐱" },
  { name: "Dogs", icon: "🐶" },
  { name: "Rabbits", icon: "🐰" },
  { name: "Fish", icon: "🐟" },
  { name: "Birds", icon: "🐦" },
  { name: "Others", icon: "🦎" },
];

const PetsCategory = () => {
  return (
    <section className="py-12 bg-base-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Browse by Pet Category</h2>
        <p className="text-sm text-gray-500">
          Find your perfect companion by type
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 px-4">
        {categories.map((category) => (
          <div
            key={category.name}
            className="card bg-base-200 shadow-md hover:shadow-xl cursor-pointer"
          >
            <div className="card-body items-center text-center">
              <span className="text-4xl">{category.icon}</span>
              <h3 className="card-title text-lg">{category.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PetsCategory;
