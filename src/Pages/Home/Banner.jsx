import React, { useContext } from "react";
import petVideo from "../../assets/petVideo/petvideo.mp4";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import { Link } from "react-router";

const Banner = () => {
  const { theme } = useContext(FirebaseAuthContext);

  return (
    <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={petVideo}
        autoPlay
        muted
        loop
        playsInline
      />
      
      {/* Semi-transparent overlay - keeps video visible but ensures text contrast */}
      <div className={`absolute inset-0 ${
        theme === "dark" ? "bg-black/50" : "bg-black/50"
      } z-0`}></div>
      
      {/* Centered Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">
        {/* Main heading - always white with strong shadow for contrast */}
        <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)]">
          Ready to Adopt!
        </h2>
        
        {/* Description text - white with slightly softer shadow */}
        <p className="text-white text-base sm:text-lg md:text-xl max-w-2xl mb-8 [text-shadow:_0_1px_4px_rgba(0,0,0,0.6)]">
          Where every paw has a story. Discover love, care, and companionship with our furry friends.
        </p>
        
        {/* CTA button - using your accent color */}
      <Link to='/petsListing' className="">
         <button 
          className="bg-[#FBAE02] text-black font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-[#e09e00] hover:scale-105 transition duration-300"
        >
          View Puppies
        </button>
       </Link>
      </div>
    </div>
  );
};

export default Banner;