import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import registerAnimation from "../assets/Register/register.json";
import Swal from "sweetalert2";
import { FirebaseAuthContext } from "../Firebase/FirebaseAuthContext";
import Lottie from "lottie-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import useAxiosPublic from "../Hooks/useAxiosPublic";
import GoogleLogin from "./GoogleLogin";
import GitHubLogin from "./GitHubLogin";

const Register = () => {
  useEffect(() => {
    document.title = "SignUp";
  }, []);
  const axiosPublic = useAxiosPublic();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { createUser, userProfileUpdate, setLoading, theme } =
    useContext(FirebaseAuthContext);

  // Theme-based colors
  const themeColors = {
    light: {
      bg: "#F1F5F9",
      cardBg: "#FFFFFF",
      text: "#1E293B",
      activeLink: "#FBAE02",
      buttonBg: "#FBAE02",
      buttonHover: "#e09e00",
      inputBg: "#FFFFFF",
      border: "#E2E8F0",
      socialButtonBg: "#FFFFFF",
      socialButtonBorder: "#E2E8F0",
      error: "#DC2626",
      success: "#16A34A",
    },
    dark: {
      bg: "#0F172A",
      cardBg: "#1E293B",
      text: "#F8FAFC",
      activeLink: "#60A5FA",
      buttonBg: "#60A5FA",
      buttonHover: "#3B82F6",
      inputBg: "#334155",
      border: "#475569",
      socialButtonBg: "#334155",
      socialButtonBorder: "#475569",
      error: "#F87171",
      success: "#4ADE80",
    },
  };

  const currentTheme = themeColors[theme];

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(false);
    setErrorMessage("");

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Password validation
    const passwordValidations = [
      {
        regex: /(?=.*\d)/,
        message: "Password must contain at least one number.",
      },
      {
        regex: /(?=.*[a-z])/,
        message: "Password must contain at least one lowercase letter.",
      },
      {
        regex: /(?=.*[A-Z])/,
        message: "Password must contain at least one uppercase letter.",
      },
      {
        regex: /.{8,}/,
        message: "Password must be at least 8 characters long.",
      },
    ];

    for (const validation of passwordValidations) {
      if (!validation.regex.test(password)) {
        Swal.fire({
          title: "Weak Password",
          text: validation.message,
          icon: "warning",
          background: currentTheme.cardBg,
          color: currentTheme.text,
        });
        setLoading(false);
        return;
      }
    }

    createUser(email, password)
      .then(async (userCredential) => {
        // Send to database
        const userInfo = {
          email: email,
          name: name,
          image: profilePic,
          role: "user",
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };

        await axiosPublic.post("/users", userInfo);

        // Firebase profile update
        await userProfileUpdate({
          displayName: name,
          photoURL: profilePic,
        });

        Swal.fire({
          title: "Success!",
          text: "Successfully registered!",
          icon: "success",
          background: currentTheme.cardBg,
          color: currentTheme.text,
        });
        
        navigate(location.state || "/");
      })
      .catch((error) => {
        setErrorMessage(error.message);
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          background: currentTheme.cardBg,
          color: currentTheme.text,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBBKEY}`,
        { body: formData, method: "post" }
      );
      const data = await res.json();
      setProfilePic(data.data.url);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  return (
    <div
      className=" mt-15 flex items-center justify-center p-4 transition-colors duration-300"
      style={{ backgroundColor: currentTheme.bg }}
    >
      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl">
        {/* Left: Form Section */}
        <div
          className="w-full md:w-1/2 p-8 md:p-12 transition-colors duration-300"
          style={{
            backgroundColor: currentTheme.cardBg,
            color: currentTheme.text,
          }}
        >
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-center">Create Account</h1>
            <p className="text-center mb-8 opacity-80">Join our community</p>

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="block font-medium">Full Name</label>
                <input
                  name="name"
                  type="text"
                  className="w-full p-3 rounded-lg transition-all duration-200 focus:ring-2 focus:outline-none"
                  style={{
                    backgroundColor: currentTheme.inputBg,
                    borderColor: currentTheme.border,
                  }}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Profile Picture Upload */}
              <div className="space-y-2">
                <label className="block font-medium">Profile Picture</label>
                <input
                  name="image"
                  type="file"
                  className="w-full p-2 rounded-lg transition-all duration-200 focus:ring-2 focus:outline-none"
                  style={{
                    backgroundColor: currentTheme.inputBg,
                    borderColor: currentTheme.border,
                  }}
                  onChange={handleImageUpload}
                  required
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="block font-medium">Email</label>
                <input
                  name="email"
                  type="email"
                  className="w-full p-3 rounded-lg transition-all duration-200 focus:ring-2 focus:outline-none"
                  style={{
                    backgroundColor: currentTheme.inputBg,
                    borderColor: currentTheme.border,
                  }}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block font-medium">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full p-3 rounded-lg transition-all duration-200 focus:ring-2 focus:outline-none pr-10"
                    style={{
                      backgroundColor: currentTheme.inputBg,
                      borderColor: currentTheme.border,
                    }}
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ color: currentTheme.text }}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="text-xl" />
                    ) : (
                      <AiOutlineEye className="text-xl" />
                    )}
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 hover:shadow-md mt-4"
                style={{
                  backgroundColor: currentTheme.buttonBg,
                  color: theme === "light" ? "#1E293B" : "#0F172A",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = currentTheme.buttonHover)
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = currentTheme.buttonBg)
                }
              >
                Register
              </button>

              {/* Error/Success Messages */}
              {errorMessage && (
                <p className="text-center" style={{ color: currentTheme.error }}>
                  {errorMessage}
                </p>
              )}
              {successMessage && (
                <p
                  className="text-center"
                  style={{ color: currentTheme.success }}
                >
                  Successfully Signed Up
                </p>
              )}
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div
                className="flex-grow border-t"
                style={{ borderColor: currentTheme.border }}
              ></div>
              <span
                className="mx-4 text-sm"
                style={{ color: currentTheme.text }}
              >
                OR CONTINUE WITH
              </span>
              <div
                className="flex-grow border-t"
                style={{ borderColor: currentTheme.border }}
              ></div>
            </div>

            {/* Social Logins */}
             <div className="flex flex-col sm:flex-row gap-4">
              <GoogleLogin theme={theme} currentTheme={currentTheme} />
              <GitHubLogin theme={theme} currentTheme={currentTheme} />
            </div>
            {/* Login Link */}
            <div className="mt-8 text-center">
              <span style={{ color: currentTheme.text }}>
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="font-semibold hover:underline"
                style={{ color: currentTheme.activeLink }}
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Animation Section */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-8">
          <div className="w-full h-full flex items-center justify-center">
            <Lottie
              animationData={registerAnimation}
              loop
              className="w-full max-w-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;