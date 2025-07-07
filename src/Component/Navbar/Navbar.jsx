import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { HiMenu, HiX } from "react-icons/hi";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const navigate = useNavigate();
  const { user, logOut } = useContext(FirebaseAuthContext);

  const linkStyle = ({ isActive }) =>
    isActive ? "text-accent text-xl" : "text-base-content text-xl";

  const navLinks = (
    <>
      <li>
        <NavLink to="/" className={linkStyle}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/pets" className={linkStyle}>
          Pet Listing
        </NavLink>
      </li>
      <li>
        <NavLink to="/donations" className={linkStyle}>
          Donation Campaigns
        </NavLink>
      </li>
    </>
  );

  const handleLogout = () => {
    logOut()
      .then(() => navigate("/"))
      .catch((error) => console.log(error));
  };

  return (
    <div className="bg-base-200 shadow-md sticky top-0 z-50">
      <div className="w-11/12 mx-auto flex items-center justify-between py-4">
        {/* Left: Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <button onClick={toggleMenu}>
              {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>
          <h1 className="text-accent text-2xl font-bold">PetShop</h1>
        </div>

        {/* Center: Links (hidden on mobile) */}
        <div className="hidden lg:flex">
          <ul className="flex space-x-6">{navLinks}</ul>
        </div>

        {/* Right: Profile/Login */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <img
                src={user.photoURL || "https://i.ibb.co/ZYW3VTp/brown-brim.png"}
                alt="Profile"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full cursor-pointer border border-accent"
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-10">
                  <ul className="p-2 space-y-2 text-sm text-gray-700">
                    <li>
                      <NavLink
                        to="/dashboard"
                        className="block px-4 py-2 hover:bg-base-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-base-200"
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
              className="bg-gradient-to-r from-[#e0f2ff] via-[#e9e7fc] to-[#f1e7ff] text-black font-semibold py-2 px-4 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Nav */}
      {isOpen && (
        <ul className="flex flex-col items-start bg-base-100 px-4 py-4 space-y-4 lg:hidden">
          {navLinks}
          {!user && (
            <li>
              <NavLink to="/login" className={linkStyle}>
                Login
              </NavLink>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Navbar;
