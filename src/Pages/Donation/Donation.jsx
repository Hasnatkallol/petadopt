import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const Donation = () => {
  const [visibleCampaigns, setVisibleCampaigns] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [endReached, setEndReached] = useState(false);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchCampaigns = async (pageNumber) => {
    const res = await fetch(
      `http://localhost:5000/donationPetDb?page=${pageNumber}&limit=9`,
      {credentials: "include"}
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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-center mb-8">
        Donation Campaigns
      </h2>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {visibleCampaigns.map((pet) => (
          <div
            key={pet._id}
            className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden"
          >
            <img
              className="rounded-t-lg w-full h-48 object-cover"
              src={pet.petImage}
              alt={pet.petName}
            />
            <div className="p-5">
              <h5 className="text-xl font-semibold tracking-tight text-gray-900 mb-2">
                {pet.petName}
              </h5>
              <p className="mb-1 text-gray-700">
                <strong>Max Donation:</strong> ${pet.maximumDonationAmount}
              </p>
              <p className="mb-3 text-gray-700">
                <strong>Donated:</strong> ${pet.donatedAmount}
              </p>
              <Link to={`/donations/${pet._id}`}>
                <button className="inline-block px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 w-full text-center font-medium">
                  View Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        {loading && (
          <p className="text-lg font-medium text-gray-700 flex items-center space-x-2">
            <svg
              aria-hidden="true"
              className="w-6 h-6 mr-2 text-gray-500 animate-spin"
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
            Loading more...
          </p>
        )}
        {endReached && !loading && (
          <p className="text-lg font-medium text-gray-700">
            No more campaigns.
          </p>
        )}
      </div>
    </div>
  );
};

export default Donation;
