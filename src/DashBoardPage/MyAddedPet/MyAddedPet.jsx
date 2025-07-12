import React, { useContext, useEffect, useMemo, useState } from "react";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

const MyAddedPet = () => {
  const { user } = useContext(FirebaseAuthContext);
  const [myPets, setMyPets] = useState([]);
  const [errmsg, setErrmsg] = useState("");
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    setErrmsg("");
    if (!user) return;
    const email = user.email;

    axios
      .get(`http://localhost:5000/adoptPet?email=${email}`)
      .then((response) => {
        setMyPets(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch pets:", error);
        setErrmsg(error.response?.data?.message || "Something went wrong");
      });
  }, [user]);

  const columns = useMemo(
    () => [
      {
        header: "S/N",
        accessorFn: (row, index) => index + 1,
        id: "sn",
      },
      {
        header: "Pet Name",
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
            className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
          />
        ),
      },
      {
        header: "Adoption Status",
        accessorKey: "isAdopted",
        cell: ({ getValue }) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
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
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition duration-200 shadow-sm">
              Update
            </button>
            <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition duration-200 shadow-sm">
              Delete
            </button>
            <button className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm transition duration-200 shadow-sm">
              Adopted
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: myPets,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            My Added Pets
            <span className="ml-2 bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
              {myPets.length}
            </span>
          </h1>
        </div>

        {errmsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {errmsg}
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                    >
                      <div className="flex items-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc" ? (
                          <svg
                            className="ml-1 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        ) : header.column.getIsSorted() === "desc" ? (
                          <svg
                            className="ml-1 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
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

        {/* Pagination */}
        {myPets.length > 10 && (
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="text-sm text-gray-600">
              Showing page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                First
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAddedPet;


  