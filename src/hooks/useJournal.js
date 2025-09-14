import { useState, useEffect } from "react";
import { analyzeMood, generateCopingSuggestion } from "../utils/mood";

// Mock data for demonstration
const mockEntries = [
  {
    id: "1",
    userId: "1",
    title: "A Great Day",
    content:
      "Today was absolutely wonderful! I had lunch with friends, got promoted at work, and felt incredibly happy and grateful for everything in my life.",
    mood: "very-happy",
    tags: ["work", "friends", "gratitude"],
    aiSummary:
      "A very positive day with career success and social connections bringing joy.",
    copingSuggestion:
      "Share your positive energy! Consider reaching out to a friend or doing something kind for others.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    userId: "1",
    title: "Feeling Anxious",
    content:
      "I have this presentation tomorrow and I cannot stop worrying about it. My mind keeps racing with all the things that could go wrong.",
    mood: "anxious",
    tags: ["work", "presentation", "worry"],
    aiSummary:
      "Experiencing anticipatory anxiety about an upcoming work presentation.",
    copingSuggestion:
      "For anxiety, try the 4-7-8 breathing technique: breathe in for 4, hold for 7, exhale for 8. Grounding exercises can also help.",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
  },
];

export function useJournal() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const stored = localStorage.getItem("journal_entries");
      if (stored) {
        const parsedEntries = JSON.parse(stored).map((entry) => ({
          ...entry,
          createdAt: new Date(entry.createdAt),
          updatedAt: new Date(entry.updatedAt),
        }));
        setEntries(parsedEntries);
      } else {
        setEntries(mockEntries);
        localStorage.setItem("journal_entries", JSON.stringify(mockEntries));
      }
      setIsLoading(false);
    }, 500);
  }, []);

  const saveEntry = (entryData) => {
    const mood = analyzeMood(entryData.content || "");
    const copingSuggestion = generateCopingSuggestion(mood);

    const entry = {
      id: entryData.id || Math.random().toString(36).substr(2, 9),
      userId: "1", // TODO: replace with actual logged-in user
      title: entryData.title || "",
      content: entryData.content || "",
      mood,
      tags: entryData.tags || [],
      aiSummary: `Entry about ${mood.replace("-", " ")} feelings`,
      copingSuggestion,
      createdAt: entryData.createdAt ? new Date(entryData.createdAt) : new Date(),
      updatedAt: new Date(),
    };

    const updatedEntries = entryData.id
      ? entries.map((e) => (e.id === entryData.id ? entry : e))
      : [entry, ...entries];

    setEntries(updatedEntries);
    localStorage.setItem("journal_entries", JSON.stringify(updatedEntries));

    return entry; // ✅ always return the final entry
  };

  const deleteEntry = (id) => {
    const updatedEntries = entries.filter((e) => e.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem("journal_entries", JSON.stringify(updatedEntries));
  };

  const getEntry = (id) => {
    return entries.find((e) => e.id === id);
  };

  return {
    entries,
    isLoading,
    saveEntry,
    deleteEntry,
    getEntry,
  };
}
