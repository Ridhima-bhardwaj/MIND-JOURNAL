export default function JournalCard({ title, content, mood }) {
  const moodColors = {
    Happy: "text-moodHappy",
    Sad: "text-moodSad",
    Calm: "text-moodCalm",
    Angry: "text-moodAngry",
    Neutral: "text-moodNeutral",
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-card rounded-xl p-4 mb-4 transition-colors duration-300">
      <h2 className="font-heading text-lg text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mt-2">{content}</p>
      <span className={`text-sm font-semibold ${moodColors[mood]}`}>
        Mood: {mood}
      </span>
    </div>
  );
}
