import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  limit,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAuthContext } from "./AuthProvider";

export function useEntries() {
  const { user } = useAuthContext();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Real-time listener
  useEffect(() => {
    if (!user) {
      setEntries([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    const q = query(
      collection(db, "entries"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEntries(data);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching entries:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Add entry
  const addEntry = async (entry) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const docRef = await addDoc(collection(db, "entries"), {
        ...entry,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error("Error adding entry:", error);
      throw error;
    }
  };

  // Update entry
  const updateEntry = async (id, updatedData) => {
    try {
      const entryRef = doc(db, "entries", id);

      await updateDoc(entryRef, {
        ...updatedData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating entry:", error);
      throw error;
    }
  };

  // Delete entry
  const deleteEntry = async (id) => {
    try {
      await deleteDoc(doc(db, "entries", id));
    } catch (error) {
      console.error("Error deleting entry:", error);
      throw error;
    }
  };

  // Get entry by ID
  const getEntryById = async (id) => {
    try {
      const ref = doc(db, "entries", id);
      const snapshot = await getDoc(ref);

      return snapshot.exists()
        ? { id: snapshot.id, ...snapshot.data() }
        : null;
    } catch (error) {
      console.error("Error fetching entry:", error);
      return null;
    }
  };

  return {
    entries,
    isLoading,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntryById,
  };
}
