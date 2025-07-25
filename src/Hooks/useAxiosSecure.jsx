import axios from "axios";
import React, { useContext, useEffect } from "react";
import { FirebaseAuthContext } from "../Firebase/FirebaseAuthContext";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
  baseURL: `https://petadopt-henna.vercel.app`,
  withCredentials: true,
});

const useAxiosSecure = () => {

  const navigate = useNavigate();
  const { logOut } = useContext(FirebaseAuthContext);

  useEffect(() => {
    axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        console.log("Err from interceptor:", err);

        if (err?.status === 401 || err?.status === 403) {
          logOut()
            .then(() => {
              navigate("/login");
            })
            .catch((err) => {
              alert(err?.message);
            });
        }

        return Promise.reject(err);
      }
    );
  }, [logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
