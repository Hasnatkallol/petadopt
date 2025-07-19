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
import AdminProfile from "../DashBoardPage/AdminDashBoardPage/AdminProfile/AdminProfile";
import { User } from "lucide-react";

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
          fetch(`http://localhost:5000/adoptPet/${params.id}`, {
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
          fetch(`http://localhost:5000/donationPetDb/${params.id}`, {
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
        path: "about",
        element: (
          <PrivateRoute>
            <AboutPage></AboutPage>
          </PrivateRoute>
        ),
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
    path: "dashboard",
    element: <DashBoardLayout></DashBoardLayout>,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <MyProfile></MyProfile>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "/dashboard/myProfile",
                element: (
          <PrivateRoute>
          <MyProfile></MyProfile>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },

      {
        path: "/dashboard/addpet",
                element: (
          <PrivateRoute>
         <AddPet></AddPet>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "/dashboard/myAddedPet",
                element: (
          <PrivateRoute>
          <MyAddedPet></MyAddedPet>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "/dashboard/update/:id",
        loader: ({ params }) =>
          fetch(`http://localhost:5000/adoptPet/${params.id}`, {
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
        path: "/dashboard/adoptionRequest",
                 element: (
          <PrivateRoute>
        <AdoptionRequest></AdoptionRequest>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "/dashboard/createDonationCampaign",
               element: (
          <PrivateRoute>
          <CreateDonationCampaign></CreateDonationCampaign>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "/dashboard/myDonationCampaign",
                 element: (
          <PrivateRoute>
          <MyDonationCampaign></MyDonationCampaign>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "/dashboard/edit-donation/:id",
        loader: ({ params }) =>
          fetch(`http://localhost:5000/donationPetDb/${params.id}`, {
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
        path: "/dashboard/myDonation",
                 element: (
          <PrivateRoute>
          <MyDonation></MyDonation>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "/dashboard/users",
                 element: (
          <PrivateRoute>
          <Users></Users>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "/dashboard/allpets",
                 element: (
          <PrivateRoute>
          <AllPets></AllPets>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: "/dashboard/alldonations",
                 element: (
          <PrivateRoute>
         <AllDonations></AllDonations>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <Loading></Loading>,
      },
    ],
  },
]);
