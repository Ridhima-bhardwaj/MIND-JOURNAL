
import { auth, googleProvider } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

class AuthService {
  constructor() {
    this.currentUser = null;

    // Keep Firebase user in sync
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser = {
          id: user.uid,
          email: user.email,
          name: user.displayName || user.email,
          createdAt: user.metadata.creationTime,
        };
        localStorage.setItem("auth_user", JSON.stringify(this.currentUser));
      } else {
        this.currentUser = null;
        localStorage.removeItem("auth_user");
      }
    });
  }

  /** -----------------
   * Email + Password
   * ----------------- */
  async signupWithEmail({ email, password, name }) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(result.user, { displayName: name });
      }
      this.currentUser = {
        id: result.user.uid,
        email: result.user.email,
        name: result.user.displayName || result.user.email,
        createdAt: result.user.metadata.creationTime,
      };
      localStorage.setItem("auth_user", JSON.stringify(this.currentUser));
      return this.currentUser;
    } catch (err) {
      console.error("Signup error:", err);
      throw err;
    }
  }

  async loginWithEmail({ email, password }) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      this.currentUser = {
        id: result.user.uid,
        email: result.user.email,
        name: result.user.displayName || result.user.email,
        createdAt: result.user.metadata.creationTime,
      };
      localStorage.setItem("auth_user", JSON.stringify(this.currentUser));
      return this.currentUser;
    } catch (err) {
      console.error("Email login error:", err);
      throw err;
    }
  }

  /** -----------------
   * Google
   * ----------------- */
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      this.currentUser = {
        id: result.user.uid,
        email: result.user.email,
        name: result.user.displayName || result.user.email,
        createdAt: result.user.metadata.creationTime,
      };
      localStorage.setItem("auth_user", JSON.stringify(this.currentUser));
      return this.currentUser;
    } catch (err) {
      console.error("Google login error:", err);
      throw err;
    }
  }

  /** -----------------
   * Passwordless Email Link
   * ----------------- */
  async sendLoginLink(email) {
    const actionCodeSettings = {
      url: "http://localhost:3000/", // update in production
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      return true;
    } catch (err) {
      console.error("Error sending login link:", err);
      throw err;
    }
  }

  async confirmLoginLink() {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Please provide your email");
      }
      try {
        const result = await signInWithEmailLink(auth, email, window.location.href);
        this.currentUser = {
          id: result.user.uid,
          email: result.user.email,
          name: result.user.displayName || result.user.email,
          createdAt: result.user.metadata.creationTime,
        };
        window.localStorage.removeItem("emailForSignIn");
        localStorage.setItem("auth_user", JSON.stringify(this.currentUser));
        return this.currentUser;
      } catch (err) {
        console.error("Error confirming login link:", err);
        throw err;
      }
    }
    return null;
  }

  /** -----------------
   * Logout + Utils
   * ----------------- */
  async logout() {
    await signOut(auth);
    this.currentUser = null;
    localStorage.removeItem("auth_user");
  }

  getCurrentUser() {
    if (this.currentUser) return this.currentUser;

    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
        return this.currentUser;
      } catch {
        localStorage.removeItem("auth_user");
      }
    }
    return null;
  }

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }
}

export const authService = new AuthService();
