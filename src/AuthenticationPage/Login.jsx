import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FirebaseAuthContext } from "../Firebase/FirebaseAuthContext";
import Swal from "sweetalert2";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import loginImage from "../assets/Login/login.jpg";
import GoogleLogin from "./GoogleLogin";
import GithubLogin from "./GitHubLogin";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { emailLogin, setLoading, theme } = useContext(FirebaseAuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = "Login";
  }, []);

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
    },
  };

  const currentTheme = themeColors[theme];

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    emailLogin(email, password)
      .then((userCredential) => {
        Swal.fire({
          title: "Success!",
          text: "User logged in successfully",
          icon: "success",
          background: currentTheme.cardBg,
          color: currentTheme.text,
        });
        navigate(location?.state?.from || "/");
      })
      .catch((error) => {
        let message = "";
        switch (error.code) {
          case "auth/user-not-found":
            message = "No account found with this email";
            break;
          case "auth/wrong-password":
            message = "Incorrect Password";
            break;
          case "auth/invalid-email":
            message = "Please enter a valid email address";
            break;
          default:
            message = "Login Failed!";
        }

        Swal.fire({
          title: "Error",
          text: message,
          icon: "error",
          background: currentTheme.cardBg,
          color: currentTheme.text,
        });
        setLoading(false);
      });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300"
      style={{ backgroundColor: currentTheme.bg }}
    >
      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-lg">
        {/* Left: Form Section */}
        <div
          className="w-full md:w-1/2 p-8 md:p-12 transition-colors duration-300"
          style={{
            backgroundColor: currentTheme.cardBg,
            color: currentTheme.text,
          }}
        >
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-center">
              Welcome Back
            </h1>
            <p className="text-center mb-8 opacity-80">Sign in to continue</p>

            <form onSubmit={handleLogin} className="space-y-6">
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
                    placeholder="Enter your password"
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

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm hover:underline"
                  style={{ color: currentTheme.activeLink }}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 hover:shadow-md"
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
                Login
              </button>
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
              <GithubLogin theme={theme} currentTheme={currentTheme} />
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <span style={{ color: currentTheme.text }}>
                Don't have an account?{" "}
              </span>
              <Link
                to="/register"
                state={location.state}
                className="font-semibold hover:underline"
                style={{ color: currentTheme.activeLink }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Image Section */}
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src={loginImage}
            alt="Login visual"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-t from-black/70 to-black/40">
            <div className="text-center">
              <h2
                className="text-4xl font-bold text-white mb-4"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
              >
                Discover Amazing Content
              </h2>
              <p
                className="text-white/90 max-w-md mx-auto"
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
              >
                Join our community of passionate users and explore exclusive
                features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
