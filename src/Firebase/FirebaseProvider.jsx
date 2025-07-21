import React, { useEffect, useState } from "react";
import { FirebaseAuthContext } from "./FirebaseAuthContext";
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
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
  // for theme
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const provider = new GoogleAuthProvider();
  const gitProvider = new GithubAuthProvider();
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
  const signInWithGithub = () => {
    setLoading(true);
    return signInWithPopup(auth, gitProvider);
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
      setUser(currentUser);
      console.log("current user from auth", currentUser);
      if (currentUser) {
        const userInfo = { email: currentUser?.email };
        console.log(userInfo);
        try {
          const res = await axiosPublic.post("/create-token", userInfo);
          const data = await res?.data;
          console.log("create token response", data);
          // if(data){
          // const dbUserInfo = {
          //   userName: currentUser?.displayName,
          //   userEmail: currentUser?.email,
          //   userPhoto: currentUser?.photoURL,
          // };
          setLoading(false);
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
    signInWithGithub,
    logOut,
    userProfileUpdate,
    user,
    setUser,
    loading,
    setLoading,
    theme,
    setTheme,
    toggleTheme,
  };
  return (
    <FirebaseAuthContext.Provider value={userInfo}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export default FirebaseProvider;
