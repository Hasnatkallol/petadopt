import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import useAdmin from "../Hooks/useAdmin";
import { FirebaseAuthContext } from "../Firebase/FirebaseAuthContext";

const AdminRoute = ({ children }) => {
  const [isAdmin, isPending] = useAdmin();
  const {  loading } = useContext(FirebaseAuthContext);

  if (isPending || loading) {
    return <p>Loading</p>;
  }
  console.log("my profile", isPending, isAdmin);

  if (!isAdmin) {
    return <Navigate to="/dashboard/myProfile" replace />;
  }

  // Render the children inside PrivateRoute which handles auth
  return <PrivateRoute>{children}</PrivateRoute>;
};

export default AdminRoute;
