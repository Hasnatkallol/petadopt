import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import Toggle from "../../Theme/Toggle";
import useAdmin from "../../Hooks/useAdmin";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [isAdmin] = useAdmin();
  console.log("isAdmin:", isAdmin);

  const { user, logOut, theme, toggleTheme } = useContext(FirebaseAuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logOut()
      .then(() => {
        setDropdownOpen(false);
        setMobileDropdownOpen(false);
        navigate("/");
      })
      .catch((error) => console.log(error));
  };

  const navLinkClasses = ({ isActive }) => {
    const baseClasses = "text-xl font-medium transition-colors duration-200";
    if (isActive) {
      const activeColor =
        theme === "dark"
          ? "text-blue-600 underline underline-offset-4 decoration-blue-600"
          : "text-red-500 underline underline-offset-4 decoration-red-500";
      return `${baseClasses} ${activeColor}`;
    } else {
      return `${baseClasses} ${
        theme === "dark" ? "text-gray-200" : "text-gray-700"
      }`;
    }
  };

  const navLinks = (
    <>
      <li>
        <NavLink to="/" className={navLinkClasses}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/petsListing" className={navLinkClasses}>
          Pet Listing
        </NavLink>
      </li>
      <li>
        <NavLink to="/donations" className={navLinkClasses}>
          Donation Campaigns
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
      <div className="w-11/12 mx-auto flex items-center justify-between py-4">
        {/* Mobile Menu Icon */}
        <div className="flex items-center gap-2 lg:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>

        {/* Logo */}
        <div className="lg:hidden text-center flex-1">
          <h1 className="text-blue-600 dark:text-red-500 text-xl font-semibold">
            <i>PetShop</i>
          </h1>
        </div>

        {/* Mobile: Toggle & Auth */}
        <div className="flex items-center gap-3 lg:hidden relative">
          <Toggle checked={theme === "dark"} onChange={toggleTheme} />

          {user ? (
            <img
              src={user.photoURL || "https://i.ibb.co/ZYW3VTp/brown-brim.png"}
              alt="Profile"
              onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
              className="w-9 h-9 rounded-full cursor-pointer border border-blue-400 dark:border-red-500"
            />
          ) : (
            <button
              onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
              className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-black font-semibold py-1 px-3 rounded-xl text-sm shadow-md hover:scale-105 transition"
            >
              Login
            </button>
          )}

          {mobileDropdownOpen && (
            <div className="absolute right-0 top-12 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-20">
              <div className="flex justify-end px-2 pt-2">
                <button
                  onClick={() => setMobileDropdownOpen(false)}
                  className="text-gray-600 dark:text-gray-300 hover:text-red-500"
                >
                  <HiX size={20} />
                </button>
              </div>
              <ul className="p-2 space-y-2 text-sm">
                {isAdmin ? (
                  <li>
                    <NavLink
                      to="/dashboard/adminProfile"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setMobileDropdownOpen(false)}
                    >
                      Dashboard
                    </NavLink>
                  </li>
                ) : (
                  <li>
                    <NavLink
                      to="/dashboard/myProfile"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setMobileDropdownOpen(false)}
                    >
                      Dashboard
                    </NavLink>
                  </li>
                )}
                {user ? (
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </li>
                ) : (
                  <li>
                    <NavLink
                      to="/login"
                      onClick={() => setMobileDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Login
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Desktop */}
        <div className="hidden lg:flex w-full justify-between items-center">
          <h1 className="text-blue-600 dark:text-red-500 text-2xl font-bold">
            PetShop
          </h1>
          <ul className="flex space-x-6">{navLinks}</ul>
          <div className="flex items-center gap-4">
            <Toggle checked={theme === "dark"} onChange={toggleTheme} />
            {user ? (
              <div className="relative">
                <img
                  src={
                    user.photoURL || "https://i.ibb.co/ZYW3VTp/brown-brim.png"
                  }
                  alt="Profile"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 rounded-full cursor-pointer border border-blue-400 dark:border-red-500"
                />
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10">
                    <ul className="p-2 space-y-2 text-sm">
                      <li>
                        <NavLink
                          to="/dashboard"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-black font-semibold py-2 px-4 rounded-xl shadow-md hover:scale-105 transition"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <ul className="flex flex-col items-start bg-white dark:bg-gray-900 px-4 py-4 space-y-4 lg:hidden">
          {navLinks}
        </ul>
      )}
    </div>
  );
};

export default Navbar;
