import React, { useContext, useState } from "react";
import { FirebaseAuthContext } from "../Firebase/FirebaseAuthContext";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import { FcGoogle } from "react-icons/fc";

const GoogleLogin = () => {
  const { setUser, setLoading, signInWithGoogle, theme } =
    useContext(FirebaseAuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setLoading(true); // Optional: for global state
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      setUser(user);

      const userInfo = {
        name: user?.displayName,
        image: user?.photoURL,
        email: user?.email,
        role: "user",
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      console.log("Sending user info to backend:", userInfo);

      try {
        await axiosPublic.post("/users", userInfo);
        console.log("User info saved successfully!");
      } catch (apiError) {
        if (apiError.response?.status === 409) {
          console.warn("User already exists. Skipping insert.");
        } else {
          throw apiError; // Rethrow other errors
        }
      }

      Swal.fire({
        title: "Success!",
        text: "Signed in with Google",
        icon: "success",
        background: theme === "dark" ? "#1E293B" : "#FFFFFF",
        color: theme === "dark" ? "#F8FAFC" : "#1E293B",
      });

      navigate(location?.state?.from || "/");
    } catch (error) {
      console.error("Google login error:", error?.response?.data || error.message || error);
      Swal.fire({
        title: "Error",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to sign in with Google",
        icon: "error",
        background: theme === "dark" ? "#1E293B" : "#FFFFFF",
        color: theme === "dark" ? "#F8FAFC" : "#1E293B",
      });
    } finally {
      setIsLoading(false);
      setLoading(false); // Optional: for global state
    }
  };

  // Theme-based styles
  const buttonStyles = {
    light: {
      background: "#FFFFFF",
      color: "#3C4043",
      border: "1px solid #DADCE0",
      hover: "#F7F8F8",
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
      onClick={handleGoogleLogin}
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
          <FcGoogle className="text-xl" />
          <span>Google</span>
        </>
      )}
    </button>
  );
};

export default GoogleLogin;
