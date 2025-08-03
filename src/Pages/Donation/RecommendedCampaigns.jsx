// src/components/RecommendedCampaigns/RecommendedCampaigns.jsx

import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";

const RecommendedCampaigns = () => {
  const axiosPublic = useAxiosPublic();
  const { theme } = useContext(FirebaseAuthContext);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const themeStyles = {
    light: {
      bg: "bg-gray-50",
      text: "text-gray-800",
      card: "bg-white border-gray-200",
      cardText: "text-gray-700",
      button: "bg-blue-600 hover:bg-blue-700",
      loadingText: "text-gray-700",
      border: "border-gray-200"
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      card: "bg-gray-800 border-gray-700",
      cardText: "text-gray-300",
      button: "bg-blue-500 hover:bg-blue-600",
      loadingText: "text-gray-300",
      border: "border-gray-700"
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axiosPublic.get("/recommended");
        setCampaigns(response.data);
      } catch (error) {
        console.error("Error fetching recommended campaigns:", error);
        setError("Failed to load recommended campaigns.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [axiosPublic]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className={`py-6 ${currentTheme.bg} ${currentTheme.text}`}>
      <div className="w-11/12 mx-auto">
        <h2 className="text-3xl font-semibold text-center mt-14 mb-8">
          Recommended Campaigns
        </h2>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((pet) => (
            <div
              key={pet._id}
              className={`rounded-lg shadow-md overflow-hidden ${currentTheme.card} ${currentTheme.border}`}
            >
              <img
                className="w-full h-48 sm:h-56 object-cover"
                src={pet.petImage}
                alt={pet.petName}
              />
              <div className="p-5">
                <h5 className={`text-xl font-semibold mb-2 ${currentTheme.text}`}>
                  {pet.petName}
                </h5>
                <p className={`mb-1 ${currentTheme.cardText}`}>
                  <strong>Max Donation:</strong> ${pet.maximumDonationAmount}
                </p>
                <p className={`mb-4 ${currentTheme.cardText}`}>
                  <strong>Donated:</strong> ${pet.donatedAmount}
                </p>
                <Link to={`/donations/${pet._id}`}>
                  <button
                    className={`w-full py-2 px-4 text-white rounded font-medium transition-colors ${currentTheme.button}`}
                  >
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedCampaigns;
