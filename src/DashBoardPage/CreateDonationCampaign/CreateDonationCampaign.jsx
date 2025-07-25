import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Select from "react-select";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

function CreateDonationCampaign() {
  const { theme } = useContext(FirebaseAuthContext);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();
  const axiosSecure = useAxiosSecure();

  const categoryOptions = [
    { value: "Dog", label: "Dog" },
    { value: "Cat", label: "Cat" },
    { value: "Rabbit", label: "Rabbit" },
  ];
  const { user } = useContext(FirebaseAuthContext);

  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const themeStyles = {
    light: {
      bg: "bg-gray-50",
      text: "text-gray-800",
      card: "bg-white border border-gray-200",
      input:
        "bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-400",
      error: "border-red-500 focus:ring-red-400",
      button: "bg-blue-600 hover:bg-blue-700",
      select: {
        control: (base) => ({
          ...base,
          backgroundColor: "white",
          borderColor: "#d1d5db",
          "&:hover": {
            borderColor: "#d1d5db",
          },
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "white",
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? "#f3f4f6" : "white",
          color: "#1f2937",
        }),
      },
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      card: "bg-gray-800 border-gray-700",
      input:
        "bg-gray-700 border-gray-600 focus:border-blue-400 focus:ring-blue-500",
      error: "border-red-400 focus:ring-red-500",
      button: "bg-blue-700 hover:bg-blue-600",
      select: {
        control: (base) => ({
          ...base,
          backgroundColor: "#374151",
          borderColor: "#4b5563",
          color: "white",
          "&:hover": {
            borderColor: "#4b5563",
          },
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "#374151",
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? "#4b5563" : "#374151",
          color: "white",
        }),
      },
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

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

    const formData = {
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
      const response = await axiosSecure.post("/donationPetDb", formData);
      Swal.fire({
        icon: "success",
        title: "Pet Added Successfully!",
        text: `${data.petName} is now available for donation.`,
        background: theme === "dark" ? "#1f2937" : "#ffffff",
        color: theme === "dark" ? "#f3f4f6" : "#111827",
      });
    } catch (error) {
      console.error("Error adding pet:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create donation campaign.",
        background: theme === "dark" ? "#1f2937" : "#ffffff",
        color: theme === "dark" ? "#f3f4f6" : "#111827",
      });
    }
  };

  useEffect(() => {
    document.title = "Create Donation Compaigns";
  }, []);

  return (
    <div className={`min-h-screen py-10 ${currentTheme.bg}`}>
      <div className="container mx-auto px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`mx-auto p-6 rounded-2xl shadow-md w-full max-w-2xl space-y-6 ${currentTheme.card}`}
        >
          <h2 className={`text-2xl font-bold text-center ${currentTheme.text}`}>
            Create Donation Campaign
          </h2>

          {/* Image Upload */}
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${currentTheme.text}`}
            >
              Pet Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("petImage")}
              onChange={handleImageUpload}
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                errors.petImage ? currentTheme.error : currentTheme.input
              }`}
            />
            {uploading && (
              <p
                className={`text-sm mt-1 ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              >
                Uploading image...
              </p>
            )}
            {errors.petImage && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.petImage.message}
              </p>
            )}
            {imageUrl && !errors.petImage && (
              <p
                className={`text-sm mt-1 ${
                  theme === "dark" ? "text-green-400" : "text-green-600"
                }`}
              >
                Image uploaded successfully
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pet Name */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${currentTheme.text}`}
              >
                Pet Name
              </label>
              <input
                {...register("petName", { required: "Pet name is required" })}
                placeholder="Enter pet name"
                className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  errors.petName ? currentTheme.error : currentTheme.input
                } ${theme === "dark" ? "text-white" : "text-gray-800"}`}
              />
              {errors.petName && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                  {errors.petName.message}
                </p>
              )}
            </div>

            {/* Maximum Donation Amount */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${currentTheme.text}`}
              >
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
                    ? currentTheme.error
                    : currentTheme.input
                } ${theme === "dark" ? "text-white" : "text-gray-800"}`}
              />
              {errors.maximumDonationAmount && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                  {errors.maximumDonationAmount.message}
                </p>
              )}
            </div>

            {/* Goal */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${currentTheme.text}`}
              >
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
                  errors.goal ? currentTheme.error : currentTheme.input
                } ${theme === "dark" ? "text-white" : "text-gray-800"}`}
              />
              {errors.goal && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                  {errors.goal.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${currentTheme.text}`}
              >
                Category
              </label>
              <Select
                options={categoryOptions}
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    clearErrors("category");
                    setValue("category", selectedOption.value);
                  }
                }}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select a category"
                styles={currentTheme.select}
              />
              <input
                type="hidden"
                {...register("category", { required: "Category is required" })}
              />
              {errors.category && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Last Donation Date */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${currentTheme.text}`}
              >
                Last Donation Date
              </label>
              <input
                type="date"
                {...register("lastDonationDate", {
                  required: "Last donation date is required",
                })}
                className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  errors.lastDonationDate
                    ? currentTheme.error
                    : currentTheme.input
                } ${theme === "dark" ? "text-white" : "text-gray-800"}`}
              />
              {errors.lastDonationDate && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                  {errors.lastDonationDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${currentTheme.text}`}
            >
              Short Description
            </label>
            <input
              {...register("shortDescription", {
                required: "Short description is required",
              })}
              placeholder="Enter short description"
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                errors.shortDescription
                  ? currentTheme.error
                  : currentTheme.input
              } ${theme === "dark" ? "text-white" : "text-gray-800"}`}
            />
            {errors.shortDescription && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.shortDescription.message}
              </p>
            )}
          </div>

          {/* Long Description */}
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${currentTheme.text}`}
            >
              Long Description
            </label>
            <textarea
              {...register("longDescription", {
                required: "Long description is required",
              })}
              placeholder="Enter long description"
              rows={5}
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                errors.longDescription ? currentTheme.error : currentTheme.input
              } ${theme === "dark" ? "text-white" : "text-gray-800"}`}
            />
            {errors.longDescription && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.longDescription.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 text-white font-medium rounded-lg transition duration-200 ${
              currentTheme.button
            } ${uploading ? "opacity-70 cursor-not-allowed" : ""}`}
            disabled={uploading}
          >
            {uploading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateDonationCampaign;
