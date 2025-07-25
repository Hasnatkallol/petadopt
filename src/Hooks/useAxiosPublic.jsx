import axios from "axios";
import React from "react";

const axiosPublic = axios.create({
  baseURL: `https://petadopt-henna.vercel.app`,
  withCredentials: true,
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
