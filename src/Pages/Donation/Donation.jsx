import React, { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const Donation = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchCampaigns = async () => {
    const res = await axios.get(`/api/donation-campaigns?page=${page}&limit=9`);
    if (res.data.length === 0) {
      setHasMore(false);
    } else {
      setCampaigns((prev) => [...prev, ...res.data]);
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Donation Campaigns</h1>

      <InfiniteScroll
        dataLength={campaigns.length}
        next={fetchCampaigns}
        hasMore={hasMore}
        loader={<p className="text-center">Loading...</p>}
        endMessage={<p className="text-center text-gray-500">No more campaigns.</p>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="bg-white rounded-2xl shadow p-4 flex flex-col"
            >
              <img
                src={campaign.petImage}
                alt={campaign.petName}
                className="h-48 object-cover rounded-xl mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{campaign.petName}</h2>
              <p className="text-sm text-gray-600 mb-1">
                Max Donation: ${campaign.maxAmount}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Donated: ${campaign.donatedAmount}
              </p>
              <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                View Details
              </button>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Donation;
