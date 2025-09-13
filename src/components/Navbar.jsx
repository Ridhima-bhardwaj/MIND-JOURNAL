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

  return (
    <nav className="navbar w-full shadow-md p-4 flex justify-between items-center bg-white dark:bg-gray-800 transition-colors">
      <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
        MindJournal
      </h1>

      {user && (
        <div className="flex items-center gap-4">
          <span className="text-gray-700 dark:text-gray-200">
            Hello, {user.displayName || user.email}
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
