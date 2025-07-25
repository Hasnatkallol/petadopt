import React, { useEffect, useState } from "react";
import Banner from "../Home/Banner";
import PetsCategory from "../Home/PetsCategory";
import CallToAction from "../Home/CallToAction";
import AboutUs from "../Home/AboutUs";

import HowItWorks from "../Home/HowItWorks";
import FeaturedPetsCarousel from "../Home/FeaturedPetsCarousel";
import Achievements from "../Home/Achievements";
import Loading from "../../Shared/Loading";

const HomePage = () => {
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    document.title = "Home";
    (async () => {
      try {
        console.log('')
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); 
      }
    })();
  }, []);

  if (loading) {
    return <Loading />;
  }
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
