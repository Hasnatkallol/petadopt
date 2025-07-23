import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const MyAddedPet = () => {
  const { user, theme } = useContext(FirebaseAuthContext);
  const [myPets, setMyPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errmsg, setErrmsg] = useState("");
  const [sorting, setSorting] = useState([]);
  const axiosSecure = useAxiosSecure();

  const themeStyles = {
    light: {
      bg: "bg-gray-50",
      text: "text-gray-800",
      card: "bg-white shadow-lg",
      button: "bg-blue-600 hover:bg-blue-700",
      secondaryText: "text-gray-600",
      accent: "text-blue-600",
      tableHeader: "bg-gray-100",
      tableRow: "hover:bg-gray-50",
      tableCell: "text-gray-700",
      error: "bg-red-100 text-red-700",
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      card: "bg-gray-800 shadow-lg",
      button: "bg-blue-500 hover:bg-blue-600",
      secondaryText: "text-gray-300",
      accent: "text-blue-400",
      tableHeader: "bg-gray-700",
      tableRow: "hover:bg-gray-700",
      tableCell: "text-gray-300",
      error: "bg-red-900 text-red-100",
      success: "bg-green-900 text-green-100",
      warning: "bg-yellow-900 text-yellow-100",
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  const fetchPets = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setErrmsg("");
    try {
      const res = await axiosSecure.get(`/adoptPet?email=${user.email}`);
      setMyPets(res.data?.pets || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setErrmsg(err.response?.data?.message || "Failed to fetch pets");
      setMyPets([]);
    } finally {
      setLoading(false);
    }
  }, [user, axiosSecure]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleDelete = useCallback(
    async (_id) => {
      setErrmsg("");
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        background: currentTheme.card.includes("gray-800")
          ? "#1f2937"
          : "#ffffff",
        color: currentTheme.text.includes("gray-100") ? "#f3f4f6" : "#1f2937",
      });

      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(
            `/adoptPet/${_id}?email=${user.email}`
          );
          if (res.data.deletedCount) {
            Swal.fire({
              title: "Deleted!",
              text: "Deleted successfully.",
              icon: "success",
              background: currentTheme.card.includes("gray-800")
                ? "#1f2937"
                : "#ffffff",
              color: currentTheme.text.includes("gray-100")
                ? "#f3f4f6"
                : "#1f2937",
            });
            setMyPets((prev) => prev.filter((pet) => pet._id !== _id));
          }
        } catch (error) {
          console.error("Delete error:", error);
          setErrmsg(error.response?.data?.message || "Failed to delete");
        }
      }
    },
    [axiosSecure, user?.email, currentTheme]
  );

  const handleAdopt = useCallback(
    async (_id) => {
      try {
        const res = await axiosSecure.patch(
          `/adoptPet/${_id}?email=${user.email}`,
          { isAdopted: true }
        );

        if (res.data.modifiedCount > 0) {
          setMyPets((prev) =>
            prev.map((pet) =>
              pet._id === _id ? { ...pet, isAdopted: true } : pet
            )
          );
          Swal.fire({
            icon: "success",
            title: "Updated adopted status successfully!",
            timer: 1500,
            showConfirmButton: false,
            position: "top-end",
            background: currentTheme.card.includes("gray-800")
              ? "#1f2937"
              : "#ffffff",
            color: currentTheme.text.includes("gray-100")
              ? "#f3f4f6"
              : "#1f2937",
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong while updating.",
          background: currentTheme.card.includes("gray-800")
            ? "#1f2937"
            : "#ffffff",
          color: currentTheme.text.includes("gray-100") ? "#f3f4f6" : "#1f2937",
        });
      }
    },
    [axiosSecure, user?.email, currentTheme]
  );

  const columns = useMemo(
    () => [
      {
        header: "S/N",
        accessorFn: (row, index) => index + 1,
        id: "sn",
        size: 60,
      },
      {
        header: "Name",
        accessorKey: "name",
        size: 120,
      },
      {
        header: "Category",
        accessorKey: "category",
        size: 120,
      },
      {
        header: "Image",
        accessorKey: "image",
        cell: ({ getValue }) => (
          <img
            src={getValue()}
            alt="pet"
            className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover"
          />
        ),
        size: 100,
      },
      {
        header: "Status",
        accessorKey: "isAdopted",
        cell: ({ getValue }) => (
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${
              getValue()
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
            }`}
          >
            {getValue() ? "Adopted" : "Not Adopted"}
          </span>
        ),
        size: 100,
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex flex-col sm:flex-row gap-2">
            <Link to={`/dashboard/update/${row.original._id}`}>
              <button
                className={`px-2 py-1 text-xs sm:text-sm ${currentTheme.button} text-white rounded-md transition duration-200 w-full sm:w-auto`}
              >
                Update
              </button>
            </Link>
            <button
              onClick={() => handleDelete(row.original._id)}
              className="px-2 py-1 text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white rounded w-full sm:w-auto"
            >
              Delete
            </button>
            <button
              onClick={() => handleAdopt(row.original._id)}
              disabled={row.original.isAdopted}
              className={`px-2 py-1 text-xs sm:text-sm rounded-md transition duration-200 w-full sm:w-auto ${
                row.original.isAdopted
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {row.original.isAdopted ? "Adopted" : "Adopt"}
            </button>
          </div>
        ),
        size: 180,
      },
    ],
    [handleDelete, handleAdopt, currentTheme.button]
  );

  const table = useReactTable({
    data: myPets,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) {
    return (
      <div
        className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} flex items-center justify-center`}
      >
        <div className="animate-spin rounded-full h-12 w-12  border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} p-4 max-w-7xl mx-auto`}
    >
      <div className={`rounded-xl p-4 ${currentTheme.card}`}>
        <h1 className="text-xl font-bold mb-4 flex items-center justify-between gap-2">
          <span>My Added Pets</span>
          <span
            className={`px-3 py-1 text-sm ${currentTheme.accent} ${
              currentTheme.card.includes("gray-800")
                ? "bg-gray-700"
                : "bg-indigo-100"
            } rounded-full`}
          >
            {myPets.length}
          </span>
        </h1>

        {errmsg && (
          <div className={`mb-4 p-3 rounded-md text-sm ${currentTheme.error}`}>
            {errmsg}
          </div>
        )}

        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead className={`${currentTheme.tableHeader}`}>
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                      style={{ width: `${header.getSize()}px` }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody
              className={`divide-y ${
                currentTheme.card.includes("gray-800")
                  ? "divide-gray-700"
                  : "divide-gray-200"
              }`}
            >
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className={`${currentTheme.tableRow}`}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`px-2 py-3 align-middle whitespace-nowrap ${currentTheme.tableCell}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {myPets.length > 10 && (
          <div className="mt-6 flex flex-wrap justify-end items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={`px-4 py-1.5 rounded-md text-sm font-medium ${
                currentTheme.text
              } ${
                currentTheme.card.includes("gray-800")
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white hover:bg-gray-100"
              } disabled:opacity-50`}
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={`px-4 py-1.5 rounded-md text-sm font-medium ${
                currentTheme.text
              } ${
                currentTheme.card.includes("gray-800")
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white hover:bg-gray-100"
              } disabled:opacity-50`}
            >
              Next
            </button>
          </div>
        )}

        {myPets.length === 0 && !loading && (
          <div
            className={`mt-8 text-center py-12 ${currentTheme.secondaryText}`}
          >
            <p className="text-lg">
              No pets found. Add some pets to see them here.
            </p>
            <Link
              to="/dashboard/addPet"
              className={`mt-4 inline-block px-4 py-2 ${currentTheme.button} text-white rounded-md`}
            >
              Add New Pet
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAddedPet;