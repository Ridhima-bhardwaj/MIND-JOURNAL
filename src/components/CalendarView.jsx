import React, { useState } from "react";
import { useEntries } from "../hooks/useEntries";
import { moodColors, moodEmojis, moodLabels } from "../utils/mood";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns";

export function CalendarView({ onViewEntry }) {
  const { entries } = useEntries();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEntriesForDate = (date) => {
    return entries.filter((entry) => {
      const entryDate = entry.createdAt?.toDate
        ? entry.createdAt.toDate()
        : new Date(entry.createdAt);
      return isSameDay(entryDate, date);
    });
  };

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Mood Calendar
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your emotional journey over time
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={previousMonth}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 min-w-48 text-center">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dayEntries = getEntriesForDate(day);
            const primaryMood = dayEntries[0]?.mood;
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <div
                key={day.toString()}
                className={`relative p-3 min-h-20 border rounded-lg transition-all duration-200 cursor-pointer
                  ${isCurrentMonth ? "border-gray-200 dark:border-gray-700" : "opacity-50"}
                  hover:shadow-md hover:scale-105
                `}
                onClick={() =>
                  dayEntries.length > 0 && onViewEntry(dayEntries[0].id)
                }
              >
                {/* Date */}
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {format(day, "d")}
                </div>

                {/* Mood Display */}
                {primaryMood && (
                  <div className="flex flex-col items-center mt-2">
                    <span className="text-lg">
                      {moodEmojis[primaryMood]}
                    </span>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: moodColors[primaryMood] || "#9CA3AF",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
            Mood Legend
          </h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(moodColors).map(([mood, color]) => (
              <div key={mood} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {moodEmojis[mood]} {moodLabels[mood]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
