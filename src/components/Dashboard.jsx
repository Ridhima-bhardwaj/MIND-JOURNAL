import React from "react";
import { useEntries } from "../hooks/useEntries";
import { useAuthContext } from "../hooks/AuthProvider";
import { moodColors, moodEmojis, moodLabels } from "../utils/mood";
import { PenTool, TrendingUp, Calendar, Heart } from "lucide-react";
import { format, subDays } from "date-fns";

/* Greeting based on time */
const getGreeting = () => {
const hour = new Date().getHours();

if (hour < 12) return "Good Morning ☀️";
if (hour < 18) return "Good Afternoon 🌤";
return "Good Evening 🌙";
};

/* Extract name from user */
const getUserName = (user) => {
if (user?.displayName) return user.displayName;
if (user?.name) return user.name;

if (user?.email) {
return user.email.split("@")[0];
}

return "User";
};

export function Dashboard({ onNavigate }) {
const { user } = useAuthContext();
const { entries, isLoading } = useEntries(user?.uid);

if (isLoading) {
return ( <div className="flex items-center justify-center min-h-64"> <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div> </div>
);
}

const recentEntries = entries.slice(0, 5);

const last7Days = Array.from({ length: 7 }, (_, i) => {
const date = subDays(new Date(), i);

const dayEntries = entries.filter(
  (entry) =>
    format(
      entry.createdAt?.toDate
        ? entry.createdAt.toDate()
        : entry.createdAt,
      "yyyy-MM-dd"
    ) === format(date, "yyyy-MM-dd")
);

return {
  date: format(date, "MMM dd"),
  mood: dayEntries[0]?.mood || null,
  count: dayEntries.length,
};

}).reverse();

```
const dayEntries = entries.filter(
  (entry) =>
    format(
      entry.createdAt?.toDate
        ? entry.createdAt.toDate()
        : entry.createdAt,
      "yyyy-MM-dd"
    ) === format(date, "yyyy-MM-dd")
);

return {
  date: format(date, "MMM dd"),
  mood: dayEntries[0]?.mood || null,
  count: dayEntries.length,
};
```

}reverse();

const moodCharacter = entries.length > 0 ? entries[0].mood : "neutral";

const copingTips = [
"Take three deep breaths and focus on the present moment.",
"Try a 5-minute mindfulness meditation.",
"Write down three things you're grateful for today.",
"Go for a short walk in nature or fresh air.",
"Listen to your favorite calming music.",
];

const randomTip = copingTips[Math.floor(Math.random() * copingTips.length)];

return (
  <div className="space-y-8">
    {/* Welcome Section */}

```
  {/* Welcome Section */}
  <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-teal-600 dark:from-blue-700 dark:via-blue-800 dark:to-teal-700 rounded-2xl p-8 text-white transition-colors">

    <div className="flex items-center justify-between flex-wrap gap-6">

      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}, {getUserName(user)}!
        </h1>

        <p className="text-blue-100 dark:text-blue-200 mb-6">
          Today is {format(new Date(), "EEEE, MMMM do, yyyy")}
        </p>

        <div className="flex items-center space-x-4">
          <div className="text-4xl">
            {moodEmojis[moodCharacter] || "🙂"}
          </div>

          <div>
            <p className="text-sm text-blue-100 dark:text-blue-200">
              Your mood character is feeling
            </p>

            <p className="text-lg font-medium">
              {moodLabels[moodCharacter] || "Neutral"}
            </p>
          </div>
        </div>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center">

        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="profile"
            className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-white text-blue-600 flex items-center justify-center text-xl font-bold shadow-lg">
            {getUserName(user).charAt(0).toUpperCase()}
          </div>
        )}

        <p className="text-sm mt-2 text-blue-100">
          {getUserName(user)}
        </p>

      </div>
    </div>
  </div>

  {/* Rest of dashboard remains exactly same */}

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

    {/* Quick Actions + Recent Entries */}
    <div className="lg:col-span-2 space-y-6">

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <button
            onClick={() => onNavigate("write")}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 rounded-lg hover:from-blue-100 hover:to-teal-100 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <PenTool className="w-5 h-5 text-white" />
            </div>

            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                New Entry
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Write about your day
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate("calendar")}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-teal-50 to-green-50 dark:from-gray-700 dark:to-gray-600 rounded-lg hover:from-teal-100 hover:to-green-100 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-colors"
          >
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>

            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                Calendar View
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                See your mood history
              </p>
            </div>
          </button>

        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Recent Entries
        </h2>
        {recentEntries.length > 0 ? (
          <div className="space-y-4">
            {recentEntries.map((entry) => (
              <div key={entry.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {format(entry.createdAt?.toDate ? entry.createdAt.toDate() : entry.createdAt, "MMM dd, yyyy")}
                </p>
                <p className="text-gray-900 dark:text-gray-100 mt-2">{entry.content.substring(0, 100)}...</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No entries yet. Start journaling today!</p>
        )}
      </div>
    </div>

    {/* Sidebar */}
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
          <Heart className="w-5 h-5 text-red-500" />
          <span>Wellness Tip</span>
        </h2>
        <p className="text-gray-700 dark:text-gray-300">{randomTip}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <span>Mood Trend</span>
        </h2>
        <div className="flex space-x-2">
          {last7Days.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-2xl">{day.mood ? moodEmojis[day.mood] : "⚪"}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{day.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  </div>
  );
