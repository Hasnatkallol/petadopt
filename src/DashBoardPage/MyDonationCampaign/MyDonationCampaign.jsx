import React, { useContext, useEffect, useState } from "react";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const MyDonationCampaign = () => {
  const { user, theme } = useContext(FirebaseAuthContext);
  const [myPets, setMyPets] = useState([]);
  const [errmsg, setErrmsg] = useState("");
  const [selectedDonators, setSelectedDonators] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPetName, setModalPetName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const themeStyles = {
    light: {
      bg: "bg-gray-50",
      text: "text-gray-800",
      card: "bg-white border border-gray-200",
      tableHeader: "bg-gray-100 text-gray-700",
      tableRow: "border-t border-gray-200",
      button: {
        edit: "bg-blue-600 hover:bg-blue-700",
        view: "bg-green-600 hover:bg-green-700",
        pause: "bg-red-600 hover:bg-red-700",
        unpause: "bg-yellow-600 hover:bg-yellow-700",
        close: "bg-indigo-600 hover:bg-indigo-700",
      },
      modal: "bg-white",
      progressBg: "bg-gray-200",
      progressBar: "bg-green-500",
      status: {
        paused: "bg-yellow-100 text-yellow-800",
      },
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      card: "bg-gray-800 border-gray-700",
      tableHeader: "bg-gray-700 text-gray-200",
      tableRow: "border-t border-gray-700",
      button: {
        edit: "bg-blue-700 hover:bg-blue-600",
        view: "bg-green-700 hover:bg-green-600",
        pause: "bg-red-700 hover:bg-red-600",
        unpause: "bg-yellow-700 hover:bg-yellow-600",
        close: "bg-indigo-700 hover:bg-indigo-600",
      },
      modal: "bg-gray-800",
      progressBg: "bg-gray-700",
      progressBar: "bg-green-600",
      status: {
        paused: "bg-yellow-900 text-yellow-200",
      },
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setErrmsg("");
    axiosSecure
      .get(`/donationPetDb?email=${user.email}`)
      .then((res) => {
        setMyPets(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setErrmsg(err.response?.data?.message || "Something went wrong");
        setLoading(false);
      });
  }, [user, axiosSecure]);

  const handleEdit = (id) => {
    navigate(`/dashboard/edit-donation/${id}`);
  };

  const handleViewDonators = (donationId, petName) => {
    setModalPetName(petName);
    axiosSecure
      .get(`/donators?donationId=${donationId}`)
      .then((res) => {
        setSelectedDonators(res.data);
        setIsModalOpen(true);
      })
      .catch((err) => {
        console.error("Error fetching donators:", err);
        setSelectedDonators([]);
        setIsModalOpen(true);
      });
  };

  const handleTogglePause = async (id, currentStatus) => {
    try {
      await axiosSecure.patch(`/donationPetDb/pause/${id}`, {
        isPaused: !currentStatus,
      });

      setMyPets((prevPets) =>
        prevPets.map((pet) =>
          pet._id === id ? { ...pet, isPaused: !currentStatus } : pet
        )
      );
    } catch (err) {
      console.error("Error pausing/unpausing:", err);
      Swal.fire({
        title: "Error",
        text: "Failed to update pause status",
        icon: "error",
        background: theme === 'dark' ? '#1f2937' : '#ffffff',
        color: theme === 'dark' ? '#f3f4f6' : '#111827',
      });
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 ${currentTheme.bg} ${currentTheme.text}`}>
      <h1 className="text-2xl font-bold mb-6">My Donation Campaigns</h1>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
            theme === 'dark' ? 'border-blue-400' : 'border-blue-500'
          }`}></div>
        </div>
      )}

      {errmsg && (
        <div className={`p-4 mb-6 rounded-lg ${
          theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'
        }`}>
          {errmsg}
        </div>
      )}

      {!loading && myPets.length === 0 && (
        <div className={`p-4 mb-6 rounded-lg ${
          theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
        }`}>
          You haven't created any donation campaigns yet.
        </div>
      )}

      <div className="overflow-x-auto">
        <div className={`rounded-lg shadow-md overflow-hidden ${currentTheme.card}`}>
          <table className="min-w-full">
            <thead>
              <tr className={currentTheme.tableHeader}>
                <th className="px-4 py-3 text-left">Pet</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Max Donation</th>
                <th className="px-4 py-3 text-left">Progress</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myPets.map((pet) => {
                const progress = Math.min(
                  Math.round((pet.donatedAmount / pet.goal) * 100),
                  100
                );

                return (
                  <tr key={pet._id} className={currentTheme.tableRow}>
                    <td className="px-4 py-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <img
                          src={pet.petImage}
                          alt={pet.petName}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover mx-auto sm:mx-0"
                        />
                        <div className="text-center sm:text-left">
                          <div className="font-medium">{pet.petName}</div>
                          {pet.isPaused && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              currentTheme.status.paused
                            }`}>
                              Paused
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      ${pet.maximumDonationAmount}
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-full relative">
                        <div className={`w-full rounded h-2 md:h-3 ${
                          currentTheme.progressBg
                        }`}>
                          <div
                            className={`h-2 md:h-3 rounded ${
                              currentTheme.progressBar
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span>${pet.donatedAmount}</span>
                          <span>${pet.goal}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <button
                          onClick={() => handleEdit(pet._id)}
                          className={`px-3 py-1 text-white rounded text-sm ${
                            currentTheme.button.edit
                          }`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleViewDonators(pet._id, pet.petName)}
                          className={`px-3 py-1 text-white rounded text-sm ${
                            currentTheme.button.view
                          }`}
                        >
                          Donators
                        </button>
                        <button
                          onClick={() => handleTogglePause(pet._id, pet.isPaused)}
                          className={`px-3 py-1 text-white rounded text-sm ${
                            pet.isPaused ? currentTheme.button.unpause : currentTheme.button.pause
                          }`}
                        >
                          {pet.isPaused ? "Unpaused" : "Pause"}
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

      {/* Donators Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"></div>
          <div className="relative transform overflow-hidden rounded-2xl shadow-xl transition-all sm:w-full sm:max-w-lg">
            <Dialog.Panel className={`${currentTheme.modal} p-6`}>
              <Dialog.Title className={`text-xl font-semibold mb-4 text-center ${
                theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
              }`}>
                Donators for {modalPetName}
              </Dialog.Title>

              {selectedDonators.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-3 gap-4 font-semibold border-b pb-2">
                    <span className="truncate">Name</span>
                    <span className="truncate">Email</span>
                    <span className="text-right">Amount</span>
                  </div>
                  {selectedDonators.map((donor, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-3 gap-4 border-b pb-3 items-center"
                    >
                      <span className="truncate">{donor.donorName}</span>
                      <span className="truncate text-sm">
                        {donor.donorEmail}
                      </span>
                      <span className="text-right font-medium ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }">
                        ${donor.amount}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-center italic py-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  No donations yet.
                </p>
              )}

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`px-5 py-2 text-white rounded-lg ${
                    currentTheme.button.close
                  }`}
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default MyDonationCampaign;