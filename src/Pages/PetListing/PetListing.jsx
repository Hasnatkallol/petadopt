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
        const response = await fetch("http://localhost:5000/adoptPet");
        const data = await response.json();
        setPets(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  });
    const { _id } = pets;

  // Get unique categories from pets for dropdown
  const categories = [...new Set(pets.map((pet) => pet.category))];

  // Filter and sort pets according to your requirements
  const filteredPets = pets
    .filter((pet) => pet.isAdopted == false)
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
          className="input input-bordered w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="select select-bordered w-full md:w-1/4"
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
            key={pet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="card bg-base-100 shadow-xl"
          >
            <figure>
              <img
                src={pet.image}
                alt={pet.name}
                className="h-48 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{pet.name}</h2>
              <p>Age: {pet.age}</p>
              <p>Location: {pet.location}</p>
              <Link
                to={`/petsListing/${pet._id}`}
                className="card-actions justify-end"
              >
                <button className="btn btn-primary">View Details</button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PetListing;
