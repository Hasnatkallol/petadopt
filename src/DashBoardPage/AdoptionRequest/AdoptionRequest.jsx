import React, { useContext, useEffect, useState } from "react";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import axios from "axios";
import Swal from "sweetalert2";

const AdoptionRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(FirebaseAuthContext);

  useEffect(() => {
    const fetchAdoptionRequests = async () => {
      try {
        const email = user.email;
        const response = await axios.get(
          `http://localhost:5000/requestAdopt?email=${email}`
        );
        setRequests(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch adoption requests.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchAdoptionRequests();
    }
  }, [user?.email]);

  const handleAccept = async (petId, _id) => {
    try {
      const updateData = {
        isAdopted: true,
        id: _id,
      };

      const res = await axios.patch(
        `http://localhost:5000/adoptPet/${petId}?email=${user.email}`,
        updateData
      );
      console.log(res);

      // Update the state to reflect the change
      setRequests(requests.filter((request) => request._id !== _id));

      Swal.fire({
        title: "Success!",
        text: "Adoption request accepted successfully.",
        icon: "success",
        confirmButtonColor: "#4CAF50",
      });
    } catch (error) {
      console.error("Error accepting request:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to accept the adoption request.",
        icon: "error",
        confirmButtonColor: "#f44336",
      });
    }
  };

  const handleReject = async (_id) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/rejectRequest/${_id}?email=${user.email}`
      );
      console.log(res);
      // Update the state to reflect the change
      setRequests(requests.filter((request) => request._id !== _id));

      Swal.fire({
        title: "Success!",
        text: "Adoption request rejected successfully.",
        icon: "success",
        confirmButtonColor: "#4CAF50",
      });
    } catch (error) {
      console.error("Error rejecting request:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to reject the adoption request.",
        icon: "error",
        confirmButtonColor: "#f44336",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl lg:text-3xl text-center font-bold text-gray-800 mb-6">
        Adoption Requests
      </h1>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
          <p>No adoption requests found.</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {requests.map((req, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <h2 className="text-xl text-red-600 font-semibold  mb-2">
                {req?.name} 
              </h2>

              <div className="space-y-2 mb-4">
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      req.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : req.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {req.status}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Requester:</span>{" "}
                  <span className="text-gray-600">{req.userName}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Email:</span>{" "}
                  <span className="text-gray-600">{req.userEmail}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Phone:</span>{" "}
                  <span className="text-gray-600">{req.phone}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Location:</span>{" "}
                  <span className="text-gray-600">{req.address}</span>
                </p>
              </div>

              {req.petId && (
                <div className="flex space-x-3 mt-4">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    onClick={() => handleAccept(req.petId, req._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    onClick={() => handleReject(req._id)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdoptionRequest;
