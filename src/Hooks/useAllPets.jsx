// import { useQuery } from "@tanstack/react-query";
// import useAxiosPublic from "./useAxiosPublic";

// const useAllPets = () => {
//   const axiosPublic = useAxiosPublic();
//   const {
//     data: allPets = [],
//     isPending,
//     isError,
//     error,
//     refetch,
//   } = useQuery({
//     queryKey: ["allPets"],
//     queryFn: async () => {
//       const response = await axiosPublic.get('/adoptPet') 
//     },
//   });
// };

// export default useAllPets;
