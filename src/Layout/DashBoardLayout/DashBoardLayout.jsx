import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { NavLink, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen border-1 overflow-hidden flex flex-col">
      {/* Top bar */}
      <div className="flex  justify-between items-center px-6 py-4 border-1 shadow-md bg-white">
        <span className="text-2xl font-bold text-gray-800">  🐾 PetShop   </span>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-2xl text-gray-800 rounded-full p-1 bg-[#94A3B8] hover:bg-[#4e5a67]"
        >
          {sidebarOpen ? <IoMdClose /> : <FiMenu />}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-4">
            <span className="text-xl font-semibold text-gray-800">🐾 PetShop </span>
          </div>
          

          <nav className="flex flex-col p-4 gap-4 font-medium text-gray-700">
            <NavLink to="/dashboard/myProfile" className="hover:text-blue-600">
              My Profile
            </NavLink>
            <NavLink to="/dashboard/addpet" className="hover:text-blue-600">
              Add a Pet
            </NavLink>
            <NavLink to="/dashboard/myAddedPet" className="hover:text-blue-600">
              My Added Pets
            </NavLink>
            <NavLink to="/dashboard/adoptionRequest" className="hover:text-blue-600">
              Adoption Request
            </NavLink>
            <NavLink to="/dashboard/createDonationCampaign" className="hover:text-blue-600">
              Create Donation Campaign
            </NavLink>
            <NavLink to="/dashboard/myDonationCampaign" className="hover:text-blue-600">
              My Donation Campaigns
            </NavLink>
            <NavLink to="#" className="hover:text-blue-600">
              My Donations
            </NavLink>
             <NavLink to='/' className="hover:text-blue-600">
              Home
            </NavLink>
          </nav>
        </div>

        {/* Main content area */}
        <main
          className={`flex-1 border-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 `}
        >
          {/* Replace this with your actual content or <Outlet /> */}
        <Outlet></Outlet>
        </main>
      </div>

  
    </div>
  );
};

export default DashboardLayout;
