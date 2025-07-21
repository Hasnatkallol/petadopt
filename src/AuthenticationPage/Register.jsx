import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import registerAnimation from "../assets/Register/register.json";
import Swal from "sweetalert2";
import { FirebaseAuthContext } from "../Firebase/FirebaseAuthContext";
import Lottie from "lottie-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import GoogleLogin from "./GoogleLogin";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const Register = () => {
  useEffect(() => {
    document.title = "SignUp";
  }, []);
  const axiosPublic = useAxiosPublic()

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { createUser, userProfileUpdate, setLoading } =
    useContext(FirebaseAuthContext);

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(false);
    setErrorMessage("");

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!/(?=.*\d)/.test(password)) {
      Swal.fire(
        "Weak Password",
        "Password must contain at least one number.",
        "warning"
      );
      setLoading(false);
      return;
    }
    if (!/(?=.*[a-z])/.test(password)) {
      Swal.fire(
        "Weak Password",
        "Password must contain at least one lowercase letter.",
        "warning"
      );
      setLoading(false);
      return;
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      Swal.fire(
        "Weak Password",
        "Password must contain at least one uppercase letter.",
        "warning"
      );
      setLoading(false);
      return;
    }
    if (!/.{8,}/.test(password)) {
      Swal.fire(
        "Weak Password",
        "Password must be at least 8 characters long.",
        "warning"
      );
      setLoading(false);
      return;
    }

    createUser(email, password)
      .then(async (userCredential) => {
        console.log(userCredential.user);
        setSuccessMessage(true);
        Swal.fire("Success!", "Successfully registered!", "success");
        setLoading(false);
        navigate(location.state || "/");

        //send to databse
        const userInfo = {
          email: email,
          name: name,
          image: profilePic,
          role: "user", // default role
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };
        console.log(userInfo);

        const userResult = await axiosPublic.post("/users", userInfo);
        console.log(userResult);

        //Firebase update
        const userProfile = {
          displayName: name,
          photoURL: profilePic,
        };
        userProfileUpdate(userProfile)
          .then(() => {
            console.log("profile name pic updated");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(error.message);
        Swal.fire("Error", error.message, "error");
        setLoading(false);
      });
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];

    const formData = new FormData();
    formData.append("image", image);

    const imagUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_IMGBBKEY
    }`;
    
    const res = await fetch(imagUploadUrl, {body:formData,method:'post'});
    const data = await res.json()
    setProfilePic(data.data.url);
  
  };
  console.log(profilePic)


  return (
    <div className="w-11/12 max-w-7xl mx-auto my-10 flex flex-col-reverse md:flex-row items-center gap-8">
      {/* Form Section */}
      <div className="w-full md:w-1/2">
        <div className="bg-base-200 p-8 shadow-md rounded-lg">
          <h1 className="text-base-content font-semibold text-center text-2xl mb-4">
            Register Your Account
          </h1>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="label text-base-content">Name</label>
              <input
                name="name"
                type="text"
                className="input input-bordered w-full"
                placeholder="Name"
                required
              />
            </div>
            <div className="">
              <label className="label text-base-content">Image</label>
              <input
                name="image"
                type="file"
                className="input input-bordered w-full pt-1.5"
                required
                onChange={handleImageUpload}
              />
            </div>
            <div>
              <label className="label text-base-content">Email</label>
              <input
                name="email"
                type="email"
                className="input input-bordered w-full"
                placeholder="Email"
                required
              />
            </div>
            <div className="relative">
              <label className="label text-base-content">Password</label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pr-10"
                placeholder="Password"
                required
              />
              <span
                className="absolute right-3 top-10 cursor-pointer text-xl text-base-content"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>

            <button
              type="submit"
              className="btn bg-accent text-black w-full mt-2 hover:opacity-90"
            >
              Register
            </button>

            {errorMessage && <p className="text-error">{errorMessage}</p>}
            {successMessage && (
              <p className="text-success">Successfully Signed Up</p>
            )}
          </form>

          <div className="divider text-base-content">OR</div>
          <div>
            <GoogleLogin />
          </div>

          <p className="text-center mt-4 text-base-content font-semibold">
            Already have an account?{" "}
            <Link className="text-accent" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Animation Section (Only for md and above) */}
      <div className="w-full md:w-1/2 hidden md:flex justify-center">
        <Lottie
          animationData={registerAnimation}
          loop
          className="w-full max-w-md"
        />
      </div>
    </div>
  );
};

export default Register;
