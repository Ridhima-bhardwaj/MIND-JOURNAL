
import { useState, useEffect } from "react";
import { auth, googleProvider } from "../utils/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  isSignInWithEmailLink,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Email/password login
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  // Email/password signup
  const signup = async (email, password, name) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(result.user, { displayName: name });
    }
    return result.user;
  };

  // Google login
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  // Send passwordless login link
  const sendMagicLink = async (email) => {
    const actionCodeSettings = {
      url: window.location.origin, // Redirect back to app
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem("emailForSignIn", email);
    alert("Check your email for the login link!");
  };

  // Complete magic link login
  const completeMagicLinkSignIn = async () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Please provide your email");
      }
      const result = await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem("emailForSignIn");
      return result.user;
    }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    signup,
    logout,
    loginWithGoogle,
    sendMagicLink,
    completeMagicLinkSignIn,
  };
}
