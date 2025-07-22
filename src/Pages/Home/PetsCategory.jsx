import React, { useContext } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import Toggle from "../../Theme/Toggle";


const PetsCategory = () => {
  const { theme } = useContext(FirebaseAuthContext);
  const isDark = theme === "dark";

  const categories = [
    { name: "Cats", icon: "🐱", count: 28, color: isDark ? "bg-blue-900/30" : "bg-blue-100" },
    { name: "Dogs", icon: "🐶", count: 95, color: isDark ? "bg-amber-900/30" : "bg-amber-100" },
    { name: "Rabbits", icon: "🐰", count: 42, color: isDark ? "bg-purple-900/30" : "bg-purple-100" },
    { name: "Fish", icon: "🐠", count: 36, color: isDark ? "bg-teal-900/30" : "bg-teal-100" },
    { name: "Birds", icon: "🦜", count: 28, color: isDark ? "bg-yellow-900/30" : "bg-yellow-100" },
    { name: "Others", icon: "🦎", count: 18, color: isDark ? "bg-pink-900/30" : "bg-pink-100" },
  ];

  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 ${isDark ? "bg-[#0F172A]" : "bg-white"}`}>
      <div className="w-11/12 mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="text-center mx-auto">
            <h2 className={`text-4xl font-bold ${isDark ? "text-[#F8FAFC]" : "text-gray-900"} mb-3`}>
              Find Your Perfect Pet Companion
            </h2>
            <p className={`text-lg ${isDark ? "text-[#CBD5E1]" : "text-gray-600"} max-w-2xl mx-auto`}>
              Browse our wide selection of pets waiting for their forever homes
            </p>
          </div>
          
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className={`${category.color} rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group border ${isDark ? "border-[#1E293B]" : "border-gray-200"}`}
            >
              <div className="flex flex-col items-center">
                <span className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-110">
                  {category.icon}
                </span>
                <h3 className={`text-lg font-semibold ${isDark ? "text-[#F8FAFC]" : "text-gray-800"} mb-1`}>
                  {category.name}
                </h3>
                <p className={`text-sm ${isDark ? "text-[#CBD5E1]" : "text-gray-600"}`}>
                  {category.count} available
                </p>
              </div>
            </div>
          ))}
        </div>

    
      </div>
    </section>
  );
};

export default PetsCategory;