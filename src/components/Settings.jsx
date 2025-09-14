import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Trash2,
  Download,
  Moon,
  Sun,
} from "lucide-react";
import { db } from "../utils/firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

export function Settings() {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState("20:00");
  const [loadingPrefs, setLoadingPrefs] = useState(true);

  // ✅ Load preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      try {
        const prefsRef = doc(db, "userPreferences", user.uid);
        const prefsSnap = await getDoc(prefsRef);
        if (prefsSnap.exists()) {
          const data = prefsSnap.data();
          setNotifications(data.notifications ?? true);
          setDailyReminder(data.dailyReminder ?? "20:00");
          setDarkMode(data.darkMode ?? false);

          // Apply dark mode globally
          if (data.darkMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      } catch (err) {
        console.error("Failed to load preferences", err);
      } finally {
        setLoadingPrefs(false);
      }
    };
    loadPreferences();
  }, [user]);

  // ✅ Save preferences
  const savePreferences = async (updates) => {
    if (!user) return;
    try {
      const prefsRef = doc(db, "userPreferences", user.uid);
      await setDoc(prefsRef, updates, { merge: true });
    } catch (err) {
      console.error("Failed to save preferences", err);
    }
  };

  // Handlers
  const handleNotificationToggle = (value) => {
    setNotifications(value);
    savePreferences({ notifications: value });
  };

  const handleReminderChange = (value) => {
    setDailyReminder(value);
    savePreferences({ dailyReminder: value });
  };

  const handleDarkModeToggle = (value) => {
    setDarkMode(value);
    savePreferences({ darkMode: value });

    if (value) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleExportData = () => {
    const data = {
      user: user,
      exportDate: new Date().toISOString(),
      entries: JSON.parse(localStorage.getItem("journal_entries") || "[]"),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mindjournal-export-${new Date()
      .toISOString()
      .split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all your journal data? This action cannot be undone."
      )
    ) {
      localStorage.removeItem("journal_entries");
      window.location.reload();
    }
  };

  const handleDeleteAccount = async () => {
    const confirmText = "delete my account";
    const userInput = prompt(
      `Type "${confirmText}" to confirm account deletion:`
    );

    if (userInput === confirmText && user) {
      try {
        await deleteDoc(doc(db, "userPreferences", user.uid));
        localStorage.clear();
        logout();
        alert("Your account and preferences were deleted.");
      } catch (err) {
        console.error("Failed to delete account data", err);
        alert("Something went wrong while deleting your account data.");
      }
    }
  };

  if (loadingPrefs) {
    return <div className="p-8 text-center">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-colors">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account and preferences
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Notifications */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2" /> Notifications
            </h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Daily Reminders
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Get reminded to write in your journal
                  </p>
                </div>

                {/* ✅ Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => handleNotificationToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div
                    className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-600
                    peer-checked:bg-blue-600
                    after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                    after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border
                    after:rounded-full after:h-5 after:w-5 after:transition-all
                    peer-checked:after:translate-x-5"
                  ></div>
                </label>
              </div>

              {notifications && (
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="reminder-time"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Reminder time:
                  </label>
                  <input
                    id="reminder-time"
                    type="time"
                    value={dailyReminder}
                    onChange={(e) => handleReminderChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Appearance */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              {darkMode ? (
                <Moon className="w-5 h-5 mr-2" />
              ) : (
                <Sun className="w-5 h-5 mr-2" />
              )}
              Appearance
            </h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Dark Mode
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Switch to dark theme for better night reading
                  </p>
                </div>

                {/* ✅ Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={(e) => handleDarkModeToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div
                    className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-600
                    peer-checked:bg-blue-600
                    after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                    after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border
                    after:rounded-full after:h-5 after:w-5 after:transition-all
                    peer-checked:after:translate-x-5"
                  ></div>
                </label>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" /> Data Management
            </h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 space-y-4 transition-colors">
              <button
                onClick={handleExportData}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Download className="w-4 h-4 mr-2" /> Export My Data
              </button>
              <button
                onClick={handleClearData}
                className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Clear Journal Data
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
