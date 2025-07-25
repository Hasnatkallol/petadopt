import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout/MainLayout";
import Error from "../Shared/Error";
import Loading from "../Shared/Loading";
import HomePage from "../Pages/HomePage/HomePage";
import Login from "../AuthenticationPage/Login";
import Register from "../AuthenticationPage/Register";
import AboutPage from "../Pages/AboutPage/AboutPage";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import PetListing from "../Pages/PetListing/PetListing";
import DetailsPetListing from "../Pages/PetListing/DetailsPetListing";
import Donation from "../Pages/Donation/Donation";
import DonationDetails from "../Pages/Donation/DonationDetails";
import MyDonationCampaigns from "../Dashboard/UserDashboard/MyDonationCampaigns/MyDonationCampaigns";
import DashBoardLayout from "../Layout/DashBoardLayout/DashBoardLayout";
import MyProfile from "../DashBoardPage/MyProfile/MyProfile";
import AddPet from "../DashBoardPage/AddPet/AddPet";
import MyAddedPet from "../DashBoardPage/MyAddedPet/MyAddedPet";
import UpdatePet from "../DashBoardPage/MyAddedPet/UpdatePet";
import AdoptionRequest from "../DashBoardPage/AdoptionRequest/AdoptionRequest";
import CreateDonationCampaign from "../DashBoardPage/CreateDonationCampaign/CreateDonationCampaign";
import MyDonationCampaign from "../DashBoardPage/MyDonationCampaign/MyDonationCampaign";
import EditMyDonationCompaigns from "../DashBoardPage/MyDonationCampaign/EditMyDonationCompaigns";
import MyDonation from "../DashBoardPage/MyDonation/MyDonation";
import Users from "../DashBoardPage/AdminDashBoardPage/Users/Users";
import AllPets from "../DashBoardPage/AdminDashBoardPage/AllPets/AllPets";
import AllDonations from "../DashBoardPage/AdminDashBoardPage/ALlDonations/AllDonations";

import { User } from "lucide-react";
import AdminRoute from "../PrivateRoute/AdminRoute";
import AdminProfile from "../DashBoardPage/AdminProfile/AdminProfile";
import DashboardHomeRedirect from "../DashBoardPage/DashboardHomeRedirect/DashboardHomeRedirect";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    errorElement: <Error></Error>,
    children: [
      {
        index: true,
        Component: HomePage,
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "petsListing",
        Component: PetListing,
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "petsListing/:id",
        element: <DetailsPetListing></DetailsPetListing>,
        loader: ({ params }) =>
          fetch(`https://petadopt-henna.vercel.app/adoptPet/${params.id}`, {
            credentials: "include",
          }),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "donations",
        Component: Donation,
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "donations/:id",
        element: <DonationDetails></DonationDetails>,
        loader: ({ params }) =>
          fetch(`https://petadopt-henna.vercel.app/donationPetDb/${params.id}`, {
            credentials: "include",
          }),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "login",
        Component: Login,
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "register",
        Component: Register,
        hydrateFallbackElement: <Loading></Loading>,
      },

      {
        path: "mydonationdampaigns",
        Component: MyDonationCampaigns,
        hydrateFallbackElement: <Loading></Loading>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashBoardLayout></DashBoardLayout>,
    children: [
      {
        index: true,
        element: <DashboardHomeRedirect />,
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "myProfile",
        element: (
          <PrivateRoute>
            <MyProfile></MyProfile>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "adminProfile",
        element: (
          <AdminRoute>
            <AdminProfile></AdminProfile>
          </AdminRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "users",
        element: (
          <AdminRoute>
            <Users></Users>
          </AdminRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "allpets",
        element: (
          <AdminRoute>
            <AllPets></AllPets>
          </AdminRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "alldonations",
        element: (
          <AdminRoute>
            <AllDonations></AllDonations>
          </AdminRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "addpet",
        element: (
          <PrivateRoute>
            <AddPet></AddPet>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "update/:id",
        loader: ({ params }) =>
          fetch(`https://petadopt-henna.vercel.app/adoptPet/${params.id}`, {
            credentials: "include",
          }),
        element: (
          <PrivateRoute>
            <UpdatePet></UpdatePet>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "myAddedPet",
        element: (
          <PrivateRoute>
            <MyAddedPet></MyAddedPet>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "update/:id",
        loader: ({ params }) =>
          fetch(`https://petadopt-henna.vercel.app/adoptPet/${params.id}`, {
            credentials: "include",
          }),
        element: (
          <PrivateRoute>
            <UpdatePet></UpdatePet>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "adoptionRequest",
        element: (
          <PrivateRoute>
            <AdoptionRequest></AdoptionRequest>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "createDonationCampaign",
        element: (
          <PrivateRoute>
            <CreateDonationCampaign></CreateDonationCampaign>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "myDonationCampaign",
        element: (
          <PrivateRoute>
            <MyDonationCampaign></MyDonationCampaign>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "edit-donation/:id",
        loader: ({ params }) =>
          fetch(`https://petadopt-henna.vercel.app/donationPetDb/${params.id}`, {
            credentials: "include",
          }),
        element: (
          <PrivateRoute>
            <EditMyDonationCompaigns></EditMyDonationCompaigns>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "myDonation",
        element: (
          <PrivateRoute>
            <MyDonation></MyDonation>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
    ],
  },
]);
