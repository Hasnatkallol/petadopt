import React, { useContext, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
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
  const { user, theme } = useContext(FirebaseAuthContext);
  const axiosPublic = useAxiosPublic();

  const themeStyles = {
    light: {
      bg: "bg-gray-50",
      text: "text-gray-800",
      card: "bg-white border border-gray-100",
      input: "bg-white border-gray-300 focus:border-blue-500",
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
      input: "bg-gray-700 border-gray-600 focus:border-blue-400",
      button: "bg-blue-500 hover:bg-blue-600",
      secondaryText: "text-gray-300",
      accent: "text-blue-400",
      checkbox: "border-gray-600",
      uploadBorder: "border-gray-600",
      uploadHover: "hover:bg-gray-700",
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setLongDesc(editor.getHTML());
    },
  });

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
    if (!longDesc || longDesc === "<p></p>") newErrors.longDesc = "Long description is required";
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
      await axiosPublic.post("/adoptPet", data);
      Swal.fire({
        icon: "success",
        title: "Pet Added Successfully!",
        text: `${data.name} is now available for adoption.`,
        background: currentTheme.card,
        color: currentTheme.text,
      });

      // Clear form
      setName("");
      setAge("");
      setCategory(null);
      setLocation("");
      setBreed("");
      setGender(null);
      setVaccinated(false);
      setShortDesc("");
      editor?.commands.setContent("");
      setImageUrl("");
      setErrors({});
    } catch (error) {
      console.error("Error adding pet:", error.response?.data || error.message);
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        <div className={`max-w-2xl mx-auto ${currentTheme.card} rounded-xl shadow-lg overflow-hidden p-6 md:p-8 transition-all duration-300`}>
          <h2 className={`text-2xl font-bold mb-6 ${currentTheme.accent}`}>Add New Pet</h2>
          
          <form onSubmit={handleSubmit} noValidate>
            {/* Image Upload */}
            <div className="mb-6">
              <label className={`block mb-2 font-medium ${currentTheme.text}`}>
                Pet Image
                <span className="text-red-500">*</span>
              </label>
              <div className={`border-2 border-dashed ${currentTheme.uploadBorder} rounded-lg p-4 text-center ${currentTheme.uploadHover} transition-colors`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="petImage"
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
                value={name}
                onChange={setName}
                error={errors.name}
                theme={currentTheme}
                required
              />
              <Input
                label="Pet Age"
                value={age}
                onChange={setAge}
                error={errors.age}
                theme={currentTheme}
                required
              />
              <SelectField
                label="Pet Category"
                options={categories}
                value={category}
                onChange={setCategory}
                error={errors.category}
                theme={currentTheme}
                required
              />
              <Input
                label="Breed"
                value={breed}
                onChange={setBreed}
                error={errors.breed}
                theme={currentTheme}
                required
              />
              <SelectField
                label="Gender"
                options={genders}
                value={gender}
                onChange={setGender}
                error={errors.gender}
                theme={currentTheme}
                required
              />
              <Input
                label="Location"
                value={location}
                onChange={setLocation}
                error={errors.location}
                theme={currentTheme}
                required
              />
            </div>

            <div className="mt-6 mb-6 flex items-center">
              <input
                type="checkbox"
                checked={vaccinated}
                onChange={(e) => setVaccinated(e.target.checked)}
                id="vaccinated"
                className={`w-4 h-4 rounded ${currentTheme.checkbox} ${currentTheme.accent}`}
              />
              <label htmlFor="vaccinated" className={`ml-2 ${currentTheme.text}`}>
                Vaccinated
              </label>
            </div>

            <Input
              label="Short Description"
              value={shortDesc}
              onChange={setShortDesc}
              error={errors.shortDesc}
              theme={currentTheme}
              textarea
              required
            />

            {/* Long Description with Tiptap */}
            <div className="mb-6">
              <label className={`block mb-2 font-medium ${currentTheme.text}`}>
                Long Description
                <span className="text-red-500">*</span>
              </label>
              <div
                className={`rounded-lg ${currentTheme.input} ${
                  errors.longDesc ? "border-red-500" : ""
                }`}
              >
                {editor && (
                  <EditorContent
                    editor={editor}
                    className="min-h-[200px] p-3 focus:outline-none"
                  />
                )}
              </div>
              {errors.longDesc && (
                <p className="text-red-500 text-sm mt-2">{errors.longDesc}</p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 ${currentTheme.button} text-white font-semibold rounded-lg hover:opacity-90 transition-opacity`}
            >
              Add Pet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Component
const Input = ({ label, value, onChange, error, theme, textarea, required }) => (
  <div className="mb-5">
    <label className={`block mb-2 font-medium ${theme.text}`}>
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {textarea ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2 rounded-lg ${theme.input} ${
          error ? "border-red-500" : ""
        }`}
        rows="4"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2 rounded-lg ${theme.input} ${
          error ? "border-red-500" : ""
        }`}
      />
    )}
    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
  </div>
);

// Reusable Select Component
const SelectField = ({ label, options, value, onChange, error, theme, required }) => (
  <div className="mb-5">
    <label className={`block mb-2 font-medium ${theme.text}`}>
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className={`rounded-lg ${theme.input} ${error ? "border-red-500" : ""}`}>
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
            backgroundColor: "transparent",
            color: theme.text === "text-gray-100" ? "#f3f4f6" : "#1f2937",
          }),
          singleValue: (base) => ({
            ...base,
            color: theme.text === "text-gray-100" ? "#f3f4f6" : "#1f2937",
          }),
          placeholder: (base) => ({
            ...base,
            color: theme.secondaryText === "text-gray-300" ? "#d1d5db" : "#4b5563",
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: theme.card === "bg-gray-800" ? "#1f2937" : "#ffffff",
            borderColor: theme.card === "bg-gray-800" ? "#374151" : "#e5e7eb",
          }),
          option: (base, { isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isSelected
              ? "#3b82f6"
              : isFocused
              ? theme.card === "bg-gray-800" ? "#374151" : "#f3f4f6"
              : "transparent",
            color: isSelected
              ? "#ffffff"
              : theme.text === "text-gray-100" ? "#f3f4f6" : "#1f2937",
            ":active": {
              backgroundColor: isSelected ? "#3b82f6" : theme.card === "bg-gray-800" ? "#4b5563" : "#e5e7eb",
            },
          }),
        }}
      />
    </div>
    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
  </div>
);

export default AddPet;