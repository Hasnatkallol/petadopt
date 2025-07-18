import React, { useContext } from "react";


import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";
import { FirebaseAuthContext } from "../Firebase/FirebaseAuthContext";

const useAdmin = () => {
  const { user } = useContext(FirebaseAuthContext);
  const axiosPublic = useAxiosPublic();

  const { data: isAdmin, isPending } = useQuery({
    queryKey: ["isAdmin", axiosPublic, user?.email],
    queryFn: async () => {
      if (user) {
        const res = await axiosPublic.get(`/users/admin/${user?.email}`);
        const data = await res?.data;
        if (data) {
          return data?.isAdmin;
        }
      }
    },
  });

  return [isAdmin, isPending];
};

export default useAdmin;
