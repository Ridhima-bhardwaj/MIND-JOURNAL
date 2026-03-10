import React from "react";
import { useAuthContext } from "../hooks/AuthProvider";

function Navbar() {
  const { user, logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Extract a clean name from email if displayName not available
  const getUserName = () => {
    if (user?.displayName) return user.displayName;

    if (user?.email) {
      const emailName = user.email.split("@")[0];

      // Convert something like dv.ridhimabhardwaj31 -> Ridhima Bhardwaj
      const cleaned = emailName
        .replace(/[0-9]/g, "") // remove numbers
        .replace(/^[a-z]+\./, "") // remove prefix like dv.
        .replace(/([a-z])([A-Z])/g, "$1 $2");

      return cleaned
        .split(/[\.\-_]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    return "User";
  };

  const userName = getUserName();

  // Initial for avatar
  const initial = userName.charAt(0).toUpperCase();

  return (
    <nav className="navbar w-full shadow-md p-4 flex justify-between items-center bg-white dark:bg-gray-800 transition-colors">

      {/* Logo */}
      <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
        MindJournal
      </h1>

      {user && (
        <div className="flex items-center gap-4">

          {/* Avatar */}
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border hover:ring-2 hover:ring-blue-400 transition"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold hover:ring-2 hover:ring-blue-400 transition">
              {initial}
            </div>
          )}

          {/* Greeting */}
          <span className="text-gray-700 dark:text-gray-200">
            Hello, {userName}
          </span>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
          >
            Logout
          </button>

        </div>
      )}
    </nav>
  );
}

export default Navbar;