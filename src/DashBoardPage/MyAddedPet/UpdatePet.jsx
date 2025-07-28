import axios from "axios";
import React, { useContext, useState } from "react";
import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import Select from "react-select";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

// Reusable Input component
const Input = ({ label, name, value, onChange, error, theme, textarea, required, type = "text" }) => {
  const themeStyles = {
    light: {
      text: "text-gray-700",
      input: "bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-400",
      error: "border-red-500 focus:ring-red-400",
    },
    dark: {
      text: "text-gray-300",
      input: "bg-gray-700 border-gray-600 focus:border-blue-400 focus:ring-blue-500",
      error: "border-red-400 focus:ring-red-500",
    },
  };
  const currentTheme = themeStyles[theme] || themeStyles.light;

  return (
    <div className="mb-5">
      <label className={`block mb-2 font-medium ${currentTheme.text}`}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2 rounded-lg ${currentTheme.input} ${error ? currentTheme.error : ""}`}
          rows="4"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2 rounded-lg ${currentTheme.input} ${error ? currentTheme.error : ""}`}
        />
      )}
      {error && <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
};

// SelectField component
const SelectField = ({ label, options, value, onChange, error, theme }) => {
  const themeStyles = {
    light: {
      text: "text-gray-700",
      errorText: "text-red-500",
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
      text: "text-gray-300",
      errorText: "text-red-400",
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

  return (
    <div className="mb-5">
      <label className={`block mb-2 font-medium ${currentTheme.text}`}>
        {label} <span className="text-red-500">*</span>
      </label>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        placeholder={`Select ${label.toLowerCase()}`}
        className="react-select-container"
        classNamePrefix="react-select"
        styles={currentTheme.select}
      />
      {error && (
        <p className={`${currentTheme.errorText} text-sm mt-2`}>{error}</p>
      )}
    </div>
  );
};

// Options
const categories = [
  { value: "Dog", label: "Dog" },
  { value: "Cat", label: "Cat" },
  { value: "Rabbit", label: "Rabbit" },
  { value: "Bird", label: "Bird" },
  { value: "Fish", label: "Fish" },
  { value: "Other", label: "Other" },
];

const genders = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Unknown", label: "Unknown" },
];

const ageUnits = [
  { value: "months", label: "Months" },
  { value: "years", label: "Years" },
];

const UpdatePet = () => {
  const { user, theme } = useContext(FirebaseAuthContext);
  const pet = useLoaderData();
  const axiosSecure = useAxiosSecure();

  // Parse the existing age (format like "2yr" or "6mo")
  const parseExistingAge = (ageStr) => {
    if (!ageStr) return { number: "", unit: "" };
    const number = ageStr.replace(/[^0-9]/g, '');
    const unit = ageStr.includes('yr') ? 'years' : 'months';
    return { number, unit };
  };

  const initialAge = parseExistingAge(pet?.age);

  const [name, setName] = useState(() => pet?.name || "");
  const [ageNumber, setAgeNumber] = useState(() => initialAge.number || "");
  const [ageUnit, setAgeUnit] = useState(() => 
    ageUnits.find(unit => unit.value === initialAge.unit) || null
  );
  const [category, setCategory] = useState(
    categories.find((c) => c.value === pet?.category) || null
  );
  const [location, setLocation] = useState(() => pet?.location || "");
  const [breed, setBreed] = useState(() => pet?.breed || "");
  const [gender, setGender] = useState(
    genders.find((g) => g.value === pet?.gender) || null
  );
  const [vaccinated, setVaccinated] = useState(() => pet?.vaccinated || false);
  const [shortDesc, setShortDesc] = useState(() => pet?.shortDescription || "");
  const [longDesc, setLongDesc] = useState(() => pet?.longDescription || "");
  const [imageUrl, setImageUrl] = useState(() => pet?.image || "");
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const themeStyles = {
    light: {
      bg: "bg-gray-50",
      text: "text-gray-800",
      card: "bg-white border border-gray-200",
      input: "bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-400",
      error: "border-red-500 focus:ring-red-400",
      button: "bg-blue-600 hover:bg-blue-700",
      secondaryText: "text-gray-600",
      accent: "text-blue-600",
      checkbox: "border-gray-300",
      uploadBorder: "border-gray-300",
      uploadHover: "hover:bg-gray-100",
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      card: "bg-gray-800 border-gray-700",
      input: "bg-gray-700 border-gray-600 focus:border-blue-400 focus:ring-blue-500",
      error: "border-red-400 focus:ring-red-500",
      button: "bg-blue-700 hover:bg-blue-600",
      secondaryText: "text-gray-300",
      accent: "text-blue-400",
      checkbox: "border-gray-600",
      uploadBorder: "border-gray-600",
      uploadHover: "hover:bg-gray-700",
    },
  };
  const currentTheme = themeStyles[theme] || themeStyles.light;

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];

    if (!image || !image.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        image: "Please upload a valid image file.",
      }));
      return;
    }

    setUploading(true);
    setErrors((prev) => ({ ...prev, image: null }));

    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBBKEY}`,
        formData
      );

      setImageUrl(res.data.data.url);
    } catch (err) {
      console.log(err);
      setErrors((prev) => ({
        ...prev,
        image: "Failed to upload image. Please try again.",
      }));
      setImageUrl("");
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Pet name is required";
    if (!ageNumber.trim()) newErrors.ageNumber = "Age is required";
    if (!ageUnit) newErrors.ageUnit = "Age unit is required";
    if (!category) newErrors.category = "Pet category is required";
    if (!breed.trim()) newErrors.breed = "Breed is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!location.trim()) newErrors.location = "Pet location is required";
    if (!shortDesc.trim()) newErrors.shortDesc = "Short description is required";
    if (!longDesc.trim()) newErrors.longDesc = "Long description is required";
    if (!imageUrl) newErrors.image = "Pet image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const now = new Date().toISOString();
    const updateData = {
      name: name.trim(),
      age: `${ageNumber}${ageUnit.value === 'years' ? 'yr' : 'mo'}`,
      image: imageUrl,
      location: location.trim(),
      category: category.value,
      breed: breed.trim(),
      gender: gender.value,
      vaccinated,
      isAdopted: pet.isAdopted || false,
      adoptionStatus: pet.adoptionStatus || "Available",
      shortDescription: shortDesc.trim(),
      longDescription: longDesc.trim(),
      updatedAt: now,
    };

    try {
      const res = await axiosSecure.put(
        `/adoptPet/${pet._id}?email=${user.email}`,
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
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text}`}>
      <div className="container mx-auto px-4 py-8">
        <div className={`max-w-2xl mx-auto ${currentTheme.card} rounded-xl shadow-lg p-6 md:p-8`}>
          <h2 className={`text-2xl font-bold mb-6 ${currentTheme.accent}`}>Update {name}</h2>

          <form onSubmit={handleUpdate} noValidate>
            {/* Image Upload */}
            <div className="mb-6">
              <label className={`block mb-2 font-medium ${currentTheme.text}`}>
                Pet Image <span className="text-red-500">*</span>
              </label>
              <div
                className={`border-2 border-dashed ${currentTheme.uploadBorder} rounded-lg p-4 text-center ${currentTheme.uploadHover}`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="petImage"
                  disabled={uploading}
                />
                <label
                  htmlFor="petImage"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Pet preview"
                      className="h-32 w-32 object-cover rounded-md mb-2"
                    />
                  ) : (
                    <>
                      <svg
                        className="w-12 h-12 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className={`text-sm ${currentTheme.secondaryText}`}>
                        Click to upload or drag and drop
                      </p>
                    </>
                  )}
                </label>
              </div>
              {uploading && (
                <p className={`text-sm mt-2 ${currentTheme.accent}`}>Uploading...</p>
              )}
              {errors.image && (
                <p className="text-red-500 text-sm mt-2">{errors.image}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Pet Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                theme={theme}
                required
              />
              
              {/* Age Input - Split into number and unit */}
              <div className="mb-5">
                <label className={`block mb-2 font-medium ${currentTheme.text}`}>
                  Pet Age <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="ageNumber"
                    value={ageNumber}
                    onChange={(e) => setAgeNumber(e.target.value)}
                    min="0"
                    step="1"
                    className={`flex-1 px-4 py-2 rounded-lg ${currentTheme.input} ${errors.ageNumber ? currentTheme.error : ""}`}
                    placeholder="Age"
                  />
                  <Select
                    options={ageUnits}
                    value={ageUnit}
                    onChange={setAgeUnit}
                    placeholder="Unit"
                    className="flex-1 react-select-container"
                    classNamePrefix="react-select"
                    styles={currentTheme.select}
                  />
                </div>
                {(errors.ageNumber || errors.ageUnit) && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.ageNumber || errors.ageUnit}
                  </p>
                )}
              </div>

              {/* Category Select */}
              <SelectField 
                label="Pet Category" 
                options={categories} 
                value={category} 
                onChange={setCategory} 
                error={errors.category} 
                theme={theme} 
              />

              <Input
                label="Breed"
                name="breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                error={errors.breed}
                theme={theme}
                required
              />

              {/* Gender Select */}
              <SelectField 
                label="Gender" 
                options={genders} 
                value={gender} 
                onChange={setGender} 
                error={errors.gender} 
                theme={theme} 
              />

              <Input
                label="Location"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                error={errors.location}
                theme={theme}
                required
              />
            </div>

            {/* Vaccinated Checkbox */}
            <div className="mb-6">
              <label className={`inline-flex items-center ${currentTheme.text}`}>
                <input
                  type="checkbox"
                  checked={vaccinated}
                  onChange={() => setVaccinated(prev => !prev)}
                  className={`form-checkbox h-5 w-5 rounded ${currentTheme.checkbox}`}
                />
                <span className="ml-2">Vaccinated</span>
              </label>
            </div>

            {/* Short Description */}
            <Input
              label="Short Description"
              name="shortDesc"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              error={errors.shortDesc}
              theme={theme}
              textarea
              required
            />

            {/* Long Description */}
            <div className="mb-6">
              <label className={`block mb-2 font-medium ${currentTheme.text}`}>
                Long Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={longDesc}
                onChange={(e) => setLongDesc(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg ${currentTheme.input} ${errors.longDesc ? currentTheme.error : ""}`}
              />
              {errors.longDesc && (
                <p className="text-red-500 text-sm mt-2">{errors.longDesc}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className={`w-full py-3 rounded-lg text-white font-semibold ${
                uploading
                  ? "opacity-50 cursor-not-allowed"
                  : currentTheme.button
              }`}
            >
              Update Pet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePet;