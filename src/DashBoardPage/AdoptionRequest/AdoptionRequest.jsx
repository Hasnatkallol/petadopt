import React, { useContext, useEffect, useState } from "react";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import Swal from "sweetalert2";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const AdoptionRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, theme } = useContext(FirebaseAuthContext);
  const axiosPublic = useAxiosPublic();

  const themeStyles = {
    light: {
      bg: "bg-gray-50",
      text: "text-gray-800",
      card: "bg-white border border-gray-200",
      button: {
        accept: "bg-green-600 hover:bg-green-700",
        reject: "bg-red-600 hover:bg-red-700",
      },
      status: {
        pending: "bg-yellow-100 text-yellow-800",
        approved: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
      },
      alert: {
        error: "bg-red-100 border-red-500 text-red-700",
        info: "bg-blue-100 border-blue-500 text-blue-700",
      },
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      card: "bg-gray-800 border-gray-700",
      button: {
        accept: "bg-green-700 hover:bg-green-600",
        reject: "bg-red-700 hover:bg-red-600",
      },
      status: {
        pending: "bg-yellow-900 text-yellow-200",
        approved: "bg-green-900 text-green-200",
        rejected: "bg-red-900 text-red-200",
      },
      alert: {
        error: "bg-red-900 border-red-700 text-red-200",
        info: "bg-blue-900 border-blue-700 text-blue-200",
      },
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  useEffect(() => {
    const fetchAdoptionRequests = async () => {
      try {
        const email = user.email;
        const response = await axiosPublic.get(
          `/requestAdopt?email=${email}`
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

      const res = await axiosPublic.patch(
        `/adoptPet/${petId}?email=${user.email}`,
        updateData
      );
      console.log(res);

      setRequests(requests.filter((request) => request._id !== _id));

      Swal.fire({
        title: "Success!",
        text: "Adoption request accepted successfully.",
        icon: "success",
        confirmButtonColor: "#4CAF50",
        background: theme === 'dark' ? '#1f2937' : '#ffffff',
        color: theme === 'dark' ? '#f3f4f6' : '#111827',
      });
    } catch (error) {
      console.error("Error accepting request:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to accept the adoption request.",
        icon: "error",
        confirmButtonColor: "#f44336",
        background: theme === 'dark' ? '#1f2937' : '#ffffff',
        color: theme === 'dark' ? '#f3f4f6' : '#111827',
      });
    }
  };

  const handleReject = async (_id) => {
    try {
      const res = await axiosPublic.patch(
        `/rejectRequest/${_id}?email=${user.email}`
      );
      console.log(res);
      setRequests(requests.filter((request) => request._id !== _id));

      Swal.fire({
        title: "Success!",
        text: "Adoption request rejected successfully.",
        icon: "success",
        confirmButtonColor: "#4CAF50",
        background: theme === 'dark' ? '#1f2937' : '#ffffff',
        color: theme === 'dark' ? '#f3f4f6' : '#111827',
      });
    } catch (error) {
      console.error("Error rejecting request:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to reject the adoption request.",
        icon: "error",
        confirmButtonColor: "#f44336",
        background: theme === 'dark' ? '#1f2937' : '#ffffff',
        color: theme === 'dark' ? '#f3f4f6' : '#111827',
      });
    }
  };
        useEffect(() => {
      document.title = "Adoption Request";
    }, []);

  return (
    <div className={`min-h-screen py-8 ${currentTheme.bg} ${currentTheme.text}`}>
      <div className="container mx-auto px-4">
        <h1 className={`text-2xl lg:text-3xl text-center font-bold mb-6 ${currentTheme.text}`}>
          Adoption Requests
        </h1>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
              theme === 'dark' ? 'border-blue-400' : 'border-blue-500'
            }`}></div>
          </div>
        )}

        {error && (
          <div
            className={`border-l-4 p-4 mb-6 ${currentTheme.alert.error}`}
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className={`border-l-4 p-4 mb-6 ${currentTheme.alert.info}`}>
            <p>No adoption requests found.</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((req, index) => (
            <div
              key={index}
              className={`rounded-lg shadow-md overflow-hidden border hover:shadow-lg transition-shadow duration-300 ${currentTheme.card}`}
            >
              <div className="p-6">
                <h2 className={`text-xl font-semibold mb-2 ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-600'
                }`}>
                  {req?.name}
                </h2>

                <div className="space-y-2 mb-4">
                  <p className="text-sm">
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Status:</span>{" "}
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        req.status === "pending"
                          ? currentTheme.status.pending
                          : req.status === "approved"
                          ? currentTheme.status.approved
                          : currentTheme.status.rejected
                      }`}
                    >
                      {req.status}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Requester:</span>{" "}
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {req.userName}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Email:</span>{" "}
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {req.userEmail}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Phone:</span>{" "}
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {req.phone}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Location:</span>{" "}
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {req.address}
                    </span>
                  </p>
                </div>

                {req.petId && (
                  <div className="flex space-x-3 mt-4">
                    <button
                      className={`text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        currentTheme.button.accept
                      } ${theme === 'dark' ? 'focus:ring-green-500' : 'focus:ring-green-300'}`}
                      onClick={() => handleAccept(req.petId, req._id)}
                    >
                      Accept
                    </button>
                    <button
                      className={`text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        currentTheme.button.reject
                      } ${theme === 'dark' ? 'focus:ring-red-500' : 'focus:ring-red-300'}`}
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
    </div>
  );
};

export default AdoptionRequest;