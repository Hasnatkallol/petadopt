import React, { useContext, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import RecommendedCampaigns from "./RecommendedCampaigns";

const stripePromise = loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY);

const DonationDetails = () => {
  const {
    _id,
    petName,
    petImage,
    maximumDonationAmount,
    donatedAmount,
    shortDescription,
    category,
    createdAt,
    longDescription,
    isPaused,
  } = useLoaderData();

  const [showModal, setShowModal] = useState(false);
  const { user, theme } = useContext(FirebaseAuthContext);
  const navigate = useNavigate();
  const Pathlocation = useLocation();

  // Theme-based styles
  const themeStyles = {
    light: {
      bg: "bg-gray-50",
      text: "text-gray-800",
      card: "bg-white border-gray-200",
      cardText: "text-gray-600",
      button: "bg-green-600 hover:bg-green-700",
      modalBg: "bg-white",
      modalText: "text-gray-900",
      border: "border-gray-200"
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      card: "bg-gray-800 border-gray-700",
      cardText: "text-gray-300",
      button: "bg-green-500 hover:bg-green-600",
      modalBg: "bg-gray-800",
      modalText: "text-gray-100",
      border: "border-gray-700"
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  const handleDonateClick = () => {
    if (!user) {
      navigate("/login", {
        state: { from: Pathlocation.pathname },
        replace: true,
      });
      return;
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className={`min-h-screen mt-8 py-12 px-4 ${currentTheme.bg} ${currentTheme.text}`}>
      <div className="container mx-auto max-w-6xl">
        {/* Donation Info Card */}
        <div className={`w-full p-6 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl mb-12 ${currentTheme.card} ${currentTheme.border}`}>
          <h2 className={`text-3xl font-bold mb-6 text-center ${currentTheme.text}`}>
            Donation Details
          </h2>

          <div className="flex flex-col md:flex-row md:justify-around items-center gap-8">
            <img
              src={petImage}
              alt={petName}
              className="w-64 h-64 object-cover rounded-2xl shadow-md"
            />

            <div className="space-y-4 max-w-md">
              <h3 className={`text-2xl font-semibold ${currentTheme.text}`}>{petName}</h3>
              <p className={`${currentTheme.cardText} leading-relaxed`}>
                {shortDescription}
              </p>

              <div className={`text-sm space-y-2 ${currentTheme.cardText}`}>
                <p>
                  <span className="font-medium">Category:</span> {category}
                </p>
                <p>
                  <span className="font-medium">Created At:</span> {new Date(createdAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Donated:</span> ${donatedAmount || 0}
                </p>
                <p>
                  <span className="font-medium">Goal:</span> ${maximumDonationAmount || "N/A"}
                </p>
                <p>{longDescription}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            {!isPaused && (
              <button
                onClick={handleDonateClick}
                className={`px-8 py-3 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-md ${currentTheme.button}`}
              >
                Donate Now →
              </button>
            )}
          </div>
        </div>

        {/* Donation Modal */}
        {showModal && (
          <Elements stripe={stripePromise}>
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
              <div className={`relative max-w-md w-full rounded-2xl shadow-xl p-8 ${currentTheme.modalBg} ${currentTheme.modalText}`}>
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  aria-label="Close modal"
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
                    src={petImage}
                    alt={petName}
                    className="w-24 h-24 object-cover rounded-full shadow border-4 border-white dark:border-gray-700"
                  />
                  <h2 className="text-2xl font-semibold mt-4 text-center">
                    Donate to {petName}
                  </h2>
                </div>

                <PaymentForm petName={petName} petImage={petImage} id={_id} />
              </div>
            </div>
          </Elements>
        )}

        <div className="mt-8">
        
          
        </div>
      </div>
    </div>
  );
};

export default DonationDetails;