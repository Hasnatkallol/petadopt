import React from "react";
import Banner from "../Home/Banner";
import PetsCategory from "../Home/PetsCategory";
import CallToAction from "../Home/CallToAction";
import AboutUs from "../Home/AboutUs";

import HowItWorks from "../Home/HowItWorks";
import FeaturedPetsCarousel from "../Home/FeaturedPetsCarousel";

const HomePage = () => {
  return (
    <div>
     
      <Banner></Banner>
      <PetsCategory></PetsCategory>
      <CallToAction></CallToAction>
      <AboutUs></AboutUs>
      <HowItWorks></HowItWorks>
      <FeaturedPetsCarousel></FeaturedPetsCarousel>
    </div>
  );
};

export default HomePage;
