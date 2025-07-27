import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";
import { FirebaseAuthContext } from "../Firebase/FirebaseAuthContext";

const useAdmin = () => {
  const { user } = useContext(FirebaseAuthContext);
  const axiosPublic = useAxiosPublic();

  const { data: isAdmin = false, isPending } = useQuery({
    queryKey: ["isAdmin", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/admin/${user.email}`);
      return res.data?.isAdmin;
    },
    enabled: !!user?.email, // ✅ only run if email exists
    staleTime: 5 * 60 * 1000, // optional: cache for 5 mins
  });

  return [isAdmin, isPending];
};

export default useAdmin;
