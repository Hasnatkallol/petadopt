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
        Component: DetailsPetListing,
        loader: ({ params }) =>
          fetch(`http://localhost:5000/adoptPet/${params.id}`),
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
    ],
  },
]);
