import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const PetListing = () => {
  const pets = [
    {
      id: 1,
      name: "Kevin",
      age: "3yr",
      image: "https://i.ibb.co/b5NnzgsQ/Kevin.jpg",
      description: "Kevin is playful, friendly, and great with kids.",
      location: "New York",
      category: "Dog",
      isAdopted: false,
      createdAt: "2024-07-01",
    },
    {
      id: 2,
      name: "Jamie",
      age: "3yr",
      image: "https://i.ibb.co/KzfQ0F3r/Jamie.jpg",
      description: "Jamie is calm and social.",
      location: "San Francisco",
      category: "Cat",
      isAdopted: false,
      createdAt: "2025-06-30",
    },
    {
      id: 3,
      name: "Rep",
      age: "8mo",
      image: "https://i.ibb.co/MDKk0M3p/Doris.jpg",
      description: "Young, bright, and loving—Doris seeks a family.",
      location: "Austin",
      category: "Dog",
      isAdopted: false,
      createdAt: "2022-06-28",
    },
    {
      id: 4,
      name: "Bugs",
      age: "3yr",
      image: "https://i.ibb.co/5XKKLGWH/Bugs.jpg",
      description: "Curious and playful, Bugs loves exploring.",
      location: "Chicago",
      category: "Rabbit",
      isAdopted: true,
      createdAt: "2024-06-20",
    },
    {
      id: 5,
      name: "Rebecca",
      age: "3yr",
      image: "https://i.ibb.co/8Dy30w6c/Rebecca.jpg",
      description: "Friendly and calm, Rebecca gets along with all pets.",
      location: "Los Angeles",
      category: "Cat",
      isAdopted: false,
      createdAt: "2024-06-15",
    },
    {
      id: 6,
      name: "Denise",
      age: "8mo",
      image: "https://i.ibb.co/V0TqKkn3/Denise.jpg",
      description: "Sweet and affectionate, Denise adores cuddles.",
      location: "Seattle",
      category: "Dog",
      isAdopted: false,
      createdAt: "2024-06-10",
    },
    {
      id: 7,
      name: "Charlie",
      age: "3yr",
      image: "https://i.ibb.co/HTvK3FQD/Charlie.jpg",
      description: "Charlie loves walks and needs a gentle owner.",
      location: "Miami",
      category: "Dog",
      isAdopted: true,
      createdAt: "2024-06-01",
    },
    {
      id: 8,
      name: "Doris",
      age: "8mo",
      image: "https://i.ibb.co/MDKk0M3p/Doris.jpg",
      description: "Young, bright, and loving—Doris seeks a family.",
      location: "Austin",
      category: "Dog",
      isAdopted: true,
      createdAt: "2025-07-08",
    },
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");



  // Get unique categories from pets for dropdown
  const categories = [...new Set(pets.map((pet) => pet.category))];

  // Filter and sort pets according to your requirements
  const filteredPets = pets
    .filter((pet) => !pet.isAdopted) // show only not adopted
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
                to={`/petsListing/${pet.id}`}
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
