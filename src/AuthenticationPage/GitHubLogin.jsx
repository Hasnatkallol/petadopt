import React, { useContext, useState } from "react";
import { FirebaseAuthContext } from "../Firebase/FirebaseAuthContext";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import { FaGithub } from "react-icons/fa";

const GitHubLogin = () => {
  const { setUser, setLoading, signInWithGithub, theme } = useContext(FirebaseAuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setUser(""); // Clear user state initially
    setLoading(true); // Start loading

    try {
      const result = await signInWithGithub();
      const loggedInUser = result.user;
      
      let email = loggedInUser.email;
      // Fallback for email if not directly available
      if (!email && loggedInUser?.providerData?.length) {
        email = loggedInUser.providerData[0]?.email;
      }

      if (email) {
        const userInfo = {
          name: loggedInUser.displayName || loggedInUser.reloadUserInfo.screenName,
          image: loggedInUser.photoURL || `https://github.com/${loggedInUser.reloadUserInfo.screenName}.png`,
          email: email,
          role: "user",
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };

        await axiosPublic.post("/users", userInfo);
        setUser(loggedInUser);
      }

      Swal.fire({
        title: "Success!",
        text: "Signed in with GitHub",
        icon: "success",
        background: theme === "dark" ? "#1E293B" : "#FFFFFF",
        color: theme === "dark" ? "#F8FAFC" : "#1E293B",
      });
      
      navigate(location?.state?.from || "/");
    } catch (error) {
      console.error("GitHub login error:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to sign in with GitHub",
        icon: "error",
        background: theme === "dark" ? "#1E293B" : "#FFFFFF",
        color: theme === "dark" ? "#F8FAFC" : "#1E293B",
      });
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  // Theme-based styles
  const buttonStyles = {
    light: {
      background: "#24292E", // GitHub's dark color
      color: "#FFFFFF",
      border: "1px solid #24292E",
      hover: "#2F363D",
    },
    dark: {
      background: "#2D3748",
      color: "#E2E8F0",
      border: "1px solid #4A5568",
      hover: "#3C4657",
    },
  };

  const currentStyle = buttonStyles[theme] || buttonStyles.light;

  return (
    <button
      onClick={handleGitHubLogin}
      disabled={isLoading}
      className={`flex items-center justify-center gap-3 w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
        isLoading ? "opacity-75 cursor-not-allowed" : "hover:scale-[1.01]"
      }`}
      style={{
        backgroundColor: currentStyle.background,
        color: currentStyle.color,
        border: currentStyle.border,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = currentStyle.hover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = currentStyle.background;
      }}
    >
      {isLoading ? (
        <div className="h-5 w-5 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
      ) : (
        <>
          <FaGithub className="text-xl" />
          <span>GitHub</span>
        </>
      )}
    </button>
  );
};

export default GitHubLogin;