import React, { useContext } from "react";
import CountUp from "react-countup";
import achievements from '../../assets/featuredPets/achievements.jpg';
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";

const AchievementsSection = () => {
  const { theme } = useContext(FirebaseAuthContext);

  // Define color variables based on theme
  const colors = {
    light: {
      bg: "bg-white",
      text: "text-gray-800",
      heading: "text-gray-900",
      subheading: "text-[#FBAE02]",
      description: "text-gray-700",
      counter: "text-[#FBAE02]",
      counterLabel: "text-gray-800",
      shadow: "shadow-xl"
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-200",
      heading: "text-gray-100",
      subheading: "text-[#FBAE02]",
      description: "text-gray-300",
      counter: "text-[#FBAE02]",
      counterLabel: "text-gray-200",
      shadow: "shadow-gray-700"
    }
  };

  const currentColors = colors[theme] || colors.light;

  return (
    <section className={`py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-20 ${currentColors.bg}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 xl:gap-16 items-center">
          {/* Left image - full width on mobile, half on larger screens */}
          <div className="w-full lg:w-1/2">
            <img
              src={achievements}
              alt="Caring hands holding a rescued animal"
              className={`rounded-2xl sm:rounded-3xl ${currentColors.shadow} w-full h-auto object-cover max-h-[400px] sm:max-h-[500px]`}
            />
          </div>

          {/* Right text and counters - full width on mobile, half on larger screens */}
          <div className="w-full lg:w-1/2">
            <p className={`${currentColors.subheading} font-semibold mb-2 sm:mb-3 tracking-wider sm:tracking-widest uppercase text-xs sm:text-sm md:text-base`}>
              Our Impact
            </p>

            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold ${currentColors.heading} leading-snug sm:leading-tight mb-4 sm:mb-6`}>
              Together, We Save Lives & Give Hope
            </h2>

            <p className={`${currentColors.description} mb-8 sm:mb-10 text-base sm:text-lg md:text-base max-w-xl`}>
              Each rescued animal represents a life transformed through compassion and care. Our community is dedicated to fighting cruelty, protecting wildlife, and rehoming animals with loving families.
            </p>

            {/* Counters - stacked on mobile, 3 columns on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-center">
              <div className="p-3 sm:p-0">
                <h3 className={`${currentColors.counter} text-4xl sm:text-5xl font-extrabold`}>
                  <CountUp end={850} duration={3} /> +
                </h3>
                <p className={`${currentColors.counterLabel} mt-1 sm:mt-2 font-medium sm:font-semibold text-sm sm:text-base`}>
                  Poaching Cases Prevented
                </p>
              </div>
              <div className="p-3 sm:p-0">
                <h3 className={`${currentColors.counter} text-4xl sm:text-5xl font-extrabold`}>
                  <CountUp end={230} duration={3} /> +
                </h3>
                <p className={`${currentColors.counterLabel} mt-1 sm:mt-2 font-medium sm:font-semibold text-sm sm:text-base`}>
                  Animals Rescued
                </p>
              </div>
              <div className="p-3 sm:p-0">
                <h3 className={`${currentColors.counter} text-4xl sm:text-5xl font-extrabold`}>
                  <CountUp end={160} duration={3} /> +
                </h3>
                <p className={`${currentColors.counterLabel} mt-1 sm:mt-2 font-medium sm:font-semibold text-sm sm:text-base`}>
                  Passionate Volunteers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;