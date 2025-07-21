import React, { useContext } from "react";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";

const AdminProfile = () => {
  const { user } = useContext(FirebaseAuthContext);
  console.log(user);
  return (
    <div>
      <h1>My user Profile is {user?.email}</h1>
      <div className="border-1">
        <img src={user?.photoURL} alt="No image" />
      </div>
      <h1>Kallol</h1>
    </div>
  );
};

export default AdminProfile;
