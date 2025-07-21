import axios from "axios";
import React, {  useContext, useEffect } from "react";
import { FirebaseAuthContext } from "../Firebase/FirebaseAuthContext";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
  baseURL: `http://localhost:5000`,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { user } = useContext(FirebaseAuthContext);
   const navigate = useNavigate();
    const { logOut } = useContext(FirebaseAuthContext);

        useEffect(() => {
        axiosSecure.interceptors.response.use(response => {
            return response;
        }, err => {
            console.log('Err from interceptor:', err);

            if(err?.status === 401 || err?.status === 403){
                logOut()
                .then(() => {
                    navigate('/login')
                }).catch(err => {
                    alert(err?.message);
                })
            }
    
            return Promise.reject(err);
        })
    }, [logOut, navigate])

  // useEffect(() => {
  //   const interceptor = axiosSecure.interceptors.request.use(
  //     (config) => {
  //       if (user?.accessToken) {
  //         config.headers.Authorization = `Bearer ${user.accessToken}`;
  //       }
  //       return config;
  //     },
  //     (error) => Promise.reject(error)
  //   );


  //   return () => {
  //     axiosSecure.interceptors.request.eject(interceptor);
  //   };
  // }, [user]);

  return axiosSecure;
};

export default useAxiosSecure;






