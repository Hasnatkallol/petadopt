import React from "react";
import Banner from "../Home/Banner";
import PetsCategory from "../Home/PetsCategory";
import CallToAction from "../Home/CallToAction";
import AboutUs from "../Home/AboutUs";

import HowItWorks from "../Home/HowItWorks";
import FeaturedPetsCarousel from "../Home/FeaturedPetsCarousel";
import Achievements from "../Home/Achievements";

const HomePage = () => {
  return (
    <div>
      <Banner></Banner>
      <PetsCategory></PetsCategory>
      <CallToAction></CallToAction>
      <AboutUs></AboutUs>
      <HowItWorks></HowItWorks>
      <FeaturedPetsCarousel></FeaturedPetsCarousel>
      <Achievements></Achievements>
    </div>
  );
};

export default HomePage;
