import React, { useEffect, useState } from "react";
import { useEntries } from "../hooks/useEntries";
import { moodColors, moodEmojis, moodLabels } from "../utils/mood";

export function ViewEntry({ entryId, onBack, onEdit }) {
  const { getEntryById, deleteEntry } = useEntries();
  const [entry, setEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const data = await getEntryById(entryId);
        setEntry(data);
      } catch (err) {
        console.error("Error loading entry:", err);
        setEntry(null);
      } finally {
        setIsLoading(false);
      }
    };
    if (entryId) fetchEntry();
  }, [entryId, getEntryById]);

  const handleDelete = async () => {
    if (window.confirm("Delete this entry?")) {
      try {
        await deleteEntry(entryId);
        onBack();
      } catch (err) {
        alert("Failed to delete entry");
        console.error(err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-6 w-6 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  if (!entry) {
    return (
      <p className="p-6 text-gray-600 dark:text-gray-400">Entry not found.</p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow p-8 transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {entry.title || "Untitled Entry"}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        {entry.createdAt
          ? new Date(
              entry.createdAt.toDate ? entry.createdAt.toDate() : entry.createdAt
            ).toLocaleString()
          : "Unknown date"}
      </p>
      <p className="text-lg text-gray-800 dark:text-gray-200 whitespace-pre-line">
        {entry.content}
      </p>

      {entry.mood && (
        <div className="mt-6 flex items-center space-x-3">
          <span
            className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {moodEmojis[entry.mood]} {moodLabels[entry.mood] || "No mood"}
          </span>
        </div>
      )}

      <div className="mt-8 flex space-x-4">
        <button
          onClick={() => onEdit(entry.id)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Delete
        </button>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
        >
          Back
        </button>
      </div>
    </div>
  );
}
