import React, { useContext, useEffect, useState } from "react";
import { FirebaseAuthContext } from "../../../Firebase/FirebaseAuthContext";
import axios from "axios";

const Users = () => {
  const { user } = useContext(FirebaseAuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleMakeAdmin = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/users/${id}`);
      fetchUsers(); // Refresh list after update
    } catch (error) {
      console.error("Failed to make admin:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users ({users.length})</h1>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Profile</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((person, index) => (
            <tr key={person._id}>
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2 text-center">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-12 h-12 rounded-full mx-auto"
                />
              </td>
              <td className="border p-2">{person.name}</td>
              <td className="border p-2">{person.email}</td>
              <td className="border p-2 text-center">{person.role || "user"}</td>
              <td className="border p-2 text-center">
                {person.role !== "admin" ? (
                  <button
                    onClick={() => handleMakeAdmin(person._id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Make Admin
                  </button>
                ) : (
                  <span className="text-green-600 font-semibold">Admin</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
