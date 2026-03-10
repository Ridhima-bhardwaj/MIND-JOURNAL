import React from 'react';
import { useAuthContext } from '../hooks/AuthProvider';
import { Settings, Calendar, Home, PenTool, LogOut } from 'lucide-react';

export function Layout({ children, currentPage = 'dashboard', onNavigate }) {
const { user, logout } = useAuthContext();

const navItems = [
{ id: 'dashboard', label: 'Dashboard', icon: Home },
{ id: 'write', label: 'Write Entry', icon: PenTool },
{ id: 'calendar', label: 'Calendar', icon: Calendar },
{ id: 'settings', label: 'Settings', icon: Settings },
];

// Extract proper name
const getUserName = () => {
if (user?.displayName) return user.displayName;

```
if (user?.email) {
  const emailName = user.email.split("@")[0];

  const cleaned = emailName
    .replace(/[0-9]/g, "")
    .replace(/^[a-z]+\./, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2");

  return cleaned
    .split(/[\.\-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

return "User";
```

};

const userName = getUserName();
const initial = userName.charAt(0).toUpperCase();

return ( <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-300">

```
  {/* Navbar */}
  <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="flex justify-between items-center h-16">

        {/* Logo + Nav Links */}
        <div className="flex items-center space-x-8">

          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            MindJournal
          </h1>

          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-4">

          <div className="flex items-center space-x-3">

            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border hover:ring-2 hover:ring-blue-400 transition"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white flex items-center justify-center font-semibold hover:ring-2 hover:ring-blue-400 transition">
                {initial}
              </div>
            )}

            <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
              {userName}
            </span>

          </div>

          <button
            onClick={logout}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <LogOut size={16} />
            <span className="hidden md:block">Logout</span>
          </button>

        </div>

      </div>

    </div>

    {/* Mobile Navigation */}
    <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md transition-colors duration-300">

      <div className="flex justify-around py-2">

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}

      </div>

    </div>

  </nav>

  {/* Main Content */}
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
    {children}
  </main>

</div>


);
}
