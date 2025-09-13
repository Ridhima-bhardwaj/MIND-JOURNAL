import React from "react";
import { useEntries } from "../hooks/useEntries";
import { useAuthContext } from "../hooks/AuthProvider";
import { moodColors, moodEmojis, moodLabels } from "../utils/mood";
import { PenTool, TrendingUp, Calendar, Heart } from "lucide-react";
import { format, subDays } from "date-fns";

export function Dashboard({ onNavigate }) {
  const { user } = useAuthContext();
  const { entries, isLoading } = useEntries(user?.uid);

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
    const dayEntries = entries.filter(
      (entry) =>
        format(
          entry.createdAt.toDate ? entry.createdAt.toDate() : entry.createdAt,
          "yyyy-MM-dd"
        ) === format(date, "yyyy-MM-dd")
    );
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
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-teal-600 dark:from-blue-700 dark:via-blue-800 dark:to-teal-700 rounded-2xl p-8 text-white transition-colors">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || user?.email}!
        </h1>
        <p className="text-blue-100 dark:text-blue-200 mb-6">
          Today is {format(new Date(), "EEEE, MMMM do, yyyy")}
        </p>
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{moodEmojis[moodCharacter] || "🙂"}</div>
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
            {recentEntries.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
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
                      className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <div
                        className="w-3 h-3 rounded-full mt-2"
                        style={{ backgroundColor: moodColors[mood] }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {entry.title || "Untitled Entry"}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                          {entry.content
                            ? entry.content.substring(0, 100) + "..."
                            : "No content yet"}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {format(
                              entry.createdAt.toDate
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mood Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
              7-Day Mood Trend
            </h3>
            <div className="space-y-3">
              {last7Days.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {day.date}
                  </span>
                  <div className="flex items-center space-x-2">
                    {day.mood ? (
                      <>
                        <span className="text-lg">{moodEmojis[day.mood]}</span>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: moodColors[day.mood] }}
                        />
                      </>
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coping Tip */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border border-yellow-100 dark:border-gray-700 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              💡 Daily Coping Tip
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {randomTip}
            </p>
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Your Progress
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Entries
                </span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {entries.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  This Week
                </span>
                <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                  {last7Days.filter((day) => day.count > 0).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
