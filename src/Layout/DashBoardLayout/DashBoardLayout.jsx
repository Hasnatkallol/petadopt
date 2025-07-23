import React, { useContext, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { NavLink, Outlet } from "react-router-dom";
import useAdmin from "../../Hooks/useAdmin";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import Navbar from "../../Component/Navbar/Navbar";
import {
  FaUser,
  FaUsers,
  FaPaw,
  FaHandHoldingUsd,
  FaPlus,
  FaList,
  FaHandsHelping,
  FaDonate,
} from "react-icons/fa";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin] = useAdmin();
  const { theme } = useContext(FirebaseAuthContext);

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <Navbar />

      {/* Dashboard Header with Menu Button - Only visible on mobile */}
      <div
        className={`lg:hidden sticky top-16 z-30 flex justify-between items-center px-4 py-3 w-full border-b ${
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`text-xl rounded-full p-2 ${
            theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {sidebarOpen ? <IoMdClose /> : <FiMenu />}
        </button>
      </div>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div
          className={`fixed h-[calc(100vh-4rem)] w-64 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-md z-40 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <nav className="flex flex-col p-4 gap-2 font-medium overflow-y-auto h-full">
            {isAdmin ? (
              <>
                <NavLink
                  to="/dashboard/adminProfile"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? theme === "dark"
                          ? "bg-blue-700 text-white"
                          : "bg-blue-100 text-blue-700"
                        : theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  <FaUser className="text-lg" />
                  Admin Profile
                </NavLink>
                <NavLink
                  to="/dashboard/users"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? theme === "dark"
                          ? "bg-blue-700 text-white"
                          : "bg-blue-100 text-blue-700"
                        : theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  <FaUsers className="text-lg" />
                  Users
                </NavLink>
                <NavLink
                  to="/dashboard/allpets"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? theme === "dark"
                          ? "bg-blue-700 text-white"
                          : "bg-blue-100 text-blue-700"
                        : theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  <FaPaw className="text-lg" />
                  All Pets
                </NavLink>
                <NavLink
                  to="/dashboard/alldonations"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? theme === "dark"
                          ? "bg-blue-700 text-white"
                          : "bg-blue-100 text-blue-700"
                        : theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  <FaDonate className="text-lg" />
                  All Donations
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/dashboard/myProfile"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? theme === "dark"
                          ? "bg-blue-700 text-white"
                          : "bg-blue-100 text-blue-700"
                        : theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  <FaUser className="text-lg" />
                  My Profile
                </NavLink>
                <NavLink
                  to="/dashboard/addpet"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? theme === "dark"
                          ? "bg-blue-700 text-white"
                          : "bg-blue-100 text-blue-700"
                        : theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  <FaPlus className="text-lg" />
                  Add a Pet
                </NavLink>
                <NavLink
                  to="/dashboard/myAddedPet"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? theme === "dark"
                          ? "bg-blue-700 text-white"
                          : "bg-blue-100 text-blue-700"
                        : theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  <FaList className="text-lg" />
                  My Added Pets
                </NavLink>
                <NavLink
                  to="/dashboard/adoptionRequest"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? theme === "dark"
                          ? "bg-blue-700 text-white"
                          : "bg-blue-100 text-blue-700"
                        : theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  <FaHandsHelping className="text-lg" />
                  Adoption Request
                </NavLink>
                <NavLink
                  to="/dashboard/createDonationCampaign"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? theme === "dark"
                          ? "bg-blue-700 text-white"
                          : "bg-blue-100 text-blue-700"
                        : theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  <FaHandHoldingUsd className="text-lg" />
                  Create Donation Campaign
                </NavLink>
                <NavLink
                  to="/dashboard/myDonationCampaign"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? theme === "dark"
                          ? "bg-blue-700 text-white"
                          : "bg-blue-100 text-blue-700"
                        : theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  <FaDonate className="text-lg" />
                  My Donation Campaigns
                </NavLink>
                <NavLink
                  to="/dashboard/myDonation"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? theme === "dark"
                          ? "bg-blue-700 text-white"
                          : "bg-blue-100 text-blue-700"
                        : theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  <FaHandHoldingUsd className="text-lg" />
                  My Donations
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Main content area */}
        <main
          className={`flex-1 min-h-[calc(100vh-4rem)] p-0 lg:p-4 ml-0 lg:ml-64 transition-all duration-300 ${
            theme === "dark" ? "bg-gray-900" : "bg-gray-50"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;