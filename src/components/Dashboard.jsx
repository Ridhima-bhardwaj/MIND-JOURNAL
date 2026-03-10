import React from "react";
import { useEntries } from "../hooks/useEntries";
import { useAuthContext } from "../hooks/AuthProvider";
import { moodColors, moodEmojis, moodLabels } from "../utils/mood";
import { PenTool, TrendingUp, Calendar, Heart } from "lucide-react";
import { format, subDays } from "date-fns";

export function Dashboard({ onNavigate }) {
  const { user } = useAuthContext();
  const { entries, isLoading } = useEntries(user?.uid);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning ☀️";
    if (hour < 18) return "Good Afternoon 🌤";
    return "Good Evening 🌙";
  };

  const getUserName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.name) return user.name;

    if (user?.email) {
      const name = user.email.split("@")[0];
      return name
        .replace(/[0-9]/g, "")
        .replace(".", " ")
        .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
    }

    return "User";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const recentEntries = entries.slice(0, 5);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);

    const dayEntries = entries.filter((entry) => {
      const entryDate = entry.createdAt?.toDate
        ? entry.createdAt.toDate()
        : entry.createdAt;

      return (
        format(entryDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      );
    });

    return {
      date: format(date, "MMM dd"),
      mood: dayEntries[0]?.mood || null,
      count: dayEntries.length,
    };
  }).reverse();

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
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-teal-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}, {getUserName()}!
        </h1>

        <p className="text-blue-100 mb-6">
          Today is {format(new Date(), "EEEE, MMMM do, yyyy")}
        </p>

        <div className="flex items-center space-x-4">
          <div className="text-4xl">{moodEmojis[moodCharacter] || "🙂"}</div>

          <div>
            <p className="text-sm text-blue-100">
              Your mood character is feeling
            </p>

            <p className="text-lg font-medium">
              {moodLabels[moodCharacter] || "Neutral"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Side */}
        <div className="lg:col-span-2 space-y-6">

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <button
                onClick={() => onNavigate("write")}
                className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <PenTool className="w-5 h-5 text-white" />
                </div>

                <div className="text-left">
                  <p className="font-medium">New Entry</p>
                  <p className="text-sm text-gray-600">
                    Write about your day
                  </p>
                </div>
              </button>

              <button
                onClick={() => onNavigate("calendar")}
                className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>

                <div className="text-left">
                  <p className="font-medium">Calendar View</p>
                  <p className="text-sm text-gray-600">
                    See your mood history
                  </p>
                </div>
              </button>

            </div>
          </div>

          {/* Recent Entries */}
          <div className="bg-white rounded-xl shadow-sm border p-6">

            <h2 className="text-xl font-semibold mb-4">
              Recent Entries
            </h2>

            {recentEntries.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />

                <p className="text-gray-500">
                  No entries yet. Start your journey!
                </p>

                <button
                  onClick={() => onNavigate("write")}
                  className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Write Your First Entry
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentEntries.map((entry) => {

                  const mood = entry.mood || "neutral";

                  return (
                    <div
                      key={entry.id}
                      onClick={() => onNavigate("entry", entry.id)}
                      className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >

                      <div
                        className="w-3 h-3 rounded-full mt-2"
                        style={{ backgroundColor: moodColors[mood] }}
                      />

                      <div className="flex-1">

                        <h3 className="font-medium truncate">
                          {entry.title || "Untitled Entry"}
                        </h3>

                        <p className="text-sm text-gray-600 truncate mt-1">
                          {entry.content
                            ? entry.content.substring(0, 100) + "..."
                            : "No content yet"}
                        </p>

                        <div className="flex items-center space-x-4 mt-2">

                          <span className="text-xs text-gray-500">
                            {format(
                              entry.createdAt?.toDate
                                ? entry.createdAt.toDate()
                                : entry.createdAt,
                              "MMM dd, yyyy"
                            )}
                          </span>

                          <span
                            className="text-xs font-medium"
                            style={{ color: moodColors[mood] }}
                          >
                            {moodEmojis[mood]} {moodLabels[mood]}
                          </span>

                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">

          {/* Mood Trend */}
          <div className="bg-white rounded-xl shadow-sm border p-6">

            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
              7-Day Mood Trend
            </h3>

            <div className="space-y-3">
              {last7Days.map((day, index) => (
                <div key={index} className="flex justify-between">

                  <span className="text-sm text-gray-600">
                    {day.date}
                  </span>

                  {day.mood ? (
                    <span>{moodEmojis[day.mood]}</span>
                  ) : (
                    <span className="text-gray-300">•</span>
                  )}

                </div>
              ))}
            </div>

          </div>

          {/* Daily Tip */}
          <div className="bg-yellow-50 rounded-xl p-6 border">

            <h3 className="text-lg font-semibold mb-3">
              💡 Daily Coping Tip
            </h3>

            <p className="text-sm text-gray-700">
              {randomTip}
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}