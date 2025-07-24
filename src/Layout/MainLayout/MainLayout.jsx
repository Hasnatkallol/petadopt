import React from "react";
import Navbar from "../../Component/Navbar/Navbar";
import { Outlet } from "react-router";
import Footer from "../../Shared/Footer";

const MainLayout = () => {
  // min-h-[calc(100vh-446px)]"
  return (
    <div className="">
      <div>
        <Navbar></Navbar>
      </div>
      <div className="">
        <Outlet></Outlet>
      </div>
      <div>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default MainLayout;
