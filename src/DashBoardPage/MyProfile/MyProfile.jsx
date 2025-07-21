import React, { useContext } from "react";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import { useNavigate } from "react-router";

const MyProfile = () => {
  const { user } = useContext(FirebaseAuthContext);
 console.log(user)
  const navigate = useNavigate();
  console.log(user);
  if (user.role === "admin") {
    return navigate("adminProfile");
  }

  return (
    <div>
      <h1>My user Profile is {user?.email}</h1>
      <img src={user?.photoURL} alt="" />
      <h1> My profile</h1>
    </div>
  );
};

export default MyProfile;

// {
//   path: "dashboard",
//   element: <DashBoardLayout></DashBoardLayout>,
//   children: [
//     {
//       index: true,
//       element: (
//         <PrivateRoute>
//           <MyProfile></MyProfile>
//         </PrivateRoute>
//       ),
//       hydrateFallbackElement: <Loading></Loading>,
//     },
//     {
//       path: "/dashboard/myProfile",
//       element: (
//         <PrivateRoute>
//           <MyProfile></MyProfile>
//         </PrivateRoute>
//       ),
//       hydrateFallbackElement: <Loading></Loading>,
//     },

//     {
//       path: "/dashboard/addpet",
//       element: (
//         <PrivateRoute>
//           <AddPet></AddPet>
//         </PrivateRoute>
//       ),
//       hydrateFallbackElement: <Loading></Loading>,
//     },
//     {
//       path: "/dashboard/myAddedPet",
//       element: (
//         <PrivateRoute>
//           <MyAddedPet></MyAddedPet>
//         </PrivateRoute>
//       ),
//       hydrateFallbackElement: <Loading></Loading>,
//     },
//     {
//       path: "/dashboard/update/:id",
//       loader: ({ params }) =>
//         fetch(`http://localhost:5000/adoptPet/${params.id}`, {
//           credentials: "include",
//         }),
//       element: (
//         <PrivateRoute>
//           <UpdatePet></UpdatePet>
//         </PrivateRoute>
//       ),
//       hydrateFallbackElement: <Loading></Loading>,
//     },
//     {
//       path: "/dashboard/adoptionRequest",
//       element: (
//         <PrivateRoute>
//           <AdoptionRequest></AdoptionRequest>
//         </PrivateRoute>
//       ),
//       hydrateFallbackElement: <Loading></Loading>,
//     },
//     {
//       path: "/dashboard/createDonationCampaign",
//       element: (
//         <PrivateRoute>
//           <CreateDonationCampaign></CreateDonationCampaign>
//         </PrivateRoute>
//       ),
//       hydrateFallbackElement: <Loading></Loading>,
//     },
//     {
//       path: "/dashboard/myDonationCampaign",
//       element: (
//         <PrivateRoute>
//           <MyDonationCampaign></MyDonationCampaign>
//         </PrivateRoute>
//       ),
//       hydrateFallbackElement: <Loading></Loading>,
//     },
//     {
//       path: "/dashboard/edit-donation/:id",
//       loader: ({ params }) =>
//         fetch(`http://localhost:5000/donationPetDb/${params.id}`, {
//           credentials: "include",
//         }),
//       element: (
//         <PrivateRoute>
//           <EditMyDonationCompaigns></EditMyDonationCompaigns>
//         </PrivateRoute>
//       ),
//       hydrateFallbackElement: <Loading></Loading>,
//     },
//     {
//       path: "/dashboard/myDonation",
//       element: (
//         <PrivateRoute>
//           <MyDonation></MyDonation>
//         </PrivateRoute>
//       ),
//       hydrateFallbackElement: <Loading></Loading>,
//     },
//     {
//       path: "/dashboard/users",
//       element: (
//         <PrivateRoute>
//           <Users></Users>
//         </PrivateRoute>
//       ),
//       hydrateFallbackElement: <Loading></Loading>,
//     },
//     {
//       path: "/dashboard/allpets",
//       element: (
//         <PrivateRoute>
//           <AllPets></AllPets>
//         </PrivateRoute>
//       ),
//       hydrateFallbackElement: <Loading></Loading>,
//     },
//     {
//       path: "/dashboard/alldonations",
//       element: (
//         <PrivateRoute>
//           <AllDonations></AllDonations>
//         </PrivateRoute>
//       ),
//       hydrateFallbackElement: <Loading></Loading>,
//     },
//   ],
// },
