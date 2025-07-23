import React, { useContext, useEffect, useState } from "react";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MyDonation = () => {
  const { user, theme } = useContext(FirebaseAuthContext);
  const [donations, setDonations] = useState([]);
  const axiosSecure = useAxiosSecure();

  // Theme styles
  const themeStyles = {
    light: {
      bg: "bg-gray-50",
      text: "text-gray-800",
      card: "bg-white border border-gray-100",
      tableHeader: "bg-gray-100 text-gray-700",
      tableRow: "bg-white",
      tableText: "text-gray-800",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      card: "bg-gray-800 border-gray-700",
      tableHeader: "bg-gray-700 text-gray-100",
      tableRow: "bg-gray-800",
      tableText: "text-gray-100",
      button: "bg-blue-500 hover:bg-blue-600 text-white",
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  useEffect(() => {
    if (!user?.email) return;

    const fetchDonations = async () => {
      try {
        const res = await axiosSecure.get("/donation", {
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
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, request refund!",
      background: theme === "dark" ? "#1f2937" : "#ffffff",
      color: theme === "dark" ? "#ffffff" : "#000000",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.delete(`/donation/${id}`);
      setDonations((prev) => prev.filter((donation) => donation._id !== id));
      
      Swal.fire({
        title: "Success!",
        text: "Your refund request has been processed.",
        icon: "success",
        background: theme === "dark" ? "#1f2937" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#000000",
      });
    } catch (error) {
      console.error("Error processing refund:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to process refund.",
        icon: "error",
        background: theme === "dark" ? "#1f2937" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#000000",
      });
    }
  };

  return (
    <div className={`p-4 md:p-6 min-h-screen ${currentTheme.bg} ${currentTheme.text}`}>
      <h1 className="text-2xl font-bold mb-4 md:mb-6">
        My Donations
      </h1>

      <div className={`rounded-lg shadow overflow-hidden ${currentTheme.card}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={currentTheme.tableHeader}>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium md:px-6 md:py-3">
                  Pet Image
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium md:px-6 md:py-3">
                  Pet Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium md:px-6 md:py-3">
                  Donated Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium md:px-6 md:py-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className={`divide-y divide-gray-200 ${currentTheme.tableRow}`}>
              {donations.length > 0 ? (
                donations.map((donation) => (
                  <tr key={donation._id}>
                    <td className="px-4 py-4 md:px-6">
                      <img
                        src={donation.petImage}
                        alt={donation.petName}
                        className="w-12 h-12 md:w-16 md:h-16 rounded object-cover"
                      />
                    </td>
                    <td className={`px-4 py-4 text-sm md:px-6 ${currentTheme.tableText}`}>
                      {donation.petName}
                    </td>
                    <td className={`px-4 py-4 text-sm md:px-6 ${currentTheme.tableText}`}>
                      ${donation.amount}
                    </td>
                    <td className="px-4 py-4 md:px-6">
                      <button
                        onClick={() => handleRefund(donation._id)}
                        className={`px-3 py-1 rounded text-sm font-medium ${theme === "dark" ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"} text-white`}
                      >
                        Request Refund
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={`px-4 py-8 text-center text-sm md:px-6 ${currentTheme.tableText}`}>
                    No donations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyDonation;