
import React, { useState, useEffect } from "react";
import { useAuthContext } from "./hooks/AuthProvider";
import { LoginForm } from "./components/LoginForm";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { WriteEntry } from "./components/WriteEntry";
import { ViewEntry } from "./components/ViewEntry";
import { CalendarView } from "./components/CalendarView";
import { Settings } from "./components/Settings";
import Navbar from "./components/navbar";
import JournalCard from "./components/JournalCard";
import MoodSelector from "./components/MoodSelector";
import { useEntries } from "./hooks/useEntries";

function App() {
  const { user, isLoading, completeMagicLinkSignIn } = useAuthContext();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [currentEntryId, setCurrentEntryId] = useState(null);

  // 🔥 Track dark mode globally
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Apply dark mode to <html> tag
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Pass userId into hook
  const { entries, loading, addEntry, updateEntry, deleteEntry } = useEntries(user?.uid);

  // Navigation
  const handleNavigation = (page, entryId = null) => {
    setCurrentPage(page);
    setCurrentEntryId(entryId);
  };

  const handleEntrySaved = (entryId) => {
    setCurrentPage("entry");
    setCurrentEntryId(entryId);
  };

  const handleLoginSuccess = () => {
    setCurrentPage("dashboard");
  };

  // Handle magic link redirect
  useEffect(() => {
    completeMagicLinkSignIn?.();
  }, [completeMagicLinkSignIn]);

  // Loader while auth initializes
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Login form
  if (!user) {
    return <LoginForm onSuccess={handleLoginSuccess} />;
  }

  // Main layout
  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigation}>
      <Navbar />

      {currentPage === "dashboard" && (
        <div className="max-w-2xl mx-auto p-6">
          <Dashboard onNavigate={handleNavigation} entries={entries} />

          <JournalCard
            title="Day 1"
            content="Started building my AI Journal App 🚀"
            mood="Happy"
          />
          <MoodSelector onSelect={(mood) => alert(`Mood selected: ${mood}`)} />
        </div>
      )}

      {currentPage === "write" && (
        <WriteEntry
          entryId={currentEntryId}
          onBack={() => setCurrentPage("dashboard")}
          onSaved={handleEntrySaved}
          addEntry={addEntry}
          updateEntry={updateEntry}
        />
      )}

      {currentPage === "entry" && currentEntryId && (
        <ViewEntry
          entryId={currentEntryId}
          onBack={() => setCurrentPage("dashboard")}
          onEdit={(entryId) => {
            setCurrentEntryId(entryId);
            setCurrentPage("write");
          }}
          deleteEntry={deleteEntry}
        />
      )}

      {currentPage === "calendar" && (
        <CalendarView
          entries={entries}
          onViewEntry={(entryId) => {
            setCurrentEntryId(entryId);
            setCurrentPage("entry");
          }}
        />
      )}

      {currentPage === "settings" && (
        <Settings darkMode={darkMode} setDarkMode={setDarkMode} />
      )}
    </Layout>
  );
}

export default App;
