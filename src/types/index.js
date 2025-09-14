export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: MoodType;
  tags: string[];
  aiSummary?: string;
  copingSuggestion?: string;
  mediaRecommendations?: MediaRecommendation[];
  createdAt: Date;
  updatedAt: Date;
}

export type MoodType = 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad' | 'angry' | 'anxious' | 'excited';

export interface MediaRecommendation {
  type: 'music' | 'video';
  title: string;
  artist?: string;
  url: string;
  thumbnail: string;
}

export interface MoodData {
  date: string;
  mood: MoodType;
  count: number;
}

export interface AppState {
  user: User | null;
  entries: JournalEntry[];
  currentEntry: JournalEntry | null;
  isLoading: boolean;
  error: string | null;
}