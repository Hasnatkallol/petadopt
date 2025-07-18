import React, { useContext, useState } from "react";
import Select from "react-select";

import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import axios from "axios";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const categories = [
  { value: "Dog", label: "Dog" },
  { value: "Cat", label: "Cat" },
  { value: "Rabbit", label: "Rabbit" },
];

const genders = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const AddPet = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [category, setCategory] = useState(null);
  const [location, setLocation] = useState("");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState(null);
  const [vaccinated, setVaccinated] = useState(false);
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const { user } = useContext(FirebaseAuthContext);
  const axiosSecure = useAxiosSecure()
  const axiosPublic = useAxiosPublic()
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const now = new Date().toISOString();
    const data = {
      name: name.trim(),
      age: age.trim(),
      image: imageUrl,
      location: location.trim(),
      category: category.value,
      breed: breed.trim(),
      gender: gender.value,
      vaccinated,
      isAdopted: false,
      adoptionStatus: "Available",
      shortDescription: shortDesc.trim(),
      longDescription: longDesc.trim(),
      createdAt: now,
      updatedAt: now,
      addedBy: user.email,
    };
    try {
      const response = await axiosPublic.post("/adoptPet", data);
      console.log("Pet added successfully:", response.data);
      Swal.fire({
        icon: "success",
        title: "Pet Added Successfully!",
        text: `${data.name} is now available for adoption.`,
      });
    } catch (error) {
      console.error("Error adding pet:", error.response?.data || error.message);
    }

    console.log("Submitted pet data:", data);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-md shadow-md font-sans">
      <form onSubmit={handleSubmit} noValidate>
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block mb-1 font-semibold text-gray-700">
            Pet Image:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.image ? "border-red-500" : "border-gray-300"
            }`}
          />
          {uploading && (
            <p className="text-sm text-blue-600 mt-1">Uploading...</p>
          )}
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
          {imageUrl && (
            <p className="text-green-600 text-sm mt-1">
              Image uploaded successfully
            </p>
          )}
        </div>

        {/* Name */}
        <Input
          label="Pet Name"
          value={name}
          onChange={setName}
          error={errors.name}
        />

        {/* Age */}
        <Input
          label="Pet Age"
          value={age}
          onChange={setAge}
          error={errors.age}
        />

        {/* Category */}
        <SelectField
          label="Pet Category"
          options={categories}
          value={category}
          onChange={setCategory}
          error={errors.category}
        />

        {/* Breed */}
        <Input
          label="Breed"
          value={breed}
          onChange={setBreed}
          error={errors.breed}
        />

        {/* Gender */}
        <SelectField
          label="Gender"
          options={genders}
          value={gender}
          onChange={setGender}
          error={errors.gender}
        />

        {/* Location */}
        <Input
          label="Location"
          value={location}
          onChange={setLocation}
          error={errors.location}
        />

        {/* Vaccinated */}
        <div className="mb-5 flex items-center gap-2">
          <input
            type="checkbox"
            checked={vaccinated}
            onChange={(e) => setVaccinated(e.target.checked)}
            id="vaccinated"
            className="w-4 h-4"
          />
          <label htmlFor="vaccinated" className="text-gray-700 font-medium">
            Vaccinated
          </label>
        </div>

        {/* Short Desc */}
        <Input
          label="Short Description"
          value={shortDesc}
          onChange={setShortDesc}
          error={errors.shortDesc}
        />

        {/* Long Desc */}
        <div className="mb-5">
          <label className="block mb-1 font-semibold text-gray-700">
            Long Description:
          </label>
          <textarea
            rows={4}
            value={longDesc}
            onChange={(e) => setLongDesc(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md resize-y ${
              errors.longDesc ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.longDesc && (
            <p className="text-red-500 text-sm mt-1">{errors.longDesc}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPet;

// Reusable input field
const Input = ({ label, value, onChange, error }) => (
  <div className="mb-5">
    <label className="block mb-1 font-semibold text-gray-700">{label}:</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border rounded-md ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Reusable react-select field
const SelectField = ({ label, options, value, onChange, error }) => (
  <div className="mb-5">
    <label className="block mb-1 font-semibold text-gray-700">{label}:</label>
    <div
      className={`border rounded-md ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    >
      <Select
        options={options}
        value={value}
        onChange={onChange}
        placeholder={`Select ${label.toLowerCase()}`}
        styles={{
          control: (base) => ({
            ...base,
            border: "none",
            boxShadow: "none",
          }),
        }}
      />
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);
