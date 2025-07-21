import React, { useContext } from "react";
import { FirebaseAuthContext } from "../Firebase/FirebaseAuthContext";
import { Navigate, useLocation } from "react-router";
import Loading from "../Shared/Loading";


const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(FirebaseAuthContext);
  const location = useLocation();
   

  if (loading) {
    return <Loading></Loading>;
  }



  if (user) {
    return children;
  }
  return <Navigate state={location?.pathname} to="/login"></Navigate>;
};

export default PrivateRoute;
