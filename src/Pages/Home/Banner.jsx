import React, { useContext } from "react";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";

const Banner = () => {
  const { theme } = useContext(FirebaseAuthContext);

  // Define colors based on theme
  const headingColor = theme === "dark" ? "text-red-600" : "text-blue-600";
    const Color = theme === "dark" ? "text-green-600" : "text-purple-600";
    const Bg = theme === "dark" ? "bg-gray-600" : "bg-purple-600";

  return (
    <div className={`${Bg}`}>
      <h1
        className={`text-4xl lg:text-5xl font-extrabold leading-tight mb-4 ${headingColor}`}
      >
        Welcome to <span>PetShop</span>
      </h1>

      <p className={`text-lg lg:text-xl text-gray-700 dark:text-gray-300 mb-8 ${Color}`}>
        Discover, adopt, and support our furry friends...
      </p>
      <h1 className="logoclass">Kallol</h1>
    </div>
  );
};

export default Banner;
