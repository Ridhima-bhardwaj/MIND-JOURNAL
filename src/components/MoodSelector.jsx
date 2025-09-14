import { moodEmojis } from "../utils/mood";

export default function MoodSelector({ onSelect, selectedMood }) {
  const moods = [
    { label: "Happy", color: "bg-moodHappy" },
    { label: "Sad", color: "bg-moodSad" },
    { label: "Calm", color: "bg-moodCalm" },
    { label: "Angry", color: "bg-moodAngry" },
    { label: "Neutral", color: "bg-moodNeutral" },
  ];

  return (
    <div className="flex gap-3 mt-4 flex-wrap">
      {moods.map((m) => (
        <button
          key={m.label}
          onClick={() => onSelect(m.label)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg transition 
            ${m.color} text-white hover:opacity-90 
            ${selectedMood === m.label ? "ring-2 ring-offset-2 ring-blue-400" : ""}
          `}
        >
          <span className="text-lg">{moodEmojis[m.label]}</span>
          <span>{m.label}</span>
        </button>
      ))}
    </div>
  );
}
