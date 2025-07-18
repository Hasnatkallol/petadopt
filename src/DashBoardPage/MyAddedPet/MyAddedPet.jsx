import React, { useContext, useEffect, useMemo, useState } from "react";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import Swal from "sweetalert2";
import { Link } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const MyAddedPet = () => {
  const { user } = useContext(FirebaseAuthContext);
  const [myPets, setMyPets] = useState([]);
  const [errmsg, setErrmsg] = useState("");
  const [sorting, setSorting] = useState([]);
  const axiosSecure = useAxiosSecure()

  useEffect(() => {
    if (!user) return;
    setErrmsg("");
    axiosSecure
      .get(`/adoptPet?email=${user.email}`)
      .then((res) => setMyPets(res.data))
      .catch((err) => {
        console.error("Fetch error:", err);
        setErrmsg(err.response?.data?.message || "Something went wrong");
      });
  }, [user,axiosSecure]);

  const handleDelete = (_id) => {
    setErrmsg("");
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/adoptPet/${_id}?email=${user.email}`)
          .then((res) => {
            if (res.data.deletedCount) {
              Swal.fire("Deleted!", "Deleted successfully.", "success");
              const remaining = myPets.filter((pet) => pet._id !== _id);
              setMyPets(remaining);
            }
          })
          .catch((error) => {
            console.error("Delete error:", error);
            setErrmsg(error.response?.data?.message || "Failed to delete");
          });
      }
    });
  };

  const handleAdopt = async (_id) => {
    const updateData = {
      isAdopted: true,
    };

    try {
      const res = await axiosSecure.patch(
        `/adoptPet/${_id}?email=${user.email}`,
        updateData
      );

      if (res.data.modifiedCount > 0) {
        // Update myPets state to reflect adoption immediately
        setMyPets((prevPets) =>
          prevPets.map((pet) =>
            pet._id === _id ? { ...pet, isAdopted: true } : pet
          )
        );

        Swal.fire({
          icon: "success",
          title: "Updated adopted status true successfully!",
          timer: 1500,
          showConfirmButton: false,
          position: "top-end",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update failed!",
          text: "No changes were made.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while updating.",
      });
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "S/N",
        accessorFn: (row, index) => index + 1,
        id: "sn",
      },
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Category",
        accessorKey: "category",
      },
      {
        header: "Image",
        accessorKey: "image",
        cell: ({ getValue }) => (
          <img
            src={getValue()}
            alt="pet"
            className="w-16 h-16 rounded-lg object-cover border"
          />
        ),
      },
      {
        header: "Adoption Status",
        accessorKey: "isAdopted",
        cell: ({ getValue }) => (
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${
              getValue()
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {getValue() ? "Adopted" : "Not Adopted"}
          </span>
        ),
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <>
            <Link to={`/dashboard/update/${row.original._id}`}>
              <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition duration-200 shadow-sm">
                Update
              </button>
            </Link>
            <button
              onClick={() => handleDelete(row.original._id)}
              className="px-3 py-1 bg-red-500 mx-1 hover:bg-red-600 text-white rounded text-sm"
            >
              Delete
            </button>
            <button
              onClick={() => handleAdopt(row.original._id)}
              disabled={row.original.isAdopted}
              className={`px-3 py-1 rounded-md text-sm transition duration-200 shadow-sm ${
                row.original.isAdopted
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {row.original.isAdopted ? "Adopted" : "Adopt"}
            </button>
          </>
        ),
      },
    ],
    [myPets]
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

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 flex items-center justify-between flex-wrap gap-2">
          <span>My Added Pets</span>
          <span className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full">
            {myPets.length}
          </span>
        </h1>

        {errmsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {errmsg}
          </div>
        )}

        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 ">
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 sm:px-6 py-3  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
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
            <tbody className="bg-white divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50  ">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 sm:px-6 py-4 text-gray-700  align-middle whitespace-nowrap"
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
          <div className="mt-6 flex flex-col sm:flex-row justify-end items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-1.5 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-1.5 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAddedPet;
