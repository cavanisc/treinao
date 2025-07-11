export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restTime: number;
  weight?: number;
  notes?: string;
  completed?: boolean;
  videoUrl?: string;
  imageUrl?: string;
}

export interface Workout {
  id: string;
  name: string;
  type: 'A' | 'B' | 'C';
  exercises: Exercise[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  date: Date;
  duration: number;
  completed: boolean;
  notes?: string;
  photos?: string[];
  exercises: Exercise[];
}

export interface WorkoutStats {
  totalSessions: number;
  totalDuration: number;
  currentStreak: number;
  weeklyGoal: number;
  completedThisWeek: number;
}