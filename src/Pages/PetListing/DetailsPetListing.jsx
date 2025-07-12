import React, { useContext, useState } from "react";
import { useLoaderData, useLocation, useNavigate, useParams } from "react-router";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import axios from "axios";
import Swal from "sweetalert2";

const DetailsPetListing = () => {
  const {
    _id,
    name,
    age,
    image,
    location,
    breed,
    gender,
    vaccinated,
    adoptionStatus,
    longDescription, 
    addedBy
  } = useLoaderData();

  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(FirebaseAuthContext);
  const navigate = useNavigate();
  const Pathlocation = useLocation();
  const { id } = useParams();
  console.log(id);

  const handleAdoptClick = () => {
    if (!user) {
      navigate('/login', { state: { from: Pathlocation.pathname }, replace: true });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneNumber = e.target.phone.value;
    const address = e.target.address.value;
    const data = {
      petId: _id,
      name: name,
      image: image,
      userName: user.displayName,
      userEmail: user.email,
      phone: phoneNumber,
      address: address,
      addedBy: addedBy
    };
    console.log(data);
    try {
      const response = await axios.post("http://localhost:5000/requestAdopt", data);

      Swal.fire({
        icon: 'success',
        title: 'Request Submitted!',
        text: 'We will contact you soon about the adoption.',
        confirmButtonColor: '#6366f1',
      });

      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error submitting adoption request:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong while submitting your request.',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  return (
    <div className="min-h-50 flex flex-col gap-10 lg:gap-0 md:flex-row items-center justify-center bg-gray-50 px-4 py-10">
      {/* Image Section */}
      <div className="w-full md:w-1/2 mb-8 md:mb-0">
        <img
          src={image}
          alt={name}
          className="rounded-xl shadow-lg w-full max-w-md mx-auto"
        />
      </div>

      {/* Details Section */}
      <div className="w-full md:w-1/2 max-w-xl space-y-6 text-gray-800">
        <h1 className="text-4xl font-bold">
          Meet{" "}
          <span className="text-orange-500 underline underline-offset-4">
            {name}
          </span>
        </h1>

        <div className="grid grid-cols-2 gap-y-3 text-base">
          <p>
            <span className="font-semibold">Gender:</span> {gender}
          </p>
          <p>
            <span className="font-semibold">Breed:</span> {breed}
          </p>
          <p>
            <span className="font-semibold">Age:</span> {age}
          </p>
          <p>
            <span className="font-semibold">Vaccinated:</span>{" "}
            {vaccinated ? "Yes" : "No"}
          </p>
          <p>
            <span className="font-semibold">Location:</span> {location}
          </p>
          <p>
            <span className="font-semibold">Status:</span> {adoptionStatus}
          </p>
        </div>

        <p className="text-gray-600 leading-relaxed">{longDescription}</p>

        <button
          onClick={handleAdoptClick}
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition duration-300"
        >
          Adopt→
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="relative flex flex-col items-center max-w-lg w-full gap-4 p-6 rounded-md shadow-md sm:py-8 sm:px-12 bg-white text-gray-800">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                fill="currentColor"
                className="w-6 h-6"
              >
                <polygon points="427.314 107.313 404.686 84.687 256 233.373 107.314 84.687 84.686 107.313 233.373 256 84.686 404.687 107.314 427.313 256 278.627 404.686 427.313 427.314 404.687 278.627 256 427.314 107.313"></polygon>
              </svg>
            </button>

            <img
              src={image}
              alt={name}
              className="w-32 h-32 object-cover rounded-full border"
            />

            <h2 className="text-2xl font-semibold text-center">
              Confirm Your Interest in Adopting {name}
            </h2>

            <div className="text-sm text-gray-500 mb-2">Pet ID: {_id}</div>

            <form
              className="w-full flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={user.displayName}
                  disabled
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-100 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-100 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  required
                  name="address"
                  className="w-full px-3 py-2 mt-1 border rounded-md"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 mt-4 font-semibold text-white bg-violet-600 rounded-md hover:bg-violet-700"
              >
                Submit Adoption Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsPetListing;
