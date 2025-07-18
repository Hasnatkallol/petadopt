import React, { useEffect, useState } from "react";
import { FirebaseAuthContext } from "./FirebaseAuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase.init";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import Swal from "sweetalert2";

const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const provider = new GoogleAuthProvider();
  const axiosPublic = useAxiosPublic();
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const emailLogin = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };
  const userProfileUpdate = (profileInfo) => {
    return updateProfile(auth.currentUser, profileInfo);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
     setUser(currentUser)
     console.log('current user from auth',currentUser)
      if (currentUser) {

        const userInfo = { email: currentUser?.email };
        console.log(userInfo);
        try {
          const res = await axiosPublic.post("/create-token", userInfo);
          const data = await res?.data;
          console.log('create token response',data)
          // if(data){
          // const dbUserInfo = {
          //   userName: currentUser?.displayName,
          //   userEmail: currentUser?.email,
          //   userPhoto: currentUser?.photoURL,
          // };

          // try {
          //   const res = await axiosPublic.post("/users", dbUserInfo);
          //   const data = await res?.data;

          //   if (data.insertedId) {
          //     Swal.fire({
          //       title: "Account Created Successfully!",
          //       icon: "success",
          //       draggable: true,
          //     });
          //     setLoading(false);
          //   }
          //   if (data?.message) {
          //     Swal.fire({
          //       title: "Signin your account successfully",
          //       icon: "success",
          //       draggable: true,
          //     });
          //     setLoading(false);
          //   }
          // } catch (err) {
          //   console.error(err);
          // }
          // }
        } catch (err) {
          console.error(err);
        }
      } else {
        try {
          const res = await axiosPublic.post("/logout");
          const data = await res?.data;

          if (data.success) {
            setLoading(false);
          }
        } catch (err) {
          console.error(err);
        }
      }

      // setUser(currentUser);
      // setLoading(false);
    });

    return () => unsubscribe();
  }, [axiosPublic]);
  const userInfo = {
    createUser,
    emailLogin,
    signInWithGoogle,
    logOut,
    userProfileUpdate,
    user,
    setUser,
    loading,
    setLoading,
  };
  return (
    <FirebaseAuthContext.Provider value={userInfo}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export default FirebaseProvider;
