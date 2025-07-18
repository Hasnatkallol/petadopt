import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const PetListing = () => {
  const [pets, setPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/adoptPet",{credentials: "include"});
        const data = await response.json();
        setPets(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // Get unique categories from pets for dropdown
  const categories = [...new Set(pets.map((pet) => pet.category))];

  // Filter and sort pets according to your requirements
  const filteredPets = pets
    .filter((pet) => pet.isAdopted === false)
    .filter((pet) => pet.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((pet) =>
      selectedCategory ? pet.category === selectedCategory : true
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Adopt a Pet</h1>

      {/* Search and category filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search pets by name..."
          className="input border-1 p-2 rounded-2xl border-gray-400 shadow-2xl input-bordered w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="select border-1 p-2 rounded-2xl border-gray-400 shadow-2xl select-bordered w-full md:w-1/4"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Pets Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {filteredPets.length === 0 && (
          <div className="col-span-full text-center text-gray-500 mt-10">
            No pets found.
          </div>
        )}

        {filteredPets.map((pet) => (
          <motion.div
            key={pet._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden"
          >
            <img
              className="rounded-t-lg w-full h-48 object-cover"
              src={pet.image}
              alt={pet.name}
            />
            <div className="p-5">
              <h5 className="text-xl font-semibold tracking-tight text-gray-900 mb-2">
                {pet.name}
              </h5>
              <p className="mb-1 text-gray-700">Age: {pet.age}</p>
              <p className="mb-3 text-gray-700">Location: {pet.location}</p>
              <p className="mb-3 text-gray-700"> {pet.shortDescription}</p>
              <div className="text-right">
                <Link to={`/petsListing/${pet._id}`}>
                  <button className="inline-block px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 font-medium">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PetListing;
