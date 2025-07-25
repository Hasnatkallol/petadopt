import React, { useContext, useEffect, useState } from "react";
import { FirebaseAuthContext } from "../../../Firebase/FirebaseAuthContext";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import {
  FiSun,
  FiMoon,
  FiUser,
  FiUserCheck,
  FiRefreshCw,
} from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

const Users = () => {
  const { user, theme,  } = useContext(FirebaseAuthContext);
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const themeStyles = {
    light: {
      bg: "bg-gray-50",
      text: "text-gray-800",
      card: "bg-white border border-gray-200",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      secondaryText: "text-gray-600",
      accent: "text-blue-600",
      tableHeader: "bg-gray-100 text-gray-700",
      tableRow: "hover:bg-gray-50",
      adminBadge: "bg-green-100 text-green-800",
      userBadge: "bg-blue-100 text-blue-800",
      actionButton: "bg-blue-500 hover:bg-blue-600 text-white",
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      card: "bg-gray-800 border-gray-700",
      button: "bg-blue-500 hover:bg-blue-600 text-white",
      secondaryText: "text-gray-300",
      accent: "text-blue-400",
      tableHeader: "bg-gray-700 text-gray-100",
      tableRow: "hover:bg-gray-700",
      adminBadge: "bg-green-900 text-green-200",
      userBadge: "bg-blue-900 text-blue-200",
      actionButton: "bg-blue-600 hover:bg-blue-700 text-white",
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get(`/users?email=${user?.email}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAdmin = async (id) => {
    try {
      setUpdatingId(id);
      await axiosSecure.patch(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to make admin:", error);
    } finally {
      setUpdatingId(null);
    }
  };
         useEffect(() => {
        document.title = "Users";
      }, []);

  return (
    <div
      className={`min-h-screen p-4 md:p-6 ${currentTheme.bg} ${currentTheme.text} transition-colors duration-300`}
    >
      <div
        className={`max-w-6xl mx-auto ${currentTheme.card} rounded-xl shadow-md p-4 md:p-6 transition-all duration-300`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1
              className={`text-2xl md:text-3xl font-bold ${currentTheme.accent}`}
            >
              User Management
            </h1>
            <p className={`text-sm ${currentTheme.secondaryText}`}>
              Total {users.length} registered users
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ImSpinner8 className="animate-spin text-4xl text-blue-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className={`${currentTheme.tableHeader}`}>
                  <th className="p-3 text-left rounded-tl-lg">#</th>
                  <th className="p-3 text-left">Profile</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left hidden md:table-cell">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((person, index) => (
                  <tr
                    key={person._id}
                    className={`border-t ${currentTheme.tableRow} transition-colors`}
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <img
                          src={
                            person.image || "https://via.placeholder.com/150"
                          }
                          alt={person.name}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-3 font-medium">{person.name}</td>
                    <td className="p-3 hidden md:table-cell">{person.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          person.role === "admin"
                            ? currentTheme.adminBadge
                            : currentTheme.userBadge
                        }`}
                      >
                        {person.role === "admin" ? (
                          <span className="flex items-center gap-1">
                            <FiUserCheck /> Admin
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <FiUser /> User
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="p-3">
                      {person.role !== "admin" ? (
                        <button
                          onClick={() => handleMakeAdmin(person._id)}
                          disabled={updatingId === person._id}
                          className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
                            updatingId === person._id
                              ? "bg-gray-400 cursor-not-allowed"
                              : currentTheme.actionButton
                          } transition-colors`}
                        >
                          {updatingId === person._id ? (
                            <>
                              <ImSpinner8 className="animate-spin" />{" "}
                              Processing...
                            </>
                          ) : (
                            "Make Admin"
                          )}
                        </button>
                      ) : (
                        <span className="text-sm italic text-gray-400">
                          Admin privileges
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
