import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { HiMenu, HiX } from "react-icons/hi";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import { FaMoon } from "react-icons/fa";
import { CiSun } from "react-icons/ci";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const { user, logOut } = useContext(FirebaseAuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    logOut()
      .then(() => {
        setDropdownOpen(false);
        setMobileDropdownOpen(false);
        navigate("/");
      })
      .catch((error) => console.log(error));
  };

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

  return (
    <div className="sticky top-0 z-50 bg-base-200 shadow-md">
      <div className="w-11/12 mx-auto flex items-center justify-between py-4">
        {/* Mobile: Menu icon */}
        <div className="flex items-center gap-2 lg:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>

        {/* Mobile: Logo */}
        <div className="lg:hidden text-center flex-1">
          <h1 className="text-accent text-xl font-semibold">
            <i>PetShop</i>
          </h1>
        </div>

        {/* Mobile: Theme + Profile/Login */}
        <div className="flex items-center gap-3 lg:hidden relative">
          <button onClick={toggleTheme}>
            {theme === "light" ? <FaMoon size={20} /> : <CiSun size={22} />}
          </button>
          {user ? (
            <img
              src={user.photoURL || "https://i.ibb.co/ZYW3VTp/brown-brim.png"}
              alt="Profile"
              onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
              className="w-9 h-9 rounded-full cursor-pointer border border-accent"
            />
          ) : (
            <button
              onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
              className="bg-gradient-to-r from-[#e0f2ff] via-[#e9e7fc] to-[#f1e7ff] text-black font-semibold py-1 px-3 rounded-xl text-sm shadow-md hover:scale-105 transition"
            >
              Login
            </button>
          )}

          {mobileDropdownOpen && (
            <div className="absolute right-0 top-12 w-44 bg-base-100 shadow-lg rounded-lg z-20">
              <div className="flex justify-end px-2 pt-2">
                <button
                  onClick={() => setMobileDropdownOpen(false)}
                  className="text-base-content hover:text-error"
                >
                  <HiX size={20} />
                </button>
              </div>
              <ul className="p-2 space-y-2 text-sm">
                <li>
                  <NavLink
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-base-200"
                    onClick={() => setMobileDropdownOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                </li>
                {user ? (
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-base-200"
                    >
                      Logout
                    </button>
                  </li>
                ) : (
                  <li>
                    <NavLink
                      to="/login"
                      onClick={() => setMobileDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-base-200"
                    >
                      Login
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex w-full justify-between items-center">
          <h1 className="text-accent text-2xl font-bold">PetShop</h1>
          <ul className="flex space-x-6">{navLinks}</ul>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme}>
              {theme === "light" ? <FaMoon size={20} /> : <CiSun size={22} />}
            </button>
            {user ? (
              <div className="relative">
                <img
                  src={user.photoURL || "https://i.ibb.co/ZYW3VTp/brown-brim.png"}
                  alt="Profile"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 rounded-full cursor-pointer border border-accent"
                />
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-base-100 shadow-lg rounded-lg z-10">
                    <ul className="p-2 space-y-2 text-sm">
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
      </div>

      {/* Mobile Nav Links */}
      {isOpen && (
        <ul className="flex flex-col items-start bg-base-100 px-4 py-4 space-y-4 lg:hidden">
          {navLinks}
        </ul>
      )}
    </div>
  );
};

export default Navbar;
