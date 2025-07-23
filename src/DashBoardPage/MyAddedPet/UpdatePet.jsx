import axios from "axios";
import React, { useContext, useState } from "react";
import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import Select from "react-select";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

// Reusable Input component
const Input = ({ label, value, onChange, error, theme }) => {
  const themeStyles = {
    light: {
      text: "text-gray-700",
      input: "bg-white border-gray-300",
      error: "border-red-500",
    },
    dark: {
      text: "text-gray-300",
      input: "bg-gray-700 border-gray-600",
      error: "border-red-400",
    },
  };
  const currentTheme = themeStyles[theme] || themeStyles.light;

  return (
    <div className="mb-5">
      <label className={`block mb-1 font-semibold ${currentTheme.text}`}>
        {label}:
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md ${
          error ? currentTheme.error : currentTheme.input
        } ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
      />
      {error && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

// Reusable SelectField component
const SelectField = ({ label, options, value, onChange, error, theme }) => {
  const themeStyles = {
    light: {
      text: "text-gray-700",
      border: "border-gray-300",
      error: "border-red-500",
      menu: "bg-white",
      option: "hover:bg-gray-100",
    },
    dark: {
      text: "text-gray-300",
      border: "border-gray-600",
      error: "border-red-400",
      menu: "bg-gray-800",
      option: "hover:bg-gray-700",
    },
  };
  const currentTheme = themeStyles[theme] || themeStyles.light;

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: theme === 'dark' ? '#374151' : 'white',
      borderColor: error 
        ? (theme === 'dark' ? '#f87171' : '#ef4444')
        : (theme === 'dark' ? '#4b5563' : '#d1d5db'),
      color: theme === 'dark' ? 'white' : '#1f2937',
      boxShadow: state.isFocused 
        ? (theme === 'dark' 
          ? '0 0 0 1px #60a5fa' 
          : '0 0 0 1px #3b82f6')
        : 'none',
      '&:hover': {
        borderColor: error 
          ? (theme === 'dark' ? '#f87171' : '#ef4444')
          : (theme === 'dark' ? '#4b5563' : '#d1d5db'),
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: theme === 'dark' ? 'white' : '#1f2937',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: currentTheme.menu,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? currentTheme.option : 'transparent',
      color: theme === 'dark' ? 'white' : '#1f2937',
    }),
    input: (base) => ({
      ...base,
      color: theme === 'dark' ? 'white' : '#1f2937',
    }),
  };

  return (
    <div className="mb-5">
      <label className={`block mb-1 font-semibold ${currentTheme.text}`}>
        {label}:
      </label>
      <div
        className={`border rounded-md ${
          error ? currentTheme.error : currentTheme.border
        }`}
      >
        <Select
          options={options}
          value={value}
          onChange={onChange}
          placeholder={`Select ${label.toLowerCase()}`}
          styles={customStyles}
        />
      </div>
      {error && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

const categories = [
  { value: "Dog", label: "Dog" },
  { value: "Cat", label: "Cat" },
  { value: "Rabbit", label: "Rabbit" },
];

const genders = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const UpdatePet = () => {
  const { user, theme } = useContext(FirebaseAuthContext);
  const pet = useLoaderData();

  const axiosSecure = useAxiosSecure()

  // Initialize state with pet data
  const [name, setName] = useState(pet.name || "");
  const [age, setAge] = useState(pet.age || "");
  const [category, setCategory] = useState(
    categories.find((c) => c.value === pet.category) || null
  );
  const [location, setLocation] = useState(pet.location || "");
  const [breed, setBreed] = useState(pet.breed || "");
  const [gender, setGender] = useState(
    genders.find((g) => g.value === pet.gender) || null
  );
  const [vaccinated, setVaccinated] = useState(pet.vaccinated || false);
  const [shortDesc, setShortDesc] = useState(pet.shortDescription || "");
  const [longDesc, setLongDesc] = useState(pet.longDescription || "");
  const [imageUrl, setImageUrl] = useState(pet.image || "");
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const themeStyles = {
    light: {
      bg: "bg-gray-50",
      text: "text-gray-800",
      card: "bg-white border border-gray-100",
      input: "bg-white border-gray-300 focus:border-blue-500",
      button: "bg-blue-600 hover:bg-blue-700",
      secondaryText: "text-gray-600",
      accent: "text-blue-600",
      sidebar: "bg-white",
      topBar: "bg-white",
      hover: "hover:bg-gray-100",
      activeLink: "bg-blue-100 text-blue-700",
      iconButton: "bg-gray-200 hover:bg-gray-300",
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      card: "bg-gray-800 border-gray-700",
      input: "bg-gray-700 border-gray-600 focus:border-blue-400",
      button: "bg-blue-500 hover:bg-blue-600",
      secondaryText: "text-gray-300",
      accent: "text-blue-400",
      sidebar: "bg-gray-800",
      topBar: "bg-gray-800",
      hover: "hover:bg-gray-700",
      activeLink: "bg-blue-700 text-white",
      iconButton: "bg-gray-700 hover:bg-gray-600",
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

      const imagUploadUrl = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMGBBKEY
      }`;

      const res = await axios.post(imagUploadUrl, formData);
      setImageUrl(res.data.data.url);
    } catch (err) {
      console.log(err)
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
    if (!age.trim()) newErrors.age = "Valid pet age is required";
    if (!category) newErrors.category = "Pet category is required";
    if (!breed.trim()) newErrors.breed = "Breed is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!location.trim()) newErrors.location = "Pet location is required";
    if (!shortDesc.trim())
      newErrors.shortDesc = "Short description is required";
    if (!longDesc.trim()) newErrors.longDesc = "Long description is required";
    if (!imageUrl) newErrors.image = "Pet image is required";
    return newErrors;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const now = new Date().toISOString();
    const updateData = {
      name: name.trim(),
      age: age.trim(),
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
    <div className={`min-h-screen py-10 ${currentTheme.bg} ${currentTheme.text}`}>
      <div className={`max-w-4xl mx-auto p-6 rounded-md shadow-md ${currentTheme.card}`}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Update {name}</h1>
        </div>
        <form onSubmit={handleUpdate} noValidate>
          {/* Image Upload */}
          <div className="mb-6">
            <label className={`block mb-1 font-semibold ${currentTheme.text}`}>
              Pet Image:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.image 
                  ? (theme === 'dark' ? 'border-red-400' : 'border-red-500')
                  : (theme === 'dark' ? 'border-gray-600' : 'border-gray-300')
              }`}
            />
            {uploading && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Uploading...</p>
            )}
            {errors.image && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.image}</p>
            )}
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Uploaded"
                className="h-24 mt-2 rounded-md"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Pet Name"
              value={name}
              onChange={setName}
              error={errors.name}
              theme={theme}
            />
            <Input
              label="Pet Age"
              value={age}
              onChange={setAge}
              error={errors.age}
              theme={theme}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              value={breed}
              onChange={setBreed}
              error={errors.breed}
              theme={theme}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              value={location}
              onChange={setLocation}
              error={errors.location}
              theme={theme}
            />
          </div>

          {/* Vaccinated Checkbox */}
          <div className="mb-5 flex items-center gap-2">
            <input
              type="checkbox"
              checked={vaccinated}
              onChange={(e) => setVaccinated(e.target.checked)}
              id="vaccinated"
              className="w-4 h-4"
            />
            <label htmlFor="vaccinated" className={`font-medium ${currentTheme.text}`}>
              Vaccinated
            </label>
          </div>

          <Input
            label="Short Description"
            value={shortDesc}
            onChange={setShortDesc}
            error={errors.shortDesc}
            theme={theme}
          />

          {/* Long Description */}
          <div className="mb-5">
            <label className={`block mb-1 font-semibold ${currentTheme.text}`}>
              Long Description:
            </label>
            <textarea
              rows={4}
              value={longDesc}
              onChange={(e) => setLongDesc(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md resize-y ${
                errors.longDesc 
                  ? (theme === 'dark' ? 'border-red-400' : 'border-red-500')
                  : (theme === 'dark' ? 'border-gray-600' : 'border-gray-300')
              } ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
            />
            {errors.longDesc && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.longDesc}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 ${currentTheme.button} text-white font-semibold rounded-md transition`}
          >
            Update Pet
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePet;