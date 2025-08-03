// src/Hooks/useAxiosPublic.js
import axios from "axios";

const useAxiosPublic = () => {
  const token = localStorage.getItem("access-token"); // Ensure your token is stored here

  const axiosPublic = axios.create({
    baseURL: `https://petadopt-henna.vercel.app`, // or your actual API domain
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return axiosPublic;
};

export default useAxiosPublic;
