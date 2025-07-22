import React, { useContext, useEffect, useState } from "react";
import useAdmin from "../../../Hooks/useAdmin";
import { useNavigate } from "react-router-dom";
import { FirebaseAuthContext } from "../../../Firebase/FirebaseAuthContext";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AllDonations = () => {
  const [allDonations, setAllDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(FirebaseAuthContext);
  const [isAdmin] = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) return;

    const fetchAllDonations = async () => {
      try {
        const res = await axiosSecure.get("/alldonationsforAdmin");
        setAllDonations(res.data);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDonations();
  }, [axiosSecure, user, isAdmin]);

  const handleEdit = (id) => {
    navigate(`/dashboard/edit-donation/${id}`);
  };

  const handleTogglePause = async (id, currentStatus) => {
    try {
      await axiosSecure.patch(`/donationPetDb/pause/${id}`, {
        isPaused: !currentStatus,
      });

      setAllDonations((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isPaused: !currentStatus } : item
        )
      );
    } catch (error) {
      console.error("Error toggling pause:", error);
      alert("Failed to update pause status.");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This donation campaign will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/donationPetDb/${id}?email=${user.email}`);
        setAllDonations((prev) => prev.filter((item) => item._id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "The donation campaign has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error deleting donation:", error);

        Swal.fire({
          title: "Error!",
          text: "Failed to delete donation campaign.",
          icon: "error",
        });
      }
    }
  };

  if (loading) return <p className="p-6">Loading donations...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        All Donation Campaigns ({allDonations.length})
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Pet</th>
              <th className="px-4 py-2">Owner</th>
              <th className="px-4 py-2">Max Donation</th>
              <th className="px-4 py-2">Progress</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allDonations.map((donation) => {
              const progress = Math.min(
                Math.round((donation.donatedAmount / donation.goal) * 100),
                100
              );

              return (
                <tr key={donation._id} className="border-t">
                  <td className="px-4 py-2 flex items-center gap-3">
                    <img
                      src={donation.petImage}
                      alt={donation.petName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <span>{donation.petName}</span>
                      {donation.isPaused && (
                        <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                          Paused
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-2">
                    <p className="text-sm">{donation.ownerName}</p>
                    <p className="text-xs text-gray-500">
                      {donation.ownerEmail}
                    </p>
                  </td>

                  <td className="px-4 py-2">
                    ${donation.maximumDonationAmount}
                  </td>

                  <td className="px-4 py-2">
                    <div className="w-full bg-gray-200 rounded h-4 relative">
                      <div
                        className="bg-green-500 h-4 rounded"
                        style={{ width: `${progress}%` }}
                      ></div>
                      <span className="absolute top-0 left-1 text-xs text-white font-semibold">
                        {progress}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      ${donation.donatedAmount} of ${donation.goal}
                    </p>
                  </td>

                  <td className="px-4 py-2 flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleEdit(donation._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleTogglePause(donation._id, donation.isPaused)
                      }
                      className={`px-3 py-1 rounded text-white ${
                        donation.isPaused
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {donation.isPaused ? "Unpause" : "Pause"}
                    </button>
                    <button
                      onClick={() => handleDelete(donation._id)}
                      className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllDonations;
