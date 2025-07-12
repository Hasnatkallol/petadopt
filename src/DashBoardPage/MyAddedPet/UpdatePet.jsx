import axios from "axios";
import React, { useContext,  useState } from "react";
import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import Select from "react-select";

// Reusable Input component
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

// Reusable SelectField component
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
  const { user } = useContext(FirebaseAuthContext);
  const pet = useLoaderData();

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
    if (!shortDesc.trim()) newErrors.shortDesc = "Short description is required";
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
      const res = await axios.put(
        `http://localhost:5000/adoptPet/${pet._id}?email=${user.email}`,
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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-md shadow-md font-sans">
        <div>
            <h1>Update {name}</h1>
        </div>
      <form onSubmit={handleUpdate} noValidate>
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block mb-1 font-semibold text-gray-700">Pet Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.image ? "border-red-500" : "border-gray-300"
            }`}
          />
          {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          {imageUrl && (
            <img src={imageUrl} alt="Uploaded" className="h-24 mt-2 rounded-md" />
          )}
        </div>

        <Input label="Pet Name" value={name} onChange={setName} error={errors.name} />
        <Input label="Pet Age" value={age} onChange={setAge} error={errors.age} />
        <SelectField
          label="Pet Category"
          options={categories}
          value={category}
          onChange={setCategory}
          error={errors.category}
        />
        <Input label="Breed" value={breed} onChange={setBreed} error={errors.breed} />
        <SelectField
          label="Gender"
          options={genders}
          value={gender}
          onChange={setGender}
          error={errors.gender}
        />
        <Input label="Location" value={location} onChange={setLocation} error={errors.location} />

        {/* Vaccinated Checkbox */}
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

        <Input
          label="Short Description"
          value={shortDesc}
          onChange={setShortDesc}
          error={errors.shortDesc}
        />

        {/* Long Description */}
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
          {errors.longDesc && <p className="text-red-500 text-sm mt-1">{errors.longDesc}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Update Pet
        </button>
      </form>
    </div>
  );
};

export default UpdatePet;
