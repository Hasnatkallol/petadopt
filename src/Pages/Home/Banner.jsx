import React from 'react';
import petVideo from '../../assets/petVideo/petvideo.mp4';

const Banner = () => {
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

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30 backdrop-brightness-75 z-0"></div>

      {/* Centered Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight drop-shadow-xl">
          Welcome to Pet Haven
        </h1>
        <p className="text-white text-base sm:text-lg md:text-xl max-w-2xl mb-6 drop-shadow-md">
          Where every paw has a story. Discover love, care, and companionship with our furry friends.
        </p>
        {/* Optional CTA button */}
        <button className="bg-accent text-white font-semibold py-2 px-6 rounded-full shadow-md hover:scale-105 transition duration-300">
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default Banner;
