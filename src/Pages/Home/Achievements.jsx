import React from "react";
import CountUp from "react-countup";
import achievements from '../../assets/featuredPets/achievements.jpg';

const AchievementsSection = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left image */}
        <div>
          <img
            src={achievements}
            alt="Caring hands holding a rescued animal"
            className="rounded-3xl shadow-xl w-full object-cover max-h-[500px]"
          />
        </div>

        {/* Right text and counters */}
        <div>
          <p className="text-pink-600 font-semibold mb-3 tracking-widest uppercase text-sm md:text-base">
            Our Impact
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Together, We Save Lives & Give Hope
          </h2>

          <p className="text-gray-700 mb-10 text-lg md:text-base max-w-xl">
            Each rescued animal represents a life transformed through compassion and care. Our community is dedicated to fighting cruelty, protecting wildlife, and rehoming animals with loving families.
          </p>

          {/* Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-pink-600 text-5xl font-extrabold">
                <CountUp end={850} duration={3} /> +
              </h3>
              <p className="text-gray-800 mt-2 font-semibold text-base">Poaching Cases Prevented</p>
            </div>
            <div>
              <h3 className="text-pink-600 text-5xl font-extrabold">
                <CountUp end={230} duration={3} /> +
              </h3>
              <p className="text-gray-800 mt-2 font-semibold text-base">Animals Rescued</p>
            </div>
            <div>
              <h3 className="text-pink-600 text-5xl font-extrabold">
                <CountUp end={160} duration={3} /> +
              </h3>
              <p className="text-gray-800 mt-2 font-semibold text-base">Passionate Volunteers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
