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
  const { user, theme } = useContext(FirebaseAuthContext);
  const [isAdmin] = useAdmin();
  const navigate = useNavigate();

  const themeStyles = {
    light: {
      bg: "bg-gray-50",
      text: "text-gray-800",
      card: "bg-white border border-gray-100",
      input: "bg-white border-gray-300 focus:border-blue-500",
      button: "bg-blue-600 hover:bg-blue-700",
      secondaryText: "text-gray-600",
      accent: "text-blue-600",
      sidebar: "bg-white",
      topBar: "bg-white",
      hover: "hover:bg-gray-100",
      activeLink: "bg-blue-100 text-blue-700",
      iconButton: "bg-gray-200 hover:bg-gray-300",
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      card: "bg-gray-800 border-gray-700",
      input: "bg-gray-700 border-gray-600 focus:border-blue-400",
      button: "bg-blue-500 hover:bg-blue-600",
      secondaryText: "text-gray-300",
      accent: "text-blue-400",
      sidebar: "bg-gray-800",
      topBar: "bg-gray-800",
      hover: "hover:bg-gray-700",
      activeLink: "bg-blue-700 text-white",
      iconButton: "bg-gray-700 hover:bg-gray-600",
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

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
         useEffect(() => {
      document.title = "All Donations";
    }, []);

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

      Swal.fire({
        title: "Success!",
        text: `Donation campaign has been ${!currentStatus ? "paused" : "resumed"}.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error toggling pause:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update pause status.",
        icon: "error",
      });
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

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 ${currentTheme.text}`}>
        <p className="text-lg font-medium">Loading donations...</p>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-6 max-w-[95vw] mx-auto ${currentTheme.bg} ${currentTheme.text} min-h-screen`}>
      <h2 className={`text-2xl md:text-3xl font-extrabold mb-6 md:mb-8 text-center ${theme === 'light' ? 'text-indigo-700' : 'text-indigo-400'} tracking-wide`}>
        All Donation Campaigns 
      </h2>

      <div className={`overflow-x-auto shadow-lg rounded-lg border ${currentTheme.card}`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`${theme === 'light' ? 'bg-indigo-100' : 'bg-gray-700'}`}>
            <tr>
              <th className="px-3 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                Pet
              </th>
              <th className="px-3 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                Owner
              </th>
              <th className="px-3 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider hidden sm:table-cell">
                Max Donation
              </th>
              <th className="px-3 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                Progress
              </th>
              <th className="px-3 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${theme === 'light' ? 'divide-gray-200' : 'divide-gray-700'}`}>
            {allDonations.map((donation) => {
              const progress = Math.min(
                Math.round((donation.donatedAmount / donation.goal) * 100),
                100
              );

              return (
                <tr
                  key={donation._id}
                  className={`${theme === 'light' ? 'hover:bg-indigo-50' : 'hover:bg-gray-700'} transition-colors duration-200`}
                >
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={donation.petImage}
                        alt={donation.petName}
                        className="w-12 h-12 rounded-full object-cover border shadow-sm"
                      />
                      <div>
                        <p className="font-semibold">{donation.petName}</p>
                        {donation.isPaused && (
                          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                            theme === 'light' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-yellow-900 text-yellow-300'
                          }`}>
                            Paused
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-4 whitespace-nowrap">
                    <p className="font-medium">{donation.ownerName}</p>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {donation.ownerEmail}
                    </p>
                  </td>

                  <td className="px-3 py-4 whitespace-nowrap hidden sm:table-cell">
                    ${donation.maximumDonationAmount}
                  </td>

                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className={`w-full rounded h-4 relative ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-600'}`}>
                      <div
                        className={`h-4 rounded ${
                          progress < 50
                            ? theme === 'light' ? 'bg-yellow-500' : 'bg-yellow-400'
                            : theme === 'light' ? 'bg-green-500' : 'bg-green-400'
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                      <span className={`absolute top-0 left-1 text-xs font-semibold ${
                        progress > 20 ? 'text-white' : theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                      }`}>
                        {progress}%
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      ${donation.donatedAmount} of ${donation.goal}
                    </p>
                  </td>

                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleEdit(donation._id)}
                        className={`px-2 py-1 text-xs md:text-sm rounded ${
                          theme === 'light'
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleTogglePause(donation._id, donation.isPaused)}
                        className={`px-2 py-1 text-xs md:text-sm rounded text-white ${
                          donation.isPaused
                            ? theme === 'light'
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "bg-yellow-500 hover:bg-yellow-600"
                            : theme === 'light'
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {donation.isPaused ? "Resume" : "Pause"}
                      </button>
                      <button
                        onClick={() => handleDelete(donation._id)}
                        className={`px-2 py-1 text-xs md:text-sm rounded ${
                          theme === 'light'
                            ? "bg-gray-600 text-white hover:bg-gray-700"
                            : "bg-gray-500 text-white hover:bg-gray-600"
                        }`}
                      >
                        Delete
                      </button>
                    </div>
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