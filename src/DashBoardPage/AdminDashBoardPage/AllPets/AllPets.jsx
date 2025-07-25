import React, { useEffect, useState, useContext } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FirebaseAuthContext } from "../../../Firebase/FirebaseAuthContext";
import useAdmin from "../../../Hooks/useAdmin";
import Loading from "../../../Shared/Loading";

const AllPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const { user, theme } = useContext(FirebaseAuthContext);
  const navigate = useNavigate();
  const [isAdmin] = useAdmin();
  useEffect(() => {
    document.title = "All Pets";
  }, []);

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

  const handleAdopted = async (petId) => {
    try {
      const res = await axiosSecure.patch(`/isAdoptedTrue/${petId}`);
      if (res.data.modifiedCount > 0) {
        setPets(
          pets.map((pet) =>
            pet._id === petId ? { ...pet, adoptionStatus: "Adopted" } : pet
          )
        );
        Swal.fire("Success!", "Pet status updated to Adopted.", "success");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Failed to update adoption status.", "error");
    }
  };

  const handleAdoptFalse = async (petId) => {
    try {
      const res = await axiosSecure.patch(`/isAdoptedFalse/${petId}`);
      if (res.data.modifiedCount > 0) {
        setPets(
          pets.map((pet) =>
            pet._id === petId ? { ...pet, adoptionStatus: "Not Adopted" } : pet
          )
        );
        Swal.fire("Success!", "Pet status updated to Not Adopted.", "success");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Failed to update adoption status.", "error");
    }
  };
  if (loading) return <Loading />;

  return (
    <div
      className={`p-4 md:p-6 max-w-[95vw] mx-auto ${currentTheme.bg} ${currentTheme.text} min-h-screen`}
    >
      <h2
        className={`text-2xl md:text-3xl font-extrabold mb-6 md:mb-8 text-center ${
          theme === "light" ? "text-indigo-700" : "text-indigo-400"
        } tracking-wide`}
      >
        All Added Pets
      </h2>

      <div
        className={`overflow-x-auto shadow-lg rounded-lg border ${currentTheme.card} ${currentTheme.border}`}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead
            className={`${theme === "light" ? "bg-indigo-100" : "bg-gray-700"}`}
          >
            <tr>
              <th className="px-3 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                Image
              </th>
              <th className="px-3 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                Age
              </th>
              <th className="px-3 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider hidden sm:table-cell">
                Breed
              </th>
              <th className="px-3 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider hidden md:table-cell">
                Category
              </th>
              <th className="px-3 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider hidden md:table-cell">
                Gender
              </th>
              <th className="px-3 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider hidden lg:table-cell">
                Location
              </th>
              <th className="px-3 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                Vaccinated
              </th>
              <th className="px-3 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider hidden lg:table-cell">
                Added By
              </th>
              {isAdmin && (
                <th className="px-3 py-3 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody
            className={`divide-y ${
              theme === "light" ? "divide-gray-200" : "divide-gray-700"
            }`}
          >
            {pets.map((pet) => (
              <tr
                key={pet._id}
                className={`${
                  theme === "light" ? "hover:bg-indigo-50" : "hover:bg-gray-700"
                } transition-colors duration-200`}
              >
                <td className="px-3 py-4 whitespace-nowrap">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg border shadow-sm"
                  />
                </td>
                <td className="px-3 py-4 whitespace-nowrap font-semibold">
                  {pet.name}
                </td>
                <td className="px-3 py-4 whitespace-nowrap">{pet.age}</td>
                <td className="px-3 py-4 whitespace-nowrap hidden sm:table-cell">
                  {pet.breed}
                </td>
                <td className="px-3 py-4 whitespace-nowrap hidden md:table-cell">
                  {pet.category}
                </td>
                <td className="px-3 py-4 whitespace-nowrap hidden md:table-cell">
                  {pet.gender}
                </td>
                <td className="px-3 py-4 whitespace-nowrap hidden lg:table-cell">
                  {pet.location}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-center">
                  {pet.vaccinated ? (
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        theme === "light"
                          ? "text-green-700 bg-green-100"
                          : "text-green-300 bg-green-900"
                      }`}
                    >
                      Yes
                    </span>
                  ) : (
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        theme === "light"
                          ? "text-red-700 bg-red-100"
                          : "text-red-300 bg-red-900"
                      }`}
                    >
                      No
                    </span>
                  )}
                </td>

                <td className="px-3 py-4 whitespace-nowrap font-medium">
                  {isAdmin ? (
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                      <button
                        onClick={() => handleAdoptFalse(pet._id)}
                        className={`px-2 py-1 text-xs md:text-sm rounded-full border transition-colors duration-300 font-semibold ${
                          pet.adoptionStatus === "Not Adopted"
                            ? theme === "light"
                              ? "bg-yellow-400 text-white border-yellow-400"
                              : "bg-yellow-600 text-white border-yellow-600"
                            : theme === "light"
                            ? "bg-white text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                            : "bg-gray-700 text-yellow-400 border-yellow-400 hover:bg-gray-600"
                        }`}
                      >
                        Not Adopted
                      </button>
                      <button
                        onClick={() => handleAdopted(pet._id)}
                        className={`px-2 py-1 text-xs md:text-sm rounded-full border transition-colors duration-300 font-semibold ${
                          pet.adoptionStatus === "Adopted"
                            ? theme === "light"
                              ? "bg-green-500 text-white border-green-500"
                              : "bg-green-600 text-white border-green-600"
                            : theme === "light"
                            ? "bg-white text-green-600 border-green-600 hover:bg-green-50"
                            : "bg-gray-700 text-green-400 border-green-400 hover:bg-gray-600"
                        }`}
                      >
                        Adopted
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`px-2 py-1 text-xs md:text-sm rounded-full font-semibold ${
                        pet.adoptionStatus === "Adopted"
                          ? theme === "light"
                            ? "bg-green-100 text-green-700"
                            : "bg-green-900 text-green-300"
                          : theme === "light"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-yellow-900 text-yellow-300"
                      }`}
                    >
                      {pet.adoptionStatus}
                    </span>
                  )}
                </td>

                <td className="px-3 py-4 whitespace-nowrap hidden lg:table-cell">
                  {pet.addedBy}
                </td>

                {isAdmin && (
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex flex-col md:flex-row gap-1 md:gap-2">
                      <button
                        onClick={() => handleUpdate(pet._id)}
                        className={`px-2 py-1 text-xs md:text-sm rounded ${
                          theme === "light"
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(pet._id)}
                        className={`px-2 py-1 text-xs md:text-sm rounded ${
                          theme === "light"
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
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
