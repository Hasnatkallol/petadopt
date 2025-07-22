import React, { useContext } from "react";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import { FaPaw, FaHeart, FaHome } from "react-icons/fa";
import { GiDogHouse } from "react-icons/gi";

const HowItWorks = () => {
  const { theme } = useContext(FirebaseAuthContext);
  
  const steps = [
    {
      id: 1,
      title: "Discover Your Match",
      description: "Browse our verified pet profiles and find your perfect companion.",
      icon: <FaPaw className="w-full h-full" />,
      color: "text-[#FBAE02]"
    },
    {
      id: 2,
      title: "Meet & Connect",
      description: "Schedule visits and chat directly with shelter staff.",
      icon: <FaHeart className="w-full h-full" />,
      color: "text-[#e09e00]"
    },
    {
      id: 3,
      title: "Bring Them Home",
      description: "Complete adoption and start your new life together!",
      icon: <GiDogHouse className="w-full h-full" />,
      color: "text-[#FBAE02]"
    },
  ];

  return (
    <section className={`py-16 px-4 ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="w-11/12 mx-auto">
        {/* New Header Design */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center mb-4 px-6 py-2 rounded-full bg-[#FBAE02]/10">
            <FaPaw className="text-[#FBAE02] mr-2" />
            <span className={`${theme === "dark" ? "text-[#FBAE02]" : "text-[#e09e00]"} font-semibold uppercase text-sm`}>
              Happy Tails Start Here
            </span>
          </div>
          <h2 className={`${theme === "dark" ? "text-gray-200" : "text-gray-800"} text-4xl font-bold mb-3`}>
            How Adoption Works
          </h2>
          <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} max-w-xl mx-auto text-lg`}>
            Three simple steps to finding your new best friend
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className={`hidden md:block absolute top-1/4 left-0 right-0 h-1 ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"} z-0`}></div>
          
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`relative z-10 p-8 rounded-xl transition-all duration-300 hover:transform hover:-translate-y-2 ${
                theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"
              } shadow-lg hover:shadow-xl`}
            >
              {/* Step number */}
              <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center ${
                theme === "dark" ? "bg-gray-900 border-2 border-[#FBAE02]" : "bg-[#FBAE02]"
              } text-white font-bold`}>
                {index + 1}
              </div>
              
              {/* Icon */}
              <div className={`w-16 h-16 mx-auto mb-6 ${step.color}`}>
                {step.icon}
              </div>
              
              <h3 className={`${theme === "dark" ? "text-gray-200" : "text-gray-800"} text-xl font-semibold mb-3`}>
                {step.title}
              </h3>
              <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;