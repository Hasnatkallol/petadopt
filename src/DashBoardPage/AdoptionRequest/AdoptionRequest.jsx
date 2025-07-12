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
  const handleAccept = async (_id) => {
    const updateData = {
      isAdopted: true,
    };
    console.log(updateData, _id);

    const res = await axios.patch(
      `http://localhost:5000/adoptPet/${_id}?email=${user.email}`,
      updateData
    );
    console.log("Updated Pet:", res.data);
  };

  return (
    <div>
      <h1>Adoption Requests ({requests.length})</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && requests.length === 0 && <p>No requests found.</p>}

      <div>
        {requests.map((req, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            <h2>Pet Name: {req.name}</h2>
            <p>Status: {req.status}</p>
            {req.petId && (
              <button
                onClick={() => {
                  handleAccept(req.petId);
                }}
              >
                Accept
              </button>
            )}
            {/* Add more fields if needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdoptionRequest;
