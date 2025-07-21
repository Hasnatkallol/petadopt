import React, { useContext } from "react";
import { FirebaseAuthContext } from "../../../Firebase/FirebaseAuthContext";

const AllPets = () => {
  const { user } = useContext(FirebaseAuthContext);
  return (
    <div>
      <img src={user?.photoURL} alt="" />
      <h1>All Pets</h1>
      <h1>All Pets</h1>
      <h1>All Pets</h1>
      <h1>All Pets</h1>
      <h1>All Pets</h1>
    </div>
  );
};

export default AllPets;
