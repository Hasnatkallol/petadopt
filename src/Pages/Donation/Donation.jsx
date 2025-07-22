import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";

const Donation = () => {
  const { theme } = useContext(FirebaseAuthContext);
  const [visibleCampaigns, setVisibleCampaigns] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [endReached, setEndReached] = useState(false);

  // Theme-based styles
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

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchCampaigns = async (pageNumber) => {
    const res = await fetch(
      `http://localhost:5000/donationPetDb?page=${pageNumber}&limit=9`,
      { credentials: "include" }
    );
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCampaigns(1);
        setVisibleCampaigns(data);
        setPage(2);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const loadMore = async () => {
    if (loading || endReached) return;

    setLoading(true);

    await delay(4000); // wait 4 seconds before showing loading
    await new Promise((resolve) => setTimeout(resolve, 2000)); // show loading for 2s

    try {
      const data = await fetchCampaigns(page);
      if (data.length === 0) {
        setEndReached(true);
      } else {
        setVisibleCampaigns((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        !loading &&
        !endReached
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loading, endReached, page]);

  return (
    <div className={` py-8 ${currentTheme.bg} ${currentTheme.text}`}>
      <div className={`w-11/12 mx-auto`}>
        <h2 className={`text-3xl font-semibold text-center mt-14 mb-8 ${currentTheme.text}`}>
          Donation Campaigns
        </h2>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCampaigns.map((pet) => (
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

        <div className="flex justify-center mt-8">
          {loading && (
            <p className={`text-lg font-medium flex items-center space-x-2 ${currentTheme.loadingText}`}>
              <svg
                aria-hidden="true"
                className="w-6 h-6 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span>Loading more campaigns...</span>
            </p>
          )}
          {endReached && !loading && (
            <p className={`text-lg font-medium ${currentTheme.loadingText}`}>
              No more campaigns available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donation;