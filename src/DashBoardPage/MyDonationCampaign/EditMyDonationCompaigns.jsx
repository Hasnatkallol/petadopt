import React, { useContext, useEffect, useState } from "react";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import { useLoaderData } from "react-router";
import { useForm } from "react-hook-form";
import { Select } from "@headlessui/react";
import axios from "axios";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const EditMyDonationCompaigns = () => {
  const { user, theme } = useContext(FirebaseAuthContext);
  const pet = useLoaderData();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();
  
  const themeStyles = {
    light: {
      bg: "bg-gray-50",
      text: "text-gray-800",
      card: "bg-white border border-gray-200",
      input: "bg-white border-gray-300 focus:ring-blue-400 focus:border-blue-400",
      errorBorder: "border-red-500 focus:ring-red-400",
      button: "bg-blue-600 hover:bg-blue-700",
      uploadText: "text-blue-600",
      successText: "text-green-600",
      errorText: "text-red-500",
      label: "text-gray-700"
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      card: "bg-gray-800 border-gray-700",
      input: "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500",
      errorBorder: "border-red-500 focus:ring-red-500",
      button: "bg-blue-700 hover:bg-blue-600",
      uploadText: "text-blue-400",
      successText: "text-green-400",
      errorText: "text-red-400",
      label: "text-gray-300"
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  useEffect(() => {
    if (pet) {
      setValue("petName", pet.petName);
      setImageUrl(pet.petImage);
      setValue("maximumDonationAmount", pet.maximumDonationAmount);
      setValue("goal", pet.goal);
      setValue("category", pet.category);
      setValue("lastDonationDate", pet.lastDonationDate.split("T")[0]);
      setValue("shortDescription", pet.shortDescription);
      setValue("longDescription", pet.longDescription);
    }
  }, [pet, setValue]);

  const categoryOptions = [
    { value: "Dog", label: "Dog" },
    { value: "Cat", label: "Cat" },
    { value: "Rabbit", label: "Rabbit" },
  ];

  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const axiosSecure = useAxiosSecure();

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

    const updateData = {
      petName: data.petName,
      petImage: imageUrl,
      maximumDonationAmount: Number(data.maximumDonationAmount),
      donatedAmount: 0,
      goal: Number(data.goal),
      category: data.category,
      createdAt: new Date().toISOString(),
      lastDonationDate: data.lastDonationDate,
      shortDescription: data.shortDescription,
      longDescription: data.longDescription,
      createdByEmail: user.email,
    };

    try {
      const res = await axiosSecure.put(
        `/donationPetDb/${pet._id}?email=${user.email}`,
        updateData
      );

      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Updated successfully!",
          timer: 1500,
          showConfirmButton: false,
          position: "top-end",
          background: theme === 'dark' ? '#1f2937' : '#ffffff',
          color: theme === 'dark' ? '#f3f4f6' : '#111827',
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update failed!",
          text: "No changes were made.",
          background: theme === 'dark' ? '#1f2937' : '#ffffff',
          color: theme === 'dark' ? '#f3f4f6' : '#111827',
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while updating.",
        background: theme === 'dark' ? '#1f2937' : '#ffffff',
        color: theme === 'dark' ? '#f3f4f6' : '#111827',
      });
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${currentTheme.bg} ${currentTheme.text}`}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${currentTheme.card} p-6 md:p-8 rounded-2xl shadow-md w-full max-w-2xl space-y-6`}
      >
        <h2 className={`text-2xl font-bold text-center ${
          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
        }`}>
          Edit Donation Campaign
        </h2>

        {/* Image Upload */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${currentTheme.label}`}>
            Pet Image
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("petImage")}
            onChange={handleImageUpload}
            className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
              errors.petImage ? currentTheme.errorBorder : currentTheme.input
            }`}
          />
          {uploading && (
            <p className={`text-sm mt-1 ${currentTheme.uploadText}`}>Uploading image...</p>
          )}
          {errors.petImage && (
            <p className={`text-sm mt-1 ${currentTheme.errorText}`}>
              {errors.petImage.message}
            </p>
          )}
          {imageUrl && !errors.petImage && (
            <p className={`text-sm mt-1 ${currentTheme.successText}`}>
              Image uploaded successfully
            </p>
          )}
        </div>

        {/* Pet Name */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${currentTheme.label}`}>
            Pet Name
          </label>
          <input
            {...register("petName", { required: "Pet name is required" })}
            placeholder="Enter pet name"
            className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
              errors.petName ? currentTheme.errorBorder : currentTheme.input
            }`}
          />
          {errors.petName && (
            <p className={`text-sm mt-1 ${currentTheme.errorText}`}>
              {errors.petName.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Maximum Donation Amount */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${currentTheme.label}`}>
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
                errors.maximumDonationAmount ? currentTheme.errorBorder : currentTheme.input
              }`}
            />
            {errors.maximumDonationAmount && (
              <p className={`text-sm mt-1 ${currentTheme.errorText}`}>
                {errors.maximumDonationAmount.message}
              </p>
            )}
          </div>

          {/* Goal */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${currentTheme.label}`}>
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
                errors.goal ? currentTheme.errorBorder : currentTheme.input
              }`}
            />
            {errors.goal && (
              <p className={`text-sm mt-1 ${currentTheme.errorText}`}>
                {errors.goal.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${currentTheme.label}`}>
              Category
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              defaultValue={pet?.category || ""}
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                errors.category ? currentTheme.errorBorder : currentTheme.input
              }`}
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
            {errors.category && (
              <p className={`text-sm mt-1 ${currentTheme.errorText}`}>
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Last Donation Date */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${currentTheme.label}`}>
              Last Donation Date
            </label>
            <input
              type="date"
              {...register("lastDonationDate", {
                required: "Last donation date is required",
              })}
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                errors.lastDonationDate ? currentTheme.errorBorder : currentTheme.input
              }`}
            />
            {errors.lastDonationDate && (
              <p className={`text-sm mt-1 ${currentTheme.errorText}`}>
                {errors.lastDonationDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${currentTheme.label}`}>
            Short Description
          </label>
          <input
            {...register("shortDescription", {
              required: "Short description is required",
            })}
            placeholder="Enter short description"
            className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
              errors.shortDescription ? currentTheme.errorBorder : currentTheme.input
            }`}
          />
          {errors.shortDescription && (
            <p className={`text-sm mt-1 ${currentTheme.errorText}`}>
              {errors.shortDescription.message}
            </p>
          )}
        </div>

        {/* Long Description */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${currentTheme.label}`}>
            Long Description
          </label>
          <textarea
            {...register("longDescription", {
              required: "Long description is required",
            })}
            placeholder="Enter long description"
            rows={5}
            className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
              errors.longDescription ? currentTheme.errorBorder : currentTheme.input
            }`}
          />
          {errors.longDescription && (
            <p className={`text-sm mt-1 ${currentTheme.errorText}`}>
              {errors.longDescription.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full ${currentTheme.button} text-white py-3 rounded-lg transition duration-200 font-medium`}
          disabled={uploading}
        >
          {uploading ? "Processing..." : "Update Campaign"}
        </button>
      </form>
    </div>
  );
};

export default EditMyDonationCompaigns;