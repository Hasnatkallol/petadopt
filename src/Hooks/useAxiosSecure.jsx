import axios from "axios";
import React, { useContext, useEffect } from "react";
import { FirebaseAuthContext } from "../Firebase/FirebaseAuthContext";

const axiosSecure = axios.create({
  baseURL: `http://localhost:5000/`,
});

const useAxiosSecure = () => {
  const { user } = useContext(FirebaseAuthContext);

  useEffect(() => {
    const interceptor = axiosSecure.interceptors.request.use(
      (config) => {
        if (user?.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Cleanup: Remove interceptor when component unmounts or user changes
    return () => {
      axiosSecure.interceptors.request.eject(interceptor);
    };
  }, [user]);

  return axiosSecure;
};

export default useAxiosSecure;



// import axios from 'axios';
// import React, { useContext } from 'react';
// import { FirebaseAuthContext } from '../Firebase/FirebaseAuthContext';

// const axiosSecure = axios.create({
//   baseURL: `http://localhost:5000/`,

// });

// const useAxiosSecure = () => {
//   const {user} = useContext(FirebaseAuthContext)
//   axiosSecure.interceptors.request.use(function (config) {
//     config.headers.Authorization = ` Bearer ${user.accessToken}`
//     return config;
//   }, function (error) {

//     return Promise.reject(error);
//   });
//     return axiosSecure
// };

// export default useAxiosSecure;