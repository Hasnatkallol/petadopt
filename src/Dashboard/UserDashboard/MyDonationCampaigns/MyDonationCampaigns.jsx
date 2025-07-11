import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { FirebaseAuthContext } from "../../../Firebase/FirebaseAuthContext";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const MyDonationCampaigns = () => {
  const { user } = useContext(FirebaseAuthContext);
  const axiosSecure = useAxiosSecure();

  const { data: campaigns = [], isLoading: loadingCampaigns } = useQuery({
    queryKey: ["myDonationCampaigns", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donationPetDb/createdBy/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const campaignIds = campaigns.map(c => c._id);

  const { data: donations = [], isLoading: loadingDonations } = useQuery({
    queryKey: ["donationsForCampaigns", campaignIds],
    queryFn: async () => {
      if (campaignIds.length === 0) return [];
      const res = await axiosSecure.get(`/donations?campaignIds=${campaignIds.join(",")}`);
      return res.data;
    },
    enabled: campaignIds.length > 0,
  });

  if (loadingCampaigns || loadingDonations) return <p className="text-center mt-10">Loading...</p>;

  if (campaigns.length === 0) return <p className="text-center mt-10">You haven't created any donation campaigns yet.</p>;

  const donationsByCampaign = donations.reduce((acc, donation) => {
    acc[donation.campaignId] = acc[donation.campaignId] || [];
    acc[donation.campaignId].push(donation);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Donation History</h1>

      {campaigns.map((campaign) => (
        <div key={campaign._id} className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{campaign.petName}</h2>

          <div className="space-y-4">
            {(!donationsByCampaign[campaign._id] || donationsByCampaign[campaign._id].length === 0) ? (
              <p className="text-gray-500 italic">No donations yet for this campaign.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {donationsByCampaign[campaign._id].map((donation) => (
                  <li key={donation._id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{donation.donorName}</p>
                      <p className="text-sm text-gray-500">{donation.donorEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-semibold">${(donation.amount / 100).toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{new Date(donation.date).toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyDonationCampaigns;
