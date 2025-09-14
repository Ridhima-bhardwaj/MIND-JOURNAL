import React, { useState, useEffect } from "react";
import { useEntries } from "../hooks/useEntries";
import { useAuthContext } from "../hooks/AuthProvider";
import { moodEmojis, moodLabels } from "../utils/mood";

export function WriteEntry({ entryId, onBack, onSaved }) {
  const { addEntry, updateEntry, getEntryById } = useEntries();
  const { user } = useAuthContext();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (entryId) {
      const fetchEntry = async () => {
        const entry = await getEntryById(entryId);
        if (entry) {
          setTitle(entry.title || "");
          setContent(entry.content || "");
          setMood(entry.mood || "neutral");
        }
      };
      fetchEntry();
    }
  }, [entryId, getEntryById]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (entryId) {
        await updateEntry(entryId, { title, content, mood });
        onSaved(entryId);
      } else {
        const newId = await addEntry({
          title,
          content,
          mood,
          createdAt: new Date(),
          userId: user.uid,
        });
        onSaved(newId);
      }
    } catch (err) {
      console.error("Error saving entry:", err);
      alert("Failed to save entry");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow p-8 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        {entryId ? "Edit Entry" : "New Journal Entry"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Entry Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 
                     text-gray-900 dark:text-gray-100"
        />

        <textarea
          placeholder="Write your thoughts here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg h-64 
                     focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 
                     text-gray-900 dark:text-gray-100"
        />

        {/* Mood Selector */}
        <div className="flex items-center flex-wrap gap-3">
          {Object.keys(moodLabels).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(m)} // 🔹 kebab-case mood keys
              className={`px-4 py-2 rounded-lg border transition-colors ${
                mood === m
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {moodEmojis[m]} {moodLabels[m]}
            </button>
          ))}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isLoading ? "Saving..." : entryId ? "Update Entry" : "Save Entry"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
