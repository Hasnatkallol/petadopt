import React from "react";
import { Link } from "react-router";
// import Navbar from "./Navbar";
const Error = () => {
  return (
    <div>
      {/* <Navbar></Navbar> */}
      <div className="w-11/12 mx-auto  mt-40 ">
        <div className="flex flex-col justify-center items-center">
          <div>
            <img
              src={"/error.jpg"}
              className="w-[300px] h-[300px] rounded-2xl "
              alt="Error Image"
            />
          </div>
          <h1 className="font-bold text-red-600 text-4xl py-5">
            404 - Page Not Found
          </h1>
          <p className="font-medium text-xl">
            Opps! The page you are looking for doesn't exist
          </p>
          <Link to={"/"}>
            {" "}
            <button className="bg-gradient-to-r from-[#e0f2ff] via-[#e9e7fc] to-[#f1e7ff] text-black font-semibold py-3 my-4 px-6 rounded-2xl shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg hover:opacity-95">
              Back To Home
            </button>{" "}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error;
