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


const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const provider = new GoogleAuthProvider();
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
  const logOut = ()=>{
     setLoading(true);
    return signOut(auth)
  }
   const userProfileUpdate = (profileInfo) =>{
    return updateProfile(auth.currentUser,profileInfo)
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
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
