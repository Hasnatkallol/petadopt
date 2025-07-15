import React, { useContext, useEffect, useState } from "react";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import { useLoaderData } from "react-router";
import { useForm } from "react-hook-form";
import { Select } from "@headlessui/react";
import axios from "axios";
import Swal from "sweetalert2";

const EditMyDonationCompaigns = () => {
  const { user } = useContext(FirebaseAuthContext);
  const pet = useLoaderData();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    if (pet) {
      setValue("petName", pet.petName);
      setImageUrl(pet.petImage); // So that the preview shows
      setValue("maximumDonationAmount", pet.maximumDonationAmount);
      setValue("goal", pet.goal);
      setValue("category", pet.category);
      setValue("lastDonationDate", pet.lastDonationDate.split("T")[0]); // Format to YYYY-MM-DD
      setValue("shortDescription", pet.shortDescription);
      setValue("longDescription", pet.longDescription);
    }
  }, [pet, setValue]);

  const categoryOptions = [
    { value: "Dog", label: "Dog" },
    { value: "Cat", label: "Cat" },
    { value: "Rabbit", label: "Rabbit" },
  ];

  user.email;

  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Upload image to imgbb and store URL in state
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("petImage", {
        type: "manual",
        message: "Please upload a valid image file.",
      });
      return;
    }

    clearErrors("petImage");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const apiKey = import.meta.env.VITE_IMGBBKEY;
      const uploadUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;

      const response = await axios.post(uploadUrl, formData);

      setImageUrl(response.data.data.url);
    } catch (error) {
      setError("petImage", {
        type: "manual",
        message: "Image upload failed. Please try again.",
      });
      console.log(error);
      setImageUrl("");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!imageUrl) {
      setError("petImage", { type: "manual", message: "Image is required" });
      return;
    }
    clearErrors("petImage");

    // Construct your dataset matching your keys
    const updateData = {
      petName: data.petName,
      petImage: imageUrl,
      maximumDonationAmount: Number(data.maximumDonationAmount),
      donatedAmount: 0, // usually starts at 0, or you can add input if you want
      goal: Number(data.goal),
      category: data.category,
      createdAt: new Date().toISOString(), // current timestamp
      lastDonationDate: data.lastDonationDate,
      shortDescription: data.shortDescription,
      longDescription: data.longDescription,

      createdByEmail: user.email,
    };


        try {
      const res = await axios.put(
        `http://localhost:5000/donationPetDb/${pet._id}?email=${user.email}`,
        updateData
      );


      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Updated successfully!",
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Edit Donation Campaign
        </h2>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pet Image
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("petImage")}
            onChange={handleImageUpload}
            className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
              errors.petImage
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-blue-400"
            }`}
          />
          {uploading && (
            <p className="text-blue-600 text-sm mt-1">Uploading image...</p>
          )}
          {errors.petImage && (
            <p className="text-red-500 text-sm mt-1">
              {errors.petImage.message}
            </p>
          )}
          {imageUrl && !errors.petImage && (
            <p className="text-green-600 text-sm mt-1">
              Image uploaded successfully
            </p>
          )}
        </div>

        {/* Pet Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pet Name
          </label>
          <input
            {...register("petName", { required: "Pet name is required" })}
            placeholder="Enter pet name"
            className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
              errors.petName
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-blue-400"
            }`}
          />
          {errors.petName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.petName.message}
            </p>
          )}
        </div>

        {/* Maximum Donation Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Donation Amount
          </label>
          <input
            type="number"
            {...register("maximumDonationAmount", {
              required: "Maximum donation amount is required",
              min: { value: 1, message: "Must be at least 1" },
            })}
            placeholder="Enter max donation amount"
            className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
              errors.maximumDonationAmount
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-blue-400"
            }`}
          />
          {errors.maximumDonationAmount && (
            <p className="text-red-500 text-sm mt-1">
              {errors.maximumDonationAmount.message}
            </p>
          )}
        </div>

        {/* goal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Goal
          </label>
          <input
            type="number"
            {...register("goal", {
              required: "Goal amount is required",
              min: { value: 1, message: "Must be at least 1" },
            })}
            placeholder="Enter goal amount"
            className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
              errors.goal
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-blue-400"
            }`}
          />
          {errors.goal && (
            <p className="text-red-500 text-sm mt-1">{errors.goal.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            defaultValue={pet?.category || ""}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <input
            type="hidden"
            {...register("category", { required: "Category is required" })}
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Last Donation Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Donation Date
          </label>
          <input
            type="date"
            {...register("lastDonationDate", {
              required: "Last donation date is required",
            })}
            className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
              errors.lastDonationDate
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-blue-400"
            }`}
          />
          {errors.lastDonationDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.lastDonationDate.message}
            </p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Description
          </label>
          <input
            {...register("shortDescription", {
              required: "Short description is required",
            })}
            placeholder="Enter short description"
            className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
              errors.shortDescription
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-blue-400"
            }`}
          />
          {errors.shortDescription && (
            <p className="text-red-500 text-sm mt-1">
              {errors.shortDescription.message}
            </p>
          )}
        </div>

        {/* Long Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Long Description
          </label>
          <textarea
            {...register("longDescription", {
              required: "Long description is required",
            })}
            placeholder="Enter long description"
            rows={5}
            className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
              errors.longDescription
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-blue-400"
            }`}
          />
          {errors.longDescription && (
            <p className="text-red-500 text-sm mt-1">
              {errors.longDescription.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          disabled={uploading}
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditMyDonationCompaigns;
