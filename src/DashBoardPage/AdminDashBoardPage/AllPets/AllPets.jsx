import React, { useEffect, useState, useContext } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FirebaseAuthContext } from "../../../Firebase/FirebaseAuthContext";
import useAdmin from "../../../Hooks/useAdmin";

const AllPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(FirebaseAuthContext);
  const navigate = useNavigate();

  const [isAdmin] = useAdmin();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await axiosSecure.get("/allpetsforAdmin");
        setPets(res.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [axiosSecure]);

  const handleDelete = async (petId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(
          `/adoptPet/${petId}?email=${user.email}`
        );
        if (res.data.deletedCount > 0) {
          setPets((prevPets) => prevPets.filter((pet) => pet._id !== petId));
          Swal.fire("Deleted!", "The pet has been deleted.", "success");
        } else {
          Swal.fire("Failed!", "Could not delete the pet.", "error");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Something went wrong while deleting.", "error");
      }
    }
  };

  const handleUpdate = (petId) => {
    navigate(`/dashboard/update/${petId}`);
  };

  // New handler for changing adoption status

  const handleAdoptionStatusChange = async (petId, newStatus) => {
    if (newStatus === undefined || newStatus === null) return;

    const currentStatus = pets.find((pet) => pet._id === petId)?.adoptionStatus;

    if (currentStatus === newStatus) {
      Swal.fire(
        "Info",
        "The adoption status is already set to this value.",
        "info"
      );
      return;
    }

    try {
      const res = await axiosSecure.patch(`/adoptPet/status/${petId}`, {
        adoptionStatus: newStatus,
      });

      if (res.data.modifiedCount > 0) {
        setPets((prevPets) =>
          prevPets.map((pet) =>
            pet._id === petId ? { ...pet, adoptionStatus: newStatus } : pet
          )
        );
        Swal.fire("Success!", "Adoption status updated.", "success");
      } else {
        Swal.fire("Failed!", "Could not update adoption status.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong while updating.", "error");
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-16 text-lg font-medium text-gray-600">
        Loading pets...
      </p>
    );
  }

  return (
    <div className="p-6 max-w-[95vw] mx-auto">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-700 tracking-wide">
        All Added Pets
      </h2>

      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-indigo-100">
            <tr>
              <th className="px-5 py-3 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wider">
                Image
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wider">
                Age
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wider">
                Breed
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wider">
                Category
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wider">
                Location
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wider">
                Vaccinated
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wider">
                Adoption Status
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wider">
                Added By
              </th>
              {isAdmin && (
                <th className="px-5 py-3 text-left text-sm font-semibold text-indigo-900 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {pets.map((pet) => (
              <tr
                key={pet._id}
                className="hover:bg-indigo-50 transition-colors duration-200"
              >
                <td className="px-5 py-3 whitespace-nowrap">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-300 shadow-sm"
                  />
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-gray-800 font-semibold">
                  {pet.name}
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-gray-600">
                  {pet.age}
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-gray-600">
                  {pet.breed}
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-gray-600">
                  {pet.category}
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-gray-600">
                  {pet.gender}
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-gray-600">
                  {pet.location}
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-center text-gray-700">
                  {pet.vaccinated ? (
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                      Yes
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                      No
                    </span>
                  )}
                </td>

                <td className="px-5 py-3 whitespace-nowrap text-gray-700 font-medium">
                  {isAdmin ? (
                    <div className="inline-flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handleAdoptionStatusChange(pet._id, "Not Adopted")
                        }
                        className={`px-3 py-1 rounded-full border transition-colors duration-300 font-semibold ${
                          pet.adoptionStatus === "Not Adopted"
                            ? "bg-yellow-400 text-white border-yellow-400"
                            : "bg-white text-yellow-600 border-yellow-600 hover:bg-yellow-100"
                        }`}
                        aria-pressed={pet.adoptionStatus === "Not Adopted"}
                      >
                        Not Adopted
                      </button>
                      <button
                        onClick={() =>
                          handleAdoptionStatusChange(pet._id, "Adopted")
                        }
                        className={`px-3 py-1 rounded-full border transition-colors duration-300 font-semibold ${
                          pet.adoptionStatus === "Adopted"
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-white text-green-600 border-green-600 hover:bg-green-100"
                        }`}
                        aria-pressed={pet.adoptionStatus === "Adopted"}
                      >
                        Adopted
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full font-semibold ${
                        pet.adoptionStatus === "Adopted"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {pet.adoptionStatus}
                    </span>
                  )}
                </td>

                <td className="px-5 py-3 whitespace-nowrap text-gray-600">
                  {pet.addedBy}
                </td>

                {isAdmin && (
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(pet._id)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(pet._id)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllPets;
