import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { FirebaseAuthContext } from "../Firebase/FirebaseAuthContext";
import Swal from "sweetalert2";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import loginAnimation from "../assets/Login/login.json"; // Only for large screens
import Lottie from "lottie-react";
import GoogleLogin from "./GoogleLogin";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "Login";
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const { emailLogin, setLoading } = useContext(FirebaseAuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    emailLogin(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        Swal.fire("Success!", "User logged in successfully", "success");
        navigate(location.state || "/");
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

        Swal.fire("Error", message, "error");
        setLoading(false);
      });
  };

  return (
    <div className="w-11/12 mx-auto my-10 flex flex-col-reverse md:flex-row items-center justify-center gap-10">
      {/* Left: Form Section */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-base-200">
          <h1 className="text-black font-semibold text-center text-2xl mb-4">
            Login Your Account
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="label">Email</label>
              <input
                name="email"
                type="email"
                className="input w-full"
                placeholder="Email"
                required
              />
            </div>

            {/* Password with toggle */}
            <div className="relative">
              <label className="label">Password</label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className="input w-full pr-10"
                placeholder="Password"
                required
              />
              <span
                className="absolute right-3 top-8 cursor-pointer text-xl text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>

            {/* Forgot password */}
            <div className="mt-2">
              <a
                href="https://mail.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="link text-blue-800 underline font-semibold link-hover"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn bg-[#161A20] text-white w-full"
            >
              Login
            </button>
          </form>

          <div className="divider">OR</div>
          <div className="w-full">
            <GoogleLogin ></GoogleLogin>
          </div>

          {/* Signup link */}
          <h1 className="text-black font-semibold text-center mt-4">
            Don't have an account?{" "}
            <Link
              className="text-red-600"
              to={"/register"}
              state={location.state}
            >
              Sign up
            </Link>
          </h1>
        </div>
      </div>

      {/* Right: Lottie Animation (only visible on md and up) */}
      <div className="w-full md:w-1/2 hidden md:flex justify-center items-center">
        <Lottie
          animationData={loginAnimation}
          loop={true}
          className="w-full max-w-md"
        />
      </div>
    </div>
  );
};

export default Login;
