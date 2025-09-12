import React, { useState } from "react";
import { useEntries } from "../hooks/useEntries";
import { moodColors, moodEmojis, moodLabels } from "../utils/mood";
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
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export function CalendarView({ onViewEntry }) {
  const { entries } = useEntries();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEntriesForDate = (date) => {
    return entries.filter((entry) => {
      const entryDate = entry.createdAt.toDate
        ? entry.createdAt.toDate()
        : new Date(entry.createdAt);
      return isSameDay(entryDate, date);
    });
  };

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
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
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 min-w-48 text-center">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dayEntries = getEntriesForDate(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toString()}
                onClick={() =>
                  dayEntries.length > 0 && onViewEntry(dayEntries[0].id)
                }
                className={`relative p-2 h-20 border rounded-lg flex flex-col items-center justify-start cursor-pointer transition
                  ${isCurrentMonth ? "border-gray-200" : "border-gray-100 opacity-40"}
                  ${isToday ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900" : "bg-white dark:bg-gray-700"}
                  ${dayEntries.length > 0 ? "hover:shadow-md" : ""}`}
              >
                {/* Date */}
                <span
                  className={`text-sm font-medium ${
                    isToday ? "text-blue-600 dark:text-blue-300" : "text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {format(day, "d")}
                </span>

                {/* Mood emoji */}
                {dayEntries.length > 0 && (
                  <div className="flex flex-col items-center mt-1">
                    <span className="text-lg">
                      {moodEmojis[dayEntries[0].mood]}
                    </span>
                    <div
                      className="w-3 h-3 rounded-full mt-1"
                      style={{ backgroundColor: moodColors[dayEntries[0].mood] }}
                    />
                  </div>
                )}

                {/* More entries counter */}
                {dayEntries.length > 1 && (
                  <span className="absolute bottom-1 text-xs text-gray-500 dark:text-gray-400">
                    +{dayEntries.length - 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
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
