import React, { useContext } from "react";
import { FirebaseAuthContext } from "../Firebase/FirebaseAuthContext";
import { Navigate, useLocation } from "react-router";
import Loading from "../Shared/Loading";

const PrivateRoute = ({ children }) => {
  const { user,loading } = useContext(FirebaseAuthContext);
  const location = useLocation();
  console.log(location);
  
  if(loading){
    return <Loading></Loading>
  }
  if (!user) {
    return <Navigate state={location?.pathname} to='/login'></Navigate>
  }
  return children;
};

export default PrivateRoute;
