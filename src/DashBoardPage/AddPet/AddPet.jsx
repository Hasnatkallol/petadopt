import React, { useContext, useState, useEffect, useCallback } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

// Constants
const petCategories = [
  { value: "Dog", label: "Dog" },
  { value: "Cat", label: "Cat" },
  { value: "Rabbit", label: "Rabbit" },
  { value: "Bird", label: "Bird" },
  { value: "Fish", label: "Fish" },
  { value: "Other", label: "Other" },
];

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Unknown", label: "Unknown" },
];

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
    select: {
      control: (base) => ({
        ...base,
        backgroundColor: 'white',
        borderColor: '#d1d5db',
        '&:hover': {
          borderColor: '#d1d5db',
        },
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: 'white',
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? '#f3f4f6' : 'white',
        color: '#1f2937',
      }),
    },
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
    select: {
      control: (base) => ({
        ...base,
        backgroundColor: '#374151',
        borderColor: '#4b5563',
        color: 'white',
        '&:hover': {
          borderColor: '#4b5563',
        },
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: '#374151',
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? '#4b5563' : '#374151',
        color: 'white',
      }),
    },
  },
};

// Reusable Input Component
const Input = ({ label, name, value, onChange, error, theme, textarea, required }) => (
  <div className="mb-5">
    <label className={`block mb-2 font-medium ${theme.text}`}>
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {textarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 rounded-lg ${theme.input} ${error ? "border-red-500" : ""}`}
        rows="4"
      />
    ) : (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 rounded-lg ${theme.input} ${error ? "border-red-500" : ""}`}
      />
    )}
    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
  </div>
);

const AddPet = () => {
  useEffect(() => {
    document.title = "Add Pet";
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    location: "",
    breed: "",
    shortDesc: "",
  });
  const [category, setCategory] = useState(null);
  const [gender, setGender] = useState(null);
  const [vaccinated, setVaccinated] = useState(false);
  const [longDesc, setLongDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, theme } = useContext(FirebaseAuthContext);
  const axiosPublic = useAxiosPublic();
  const currentTheme = themeStyles[theme] || themeStyles.light;

  // Editor initialized once, updates longDesc on change
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setLongDesc(editor.getHTML());
    },
  });

  // Cleanup editor on unmount
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image || !image.type.startsWith("image/")) {
      setErrors(prev => ({ ...prev, image: "Please upload a valid image file." }));
      return;
    }

    setUploading(true);
    setErrors(prev => ({ ...prev, image: null }));

    try {
      const data = new FormData();
      data.append("image", image);

      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBBKEY}`,
        data
      );

      if (res?.data?.data?.url) {
        setImageUrl(res.data.data.url);
      } else {
        throw new Error("Invalid response from image server");
      }
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        image: "Failed to upload image. Please try again.",
      }));
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Pet name is required";
    if (!formData.age.trim()) newErrors.age = "Valid pet age is required";
    if (!category) newErrors.category = "Pet category is required";
    if (!formData.breed.trim()) newErrors.breed = "Breed is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!formData.location.trim()) newErrors.location = "Pet location is required";
    if (!formData.shortDesc.trim()) newErrors.shortDesc = "Short description is required";
    if (!longDesc || longDesc === "<p></p>") newErrors.longDesc = "Long description is required";
    if (!imageUrl) newErrors.image = "Pet image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      location: "",
      breed: "",
      shortDesc: "",
    });
    setCategory(null);
    setGender(null);
    setVaccinated(false);
    setImageUrl("");
    setErrors({});
    editor?.commands.clearContent();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    const now = new Date().toISOString();
    const petData = {
      ...formData,
      image: imageUrl,
      category: category.value,
      gender: gender.value,
      vaccinated,
      isAdopted: false,
      adoptionStatus: "Available",
      shortDescription: formData.shortDesc,
      longDescription: longDesc,
      createdAt: now,
      updatedAt: now,
      addedBy: user.email,
    };

    try {
      await axiosPublic.post("/adoptPet", petData);

      Swal.fire({
        icon: "success",
        title: "Pet Added Successfully!",
        text: `${petData.name} is now available for adoption.`,
        background: currentTheme.card,
        color: currentTheme.text,
      });

      resetForm();
    } catch (error) {
      console.error("Error adding pet:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add pet. Please try again.",
        background: currentTheme.card,
        color: currentTheme.text,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text}`}>
      <div className="container mx-auto px-4 py-8">
        <div className={`max-w-2xl mx-auto ${currentTheme.card} rounded-xl shadow-lg p-6 md:p-8`}>
          <h2 className={`text-2xl font-bold mb-6 ${currentTheme.accent}`}>Add New Pet</h2>

          <form onSubmit={handleSubmit} noValidate>
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
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                theme={currentTheme}
                required
              />
              <Input
                label="Pet Age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                error={errors.age}
                theme={currentTheme}
                required
              />

              {/* Category Select */}
              <div className="mb-5">
                <label className={`block mb-2 font-medium ${currentTheme.text}`}>
                  Pet Category <span className="text-red-500">*</span>
                </label>
                <Select
                  options={petCategories}
                  value={category}
                  onChange={setCategory}
                  placeholder="Select category"
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={currentTheme.select}
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-2">{errors.category}</p>
                )}
              </div>

              <Input
                label="Breed"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                error={errors.breed}
                theme={currentTheme}
                required
              />

              {/* Gender Select */}
              <div className="mb-5">
                <label className={`block mb-2 font-medium ${currentTheme.text}`}>
                  Gender <span className="text-red-500">*</span>
                </label>
                <Select
                  options={genderOptions}
                  value={gender}
                  onChange={setGender}
                  placeholder="Select gender"
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={currentTheme.select}
                />
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-2">{errors.gender}</p>
                )}
              </div>

              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                error={errors.location}
                theme={currentTheme}
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
              value={formData.shortDesc}
              onChange={handleInputChange}
              error={errors.shortDesc}
              theme={currentTheme}
              textarea
              required
            />

            {/* Long Description - TipTap Editor */}
            <div className="mb-6">
              <label className={`block mb-2 font-medium ${currentTheme.text}`}>
                Long Description <span className="text-red-500">*</span>
              </label>
              <div
                className={`${currentTheme.input} rounded-lg min-h-[150px] p-3`}
                style={{ borderWidth: errors.longDesc ? "2px" : "1px" }}
              >
                <EditorContent editor={editor} />
              </div>
              {errors.longDesc && (
                <p className="text-red-500 text-sm mt-2">{errors.longDesc}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className={`w-full py-3 rounded-lg text-white font-semibold ${
                isSubmitting || uploading
                  ? "opacity-50 cursor-not-allowed"
                  : currentTheme.button
              }`}
            >
              {isSubmitting ? "Submitting..." : "Add Pet"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPet;
