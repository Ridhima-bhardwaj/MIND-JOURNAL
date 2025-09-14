// Mood colors for UI styling
export const moodColors = {
  'very-happy': '#10B981', // green-500
  'happy': '#34D399',      // green-400
  'neutral': '#6B7280',    // gray-500
  'sad': '#3B82F6',        // blue-500
  'very-sad': '#1D4ED8',   // blue-700
  'angry': '#EF4444',      // red-500
  'anxious': '#F59E0B',    // yellow-500
  'excited': '#8B5CF6'     // purple-500
};

// Mood emojis for quick visual cues
export const moodEmojis = {
  'very-happy': '😊',
  'happy': '🙂',
  'neutral': '😐',
  'sad': '😔',
  'very-sad': '😢',
  'angry': '😠',
  'anxious': '😰',
  'excited': '🤩'
};

// Mood labels for display
export const moodLabels = {
  'very-happy': 'Very Happy',
  'happy': 'Happy',
  'neutral': 'Neutral',
  'sad': 'Sad',
  'very-sad': 'Very Sad',
  'angry': 'Angry',
  'anxious': 'Anxious',
  'excited': 'Excited'
};

// Analyze text → detect mood (basic keyword-based)
export function analyzeMood(text) {
  if (!text || typeof text !== "string") return 'neutral';

  const lowerText = text.toLowerCase();

  const happyWords = ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'fantastic'];
  const sadWords = ['sad', 'depressed', 'down', 'upset', 'crying', 'hurt', 'pain'];
  const anxiousWords = ['anxious', 'worried', 'nervous', 'stress', 'panic', 'overwhelmed'];
  const angryWords = ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'irritated'];

  const happyCount = happyWords.filter(word => lowerText.includes(word)).length;
  const sadCount = sadWords.filter(word => lowerText.includes(word)).length;
  const anxiousCount = anxiousWords.filter(word => lowerText.includes(word)).length;
  const angryCount = angryWords.filter(word => lowerText.includes(word)).length;

  if (happyCount > 0 && happyCount >= Math.max(sadCount, anxiousCount, angryCount)) {
    return happyCount > 2 ? 'very-happy' : 'happy';
  }
  if (sadCount > 0 && sadCount >= Math.max(anxiousCount, angryCount)) {
    return sadCount > 2 ? 'very-sad' : 'sad';
  }
  if (anxiousCount > 0 && anxiousCount >= angryCount) {
    return 'anxious';
  }
  if (angryCount > 0) {
    return 'angry';
  }

  return 'neutral';
}

// Suggest coping strategies based on mood
export function generateCopingSuggestion(mood) {
  const suggestions = {
    'very-happy': 'Share your positive energy! Consider reaching out to a friend or doing something kind for others.',
    'happy': 'Great mood! This might be a perfect time to tackle a challenging task or try something new.',
    'neutral': 'A balanced state of mind. Consider practicing mindfulness or reflection to connect with your inner thoughts.',
    'sad': 'It\'s okay to feel sad. Try gentle activities like a warm bath, listening to soothing music, or journaling.',
    'very-sad': 'Remember that difficult emotions pass. Consider reaching out to someone you trust or practicing deep breathing exercises.',
    'angry': 'When angry, physical movement can help. Try going for a walk, doing some stretches, or practicing progressive muscle relaxation.',
    'anxious': 'For anxiety, try the 4-7-8 breathing technique: breathe in for 4, hold for 7, exhale for 8. Grounding exercises can also help.',
    'excited': 'Channel this positive energy into something productive! Consider starting a project you\'ve been putting off.'
  };

  return suggestions[mood] || "Take a deep breath and be kind to yourself.";
}
