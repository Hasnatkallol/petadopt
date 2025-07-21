import React from "react";
import { Navigate } from "react-router-dom";
import useAdmin from "../../Hooks/useAdmin";


const DashboardHomeRedirect = () => {
  const [isAdmin] = useAdmin();

  if (isAdmin) {
    return <Navigate to="/dashboard/adminProfile" replace />;
  }

  return <Navigate to="/dashboard/myProfile" replace />;
};

export default DashboardHomeRedirect;
