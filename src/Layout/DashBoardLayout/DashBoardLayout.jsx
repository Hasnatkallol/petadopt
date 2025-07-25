import React, { useContext, useState, useEffect } from "react";
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
import Loading from "../../Shared/Loading";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, adminLoading] = useAdmin();
  const { theme } = useContext(FirebaseAuthContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeSidebar = () => {
    if (isMobile) setSidebarOpen(false);
  };

  const navLinks = [
    {
      path: isAdmin ? "/dashboard/adminProfile" : "/dashboard/myProfile",
      icon: <FaUser className="text-lg" />,
      label: isAdmin ? "Admin Profile" : "My Profile",
      show: true,
    },
    {
      path: "/dashboard/addpet",
      icon: <FaPlus className="text-lg" />,
      label: "Add a Pet",
      show: true,
    },
    {
      path: "/dashboard/myAddedPet",
      icon: <FaList className="text-lg" />,
      label: "My Added Pets",
      show: true,
    },
    {
      path: "/dashboard/adoptionRequest",
      icon: <FaHandsHelping className="text-lg" />,
      label: "Adoption Request",
      show: true,
    },
    {
      path: "/dashboard/createDonationCampaign",
      icon: <FaHandHoldingUsd className="text-lg" />,
      label: "Create Donation Campaign",
      show: true,
    },
    {
      path: "/dashboard/myDonationCampaign",
      icon: <FaDonate className="text-lg" />,
      label: "My Donation Campaigns",
      show: true,
    },
    {
      path: "/dashboard/myDonation",
      icon: <FaHandHoldingUsd className="text-lg" />,
      label: "My Donations",
      show: true,
    },
    {
      path: "/dashboard/users",
      icon: <FaUsers className="text-lg" />,
      label: "Users",
      show: isAdmin,
    },
    {
      path: "/dashboard/allpets",
      icon: <FaPaw className="text-lg" />,
      label: "All Pets",
      show: isAdmin,
    },
    {
      path: "/dashboard/alldonations",
      icon: <FaDonate className="text-lg" />,
      label: "All Donations",
      show: isAdmin,
    },
  ];

  if (adminLoading) return <Loading />;

  return (
    <div className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <Navbar />

      {/* Mobile Header */}
      <div className={`lg:hidden sticky top-16 z-40 flex justify-between items-center px-4 py-3 w-full border-b ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`text-xl rounded-full p-2 transition-colors ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
          aria-label="Toggle sidebar"
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <IoMdClose /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed h-[calc(100vh-4rem)] w-64 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md z-40 transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
          aria-label="Sidebar"
        >
          <nav className="flex flex-col p-4 gap-2 font-medium overflow-y-auto h-full">
            {navLinks.filter(link => link.show).map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
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
                end
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 min-h-[calc(100vh-4rem)] p-4 lg:p-6 ml-0 lg:ml-64 transition-all duration-300 overflow-auto ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;