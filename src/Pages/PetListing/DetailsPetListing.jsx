import React, { useContext, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import Swal from "sweetalert2";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const DetailsPetListing = () => {
  const {
    _id,
    name,
    age,
    image,
    location,
    breed,
    gender,
    vaccinated,
    adoptionStatus,
    longDescription,
    addedBy,
  } = useLoaderData();
  const axiosPublic = useAxiosPublic();

  const [showModal, setShowModal] = useState(false);
  const { user, theme } = useContext(FirebaseAuthContext);
  const navigate = useNavigate();
  const Pathlocation = useLocation();

  const handleAdoptClick = () => {
    if (!user) {
      navigate("/login", {
        state: { from: Pathlocation.pathname },
        replace: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneNumber = e.target.phone.value;
    const address = e.target.address.value;
    const data = {
      petId: _id,
      name: name,
      image: image,
      userName: user.displayName,
      userEmail: user.email,
      phone: phoneNumber,
      address: address,
      addedBy: addedBy,
      status: "requested",
    };
  
    try {
      const response = await axiosPublic.post(`/requestAdopt?email=${user?.email}`, data);

      Swal.fire({
        icon: "success",
        title: "Request Submitted!",
        text: "We will contact you soon about the adoption.",
        confirmButtonColor: "#6366f1",
      });

      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error submitting adoption request:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while submitting your request.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // Theme-based color classes
  const themeClasses = {
    light: {
      bg: "bg-gradient-to-br from-gray-50 to-gray-100",
      text: "text-gray-800",
      card: "bg-white",
      cardText: "text-gray-600",
      accent: "text-orange-500",
      modalBg: "bg-white",
      modalText: "text-gray-800",
      inputBg: "bg-white",
      inputBorder: "border-gray-300",
      inputText: "text-gray-700",
      disabledInput: "bg-gray-100 text-gray-600"
    },
    dark: {
      bg: "bg-gradient-to-br from-gray-900 to-gray-800",
      text: "text-gray-100",
      card: "bg-gray-800",
      cardText: "text-gray-300",
      accent: "text-orange-400",
      modalBg: "bg-gray-800",
      modalText: "text-gray-100",
      inputBg: "bg-gray-700",
      inputBorder: "border-gray-600",
      inputText: "text-gray-100",
      disabledInput: "bg-gray-700 text-gray-300"
    }
  };

  const currentTheme = themeClasses[theme] || themeClasses.light;

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row items-center justify-center ${currentTheme.bg} px-4 py-12 sm:px-6 lg:px-8`}>
      {/* Image Section */}
      <div className="w-full lg:w-1/2 mb-10 lg:mb-0 lg:pr-8 flex justify-center">
        <div className="max-w-md w-full">
          <img
            src={image}
            alt={name}
            className="rounded-xl shadow-xl w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Details Section */}
      <div className={`w-full lg:w-1/2 max-w-2xl space-y-6 ${currentTheme.text} px-4 sm:px-0`}>
        <h1 className="text-3xl sm:text-4xl font-bold">
          Meet{" "}
          <span className={`${currentTheme.accent} underline underline-offset-4`}>
            {name}
          </span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
          <p className={`${currentTheme.card} p-3 rounded-lg shadow ${currentTheme.cardText}`}>
            <span className="font-semibold">Gender:</span> {gender}
          </p>
          <p className={`${currentTheme.card} p-3 rounded-lg shadow ${currentTheme.cardText}`}>
            <span className="font-semibold">Breed:</span> {breed}
          </p>
          <p className={`${currentTheme.card} p-3 rounded-lg shadow ${currentTheme.cardText}`}>
            <span className="font-semibold">Age:</span> {age}
          </p>
          <p className={`${currentTheme.card} p-3 rounded-lg shadow ${currentTheme.cardText}`}>
            <span className="font-semibold">Vaccinated:</span> {vaccinated ? "Yes" : "No"}
          </p>
          <p className={`${currentTheme.card} p-3 rounded-lg shadow ${currentTheme.cardText}`}>
            <span className="font-semibold">Location:</span> {location}
          </p>
          <p className={`${currentTheme.card} p-3 rounded-lg shadow ${currentTheme.cardText}`}>
            <span className="font-semibold">Status:</span> {adoptionStatus}
          </p>
        </div>

        <p className={`${currentTheme.cardText} leading-relaxed ${currentTheme.card} p-4 rounded-lg shadow`}>
          {longDescription}
        </p>

        <button
          onClick={handleAdoptClick}
          className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Adopt {name} →
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className={`relative max-w-md w-full ${currentTheme.modalBg} ${currentTheme.modalText} rounded-xl shadow-2xl p-6 sm:p-8`}>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col items-center mb-6">
              <img
                src={image}
                alt={name}
                className="w-24 h-24 object-cover rounded-full border-4 border-white dark:border-gray-700 shadow-md"
              />
              <h2 className="text-xl font-bold mt-4 text-center">
                Adopt {name}
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Pet ID: {_id}
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className={`block text-sm font-medium ${currentTheme.inputText} mb-1`}>
                  Name
                </label>
                <input
                  type="text"
                  value={user.displayName}
                  disabled
                  className={`w-full px-4 py-2 rounded-lg ${currentTheme.disabledInput} border-none`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${currentTheme.inputText} mb-1`}>
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className={`w-full px-4 py-2 rounded-lg ${currentTheme.disabledInput} border-none`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${currentTheme.inputText} mb-1`}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${currentTheme.inputBorder} ${currentTheme.inputBg} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="+880 1234 567890"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${currentTheme.inputText} mb-1`}>
                  Address *
                </label>
                <textarea
                  required
                  name="address"
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border ${currentTheme.inputBorder} ${currentTheme.inputBg} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter your full address"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg shadow hover:shadow-md transition-all"
              >
                Submit Adoption Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsPetListing;