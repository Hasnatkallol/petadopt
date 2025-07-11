import React, { useContext, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY);

const DonationDetails = () => {
  const {
    _id,
    petName,
    petImage,
    maximumDonationAmount,
    donatedAmount,
    description,
    category,
    createdAt,
  } = useLoaderData();

  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(FirebaseAuthContext);
  const navigate = useNavigate();
  const Pathlocation = useLocation();

  

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
    <div className="flex flex-col items-center justify-center bg-gray-50 px-4 py-10">
      {/* Donation Info Card */}
      <div className="w-full max-w-4xl p-6 rounded-2xl bg-white shadow-xl border border-gray-200 transition-all duration-300 hover:shadow-2xl mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Donation Details
        </h2>

        <div className="flex  flex-col md:flex-row md:justify-around items-center gap-6">
          <img
            src={petImage}
            alt={petName}
            className="w-48 h-48 object-cover rounded-2xl  shadow-md"
          />

          <div className=" space-y-3">
            <h3 className="text-2xl font-semibold text-gray-800">{petName}</h3>
            <p className="text-gray-600 leading-relaxed">
              {description?.slice(0, 120)}...
            </p>

            <div className="text-sm text-gray-700 space-y-2">
              <p>
                <span className="font-medium text-gray-800">Category:</span>{" "}
                {category}
              </p>
              <p>
                <span className="font-medium text-gray-800">Created At:</span>{" "}
                {new Date(createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium text-gray-800">Donated:</span> $
                {donatedAmount || 0}
              </p>
              <p>
                <span className="font-medium text-gray-800">Goal:</span> $
                {maximumDonationAmount || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleDonateClick}
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 hover:scale-105 transition-all duration-300 shadow-md"
          >
            Donate Now →
          </button>
        </div>
      </div>

      {/* Donation Modal */}
      {showModal && (
        <Elements stripe={stripePromise}>
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="relative flex flex-col items-center max-w-lg w-full gap-5 p-8 rounded-2xl shadow-xl sm:py-10 sm:px-12 bg-white text-gray-900">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <polygon points="427.314 107.313 404.686 84.687 256 233.373 107.314 84.687 84.686 107.313 233.373 256 84.686 404.687 107.314 427.313 256 278.627 404.686 427.313 427.314 404.687 278.627 256 427.314 107.313"></polygon>
                </svg>
              </button>

              {/* Pet Image */}
              <img
                src={petImage}
                alt={petName}
                className="w-24 h-24 object-cover rounded-full shadow"
              />

              <h2 className="text-2xl font-semibold text-center">
                Donate to {petName}
              </h2>

              {/* Mount the form here inside modal */}
              <PaymentForm id={_id} />
            </div>
          </div>
        </Elements>
      )}
     <div>
        <h1>Recommened campaigns </h1>
     </div>
    </div>
  );
};

export default DonationDetails;
