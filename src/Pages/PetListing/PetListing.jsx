import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Select from "react-select";

const LIMIT = 6;

const PetListing = () => {
  const { theme } = useContext(FirebaseAuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const axiosPublic = useAxiosPublic();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({ value: "", label: "All Pets" });

  useEffect(() => {
    const fetchData = async () => {
      const pet = await axiosPublic.get("/categories");
      const data = await pet.data;
      setCategories(data);
    };
    fetchData();
  }, [axiosPublic]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["pets"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosPublic.get(`/adoptPet?page=${pageParam}&limit=${LIMIT}`);
      return res.data;
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const allPets = data?.pages.flatMap((page) => page.pets) || [];

  const filteredPets = allPets
    .filter((pet) => pet.isAdopted === false)
    .filter((pet) => pet.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((pet) => {
      if (!category || category.value === "") return true;
      return pet.category.toLowerCase() === category.value.toLowerCase();
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const themeStyles = {
    light: {
      bg: "bg-gray-50",
      text: "text-gray-800",
      card: "bg-white border border-gray-100",
      input: "bg-white border-gray-300 focus:border-blue-500",
      button: "bg-blue-600 hover:bg-blue-700",
      secondaryText: "text-gray-600",
      accent: "text-blue-600",
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      card: "bg-gray-800 border-gray-700",
      input: "bg-gray-700 border-gray-600 focus:border-blue-400",
      button: "bg-blue-500 hover:bg-blue-600",
      secondaryText: "text-gray-300",
      accent: "text-blue-400",
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "9999px",
      paddingLeft: "10px",
      paddingRight: "10px",
      borderColor: "#ccc",
      boxShadow: "none",
      minHeight: "48px",
      backgroundColor: currentTheme.input.includes("bg-gray-700") ? "#374151" : "white",
      color: currentTheme.text.includes("text-gray-100") ? "white" : "black",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "12px",
      zIndex: 100,
      backgroundColor: currentTheme.input.includes("bg-gray-700") ? "#374151" : "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? (currentTheme.input.includes("bg-gray-700") ? "#1E40AF" : "#e0f2fe")
        : (currentTheme.input.includes("bg-gray-700") ? "#374151" : "white"),
      color: currentTheme.text.includes("text-gray-100") ? "white" : "black",
      borderRadius: "8px",
      padding: 10,
      margin: 2,
      cursor: "pointer",
      "&:hover": {
        backgroundColor: currentTheme.input.includes("bg-gray-700") ? "#4B5563" : "#f3f4f6",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: currentTheme.text.includes("text-gray-100") ? "white" : "black",
    }),
    input: (provided) => ({
      ...provided,
      color: currentTheme.text.includes("text-gray-100") ? "white" : "black",
    }),
  };

  const categoryOptions = [
    { value: "", label: "All Pets" },
    ...categories.map((cat) => ({
      value: cat.name.toLowerCase(),
      label: cat.name,
    })),
  ];

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${currentTheme.bg}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className={`mt-4 ${currentTheme.text}`}>Loading pets...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${currentTheme.bg}`}>
        <div className="text-center">
          <p className={`text-red-500 ${currentTheme.text}`}>
            Error loading pets. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${currentTheme.bg} ${currentTheme.text}`}>
      <div className={`min-h-screen py-8 w-11/12 mx-auto`}>
        <div className="">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold mb-4"
            >
              Find Your <span className={currentTheme.accent}>Perfect</span> Pet
            </motion.h1>
            <p className={`text-lg max-w-2xl mx-auto ${currentTheme.secondaryText}`}>
              Browse our adorable pets waiting for their forever homes
            </p>
          </div>

 

          {/* Search & Category Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12"
          >
            <div className="w-full md:w-1/2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by pet name..."
                  className={`w-full px-5 py-3 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${currentTheme.input} ${currentTheme.text}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute right-4 top-3.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Select */}
            <div className="w-full md:w-1/3">
              <Select
                options={categoryOptions}
                value={category}
                onChange={setCategory}
                isClearable
                placeholder="Filter by Category"
                styles={customSelectStyles}
                className="react-select-container capitalize"
                classNamePrefix="react-select"
              />
            </div>
          </motion.div>

          {/* Pets Grid */}
          {filteredPets.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="text-5xl mb-4">🐾</div>
              <h3 className="text-2xl font-medium mb-2">No pets found</h3>
              <p className={`${currentTheme.secondaryText}`}>
                {category.value !== "" 
                  ? `No ${category.label} pets match your search` 
                  : "Try adjusting your search criteria"}
              </p>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPets.map((pet) => (
                  <motion.div
                    key={pet._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                    className={`rounded-xl shadow-md overflow-hidden transition-all duration-300 ${currentTheme.card}`}
                  >
                    <div className="relative h-56 w-full overflow-hidden">
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        src={pet.image}
                        alt={pet.name}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x200?text=Pet+Image";
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-xl font-semibold text-white">{pet.name}</h3>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className={`text-sm ${currentTheme.secondaryText}`}>
                            <span className="font-medium">Age:</span> {pet.age}
                          </p>
                          <p className={`text-sm ${currentTheme.secondaryText}`}>
                            <span className="font-medium">Location:</span> {pet.location}
                          </p>
                        </div>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${currentTheme.accent.replace("text", "bg")} bg-opacity-20`}>
                          {pet.category}
                        </span>
                      </div>

                      <p className={`mb-4 text-sm ${currentTheme.secondaryText}`}>
                        {pet.shortDescription}
                      </p>

                      <Link to={`/petsListing/${pet._id}`}>
                        <button
                          className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-colors ${currentTheme.button}`}
                        >
                          Meet {pet.name}
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div ref={ref} className="h-10 mt-10 flex justify-center items-center">
                {isFetchingNextPage && (
                  <p className={`text-sm ${currentTheme.text}`}>Loading more pets...</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetListing;