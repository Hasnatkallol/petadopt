import React, { useContext, useEffect } from "react";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import { useNavigate } from "react-router";

const MyProfile = () => {
  const { user, theme } = useContext(FirebaseAuthContext);
  const navigate = useNavigate();

    useEffect(() => {
    document.title = "My Profile";
  }, []);

  const themeStyles = {
    light: {
      bg: "bg-gray-50",
      text: "text-gray-800",
      card: "bg-white border border-gray-100",
      input: "bg-white border-gray-300 focus:border-blue-500",
      button: "bg-blue-600 hover:bg-blue-700",
      secondaryText: "text-gray-600",
      accent: "text-blue-600",
      sidebar: "bg-white",
      topBar: "bg-white",
      hover: "hover:bg-gray-100",
      activeLink: "bg-blue-100 text-blue-700",
      iconButton: "bg-gray-200 hover:bg-gray-300",
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      card: "bg-gray-800 border-gray-700",
      input: "bg-gray-700 border-gray-600 focus:border-blue-400",
      button: "bg-blue-500 hover:bg-blue-600",
      secondaryText: "text-gray-300",
      accent: "text-blue-400",
      sidebar: "bg-gray-800",
      topBar: "bg-gray-800",
      hover: "hover:bg-gray-700",
      activeLink: "bg-blue-700 text-white",
      iconButton: "bg-gray-700 hover:bg-gray-600",
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  if (user?.role === "admin") {
    return navigate("adminProfile");
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} transition-colors duration-300`}>
      <div className="container mx-auto px-0 lg:px-4 py-8">
        <div className={`max-w-3xl mx-auto ${currentTheme.card} rounded-xl shadow-md overflow-hidden p-6 md:p-8 transition-all duration-300`}>
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-opacity-20 border-blue-500">
              <img 
                src={user?.photoURL || "https://via.placeholder.com/150"} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${currentTheme.accent}`}>
                {user?.displayName || "User Profile"}
              </h1>
              <p className={`text-lg mb-4 ${currentTheme.secondaryText}`}>
                {user?.email}
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <button 
                  className={`px-4 py-2 rounded-lg ${currentTheme.button} text-white font-medium transition-colors`}
                  onClick={() => navigate('/edit-profile')}
                >
                  Edit Profile
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg ${currentTheme.iconButton} ${currentTheme.text} font-medium transition-colors`}
                >
                  Settings
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-opacity-20 border-gray-500">
            <h2 className={`text-xl font-semibold mb-4 ${currentTheme.accent}`}>Account Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className={`text-sm ${currentTheme.secondaryText}`}>Account Created</p>
                <p>{new Date(user?.metadata?.creationTime).toLocaleDateString()}</p>
              </div>
              <div>
                <p className={`text-sm ${currentTheme.secondaryText}`}>Last Sign In</p>
                <p>{new Date(user?.metadata?.lastSignInTime).toLocaleDateString()}</p>
              </div>
              <div>
                <p className={`text-sm ${currentTheme.secondaryText}`}>Email Verified</p>
                <p>{user?.emailVerified ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className={`text-sm ${currentTheme.secondaryText}`}>User ID</p>
                <p className="truncate">{user?.uid}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;