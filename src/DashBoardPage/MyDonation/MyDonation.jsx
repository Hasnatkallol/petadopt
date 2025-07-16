import React, { useContext, useEffect, useState } from "react";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import axios from "axios";

const MyDonation = () => {
  const { user } = useContext(FirebaseAuthContext);
  const [donations, setDonations] = useState([]);
  useEffect(() => {
    if (!user?.email) return; // <-- safely return if user or email not ready

    const fetchDonations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/donation", {
          params: { email: user.email },
        });
        setDonations(res.data);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, [user?.email]);

  const handleRefund = async (id) => {
    const confirm = window.confirm("Are you sure you want a refund?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/donation/${id}`);
      setDonations((prev) => prev.filter((donation) => donation._id !== id));
    } catch (error) {
      console.error("Error processing refund:", error);
      alert("Failed to process refund.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        My Donations ({donations.length})
      </h1>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Pet Image
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Pet Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Donated Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {donations.map((donation, index) => (
              <tr key={index}>
                <td className="px-6 py-4">
                  <img
                    src={donation.petImage}
                    alt={donation.petName}
                    className="w-16 h-16 rounded object-cover"
                  />
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {donation.petName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  ${donation.amount}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleRefund(donation._id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Ask for Refund
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyDonation;
