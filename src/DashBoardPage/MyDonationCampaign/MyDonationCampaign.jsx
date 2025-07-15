import React, { useContext, useEffect, useState } from "react";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";

const MyDonationCampaign = () => {
  const { user } = useContext(FirebaseAuthContext);
  const [myPets, setMyPets] = useState([]);
  const [errmsg, setErrmsg] = useState("");
  const [selectedDonators, setSelectedDonators] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPetName, setModalPetName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setErrmsg("");
    axios
      .get(`http://localhost:5000/donationPetDb?email=${user.email}`)
      .then((res) => setMyPets(res.data))
      .catch((err) => {
        console.error("Fetch error:", err);
        setErrmsg(err.response?.data?.message || "Something went wrong");
      });
  }, [user]);

  const handleEdit = (id) => {
    navigate(`/dashboard/edit-donation/${id}`);
  };

  const handleViewDonators = (donationId, petName) => {
    axios
      .get(`http://localhost:5000/donators/${donationId}`)
      .then((res) => {
        setSelectedDonators(res.data);
        setModalPetName(petName);
        setIsModalOpen(true);
      })
      .catch((err) => {
        console.error("Donators fetch error:", err);
      });
  };

  const handleTogglePause = async (id, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5000/donationPetDb/pause/${id}`, {
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
        <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50 p-4">
          <Dialog.Panel className="bg-white rounded p-6 w-full max-w-md">
            <Dialog.Title className="text-xl font-bold mb-4">
              Donators for {modalPetName}
            </Dialog.Title>
            {selectedDonators.length > 0 ? (
              <ul className="space-y-2">
                {selectedDonators.map((donor, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{donor.name || donor.email}</span>
                    <span className="font-semibold">${donor.amount}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No donations yet.</p>
            )}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default MyDonationCampaign;
