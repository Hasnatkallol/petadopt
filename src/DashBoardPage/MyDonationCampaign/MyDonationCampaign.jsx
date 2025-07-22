import React, { useContext, useEffect, useState } from "react";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";

import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const MyDonationCampaign = () => {
  const { user } = useContext(FirebaseAuthContext);
  const [myPets, setMyPets] = useState([]);
  const [errmsg, setErrmsg] = useState("");
  const [selectedDonators, setSelectedDonators] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPetName, setModalPetName] = useState("");
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure()

  useEffect(() => {
    if (!user) return;
    setErrmsg("");
    axiosSecure
      .get(`/donationPetDb?email=${user.email}`)
      .then((res) => setMyPets(res.data))
      .catch((err) => {
        console.error("Fetch error:", err);
        setErrmsg(err.response?.data?.message || "Something went wrong");
      });
  }, [user,axiosSecure]);

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
        console.log(res.data);
      })
      .catch((err) => {
        console.error("Error fetching donators:", err);
        setSelectedDonators([]);
        setIsModalOpen(true); // still open the modal with message
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
      alert("Failed to update pause status.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        My Donation Campaigns ({myPets.length})
      </h1>

      {errmsg && <p className="text-red-500 mb-4">{errmsg}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Pet</th>
              <th className="px-4 py-2">Max Donation</th>
              <th className="px-4 py-2">Progress</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myPets.map((pet) => {
              const progress = Math.min(
                Math.round((pet.donatedAmount / pet.goal) * 100),
                100
              );

              return (
                <tr key={pet._id} className="border-t">
                  <td className="px-4 py-2 flex items-center gap-3">
                    <img
                      src={pet.petImage}
                      alt={pet.petName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <span>{pet.petName}</span>
                      {pet.isPaused && (
                        <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                          Paused
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">${pet.maximumDonationAmount}</td>
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
                      ${pet.donatedAmount} of ${pet.goal}
                    </p>
                  </td>
                  <td className="px-4 py-2 flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleEdit(pet._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleViewDonators(pet._id, pet.petName)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      View Donators
                    </button>
                    <button
                      onClick={() => handleTogglePause(pet._id, pet.isPaused)}
                      className={`px-3 py-1 rounded text-white ${
                        pet.isPaused
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {pet.isPaused ? "Unpause" : "Pause"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Donators Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-60 p-6">
          <Dialog.Panel className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transition-all duration-300">
            <Dialog.Title className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Donators for{" "}
              <span className="text-indigo-600">{modalPetName}</span>
            </Dialog.Title>

            {selectedDonators.length > 0 ? (
              <ul className="space-y-4">
                {/* Header Row */}
                <li className="grid grid-cols-3 gap-4 font-semibold text-gray-600 border-b pb-2">
                  <span>Name</span>
                  <span>Email</span>
                  <span className="text-right">Amount</span>
                </li>

                {/* Donator Rows */}
                {selectedDonators.map((donor, idx) => (
                  <li
                    key={idx}
                    className="grid grid-cols-3 gap-4 text-gray-700 border-b pb-3"
                  >
                    <span className="truncate">{donor.donorName}</span>
                    <span className=" text-sm text-gray-500">
                      {donor.donorEmail}
                    </span>
                    <span className="font-semibold text-right text-green-600">
                      ${donor.amount}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 italic">
                No donations yet.
              </p>
            )}

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default MyDonationCampaign;
