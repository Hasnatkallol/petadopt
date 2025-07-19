import React, { useContext } from "react";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";

const MyProfile = () => {
    const {user} = useContext(FirebaseAuthContext)
    console.log(user)
  return (
    <div>
      <h1>My user Profile {user?.email}</h1>
      <img src={user?.photoURL} alt="" />
      <h1>Kallol</h1>
    </div>
  );
};

export default MyProfile;
