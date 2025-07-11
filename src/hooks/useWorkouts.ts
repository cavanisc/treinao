import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Workout, WorkoutSession, WorkoutStats, Exercise } from '../types';
import { Database } from '../types/database';

type WorkoutRow = Database['public']['Tables']['workouts']['Row'];
type ExerciseRow = Database['public']['Tables']['exercises']['Row'];
type SessionRow = Database['public']['Tables']['workout_sessions']['Row'];
type SessionExerciseRow = Database['public']['Tables']['session_exercises']['Row'];
type PhotoRow = Database['public']['Tables']['session_photos']['Row'];

export const useWorkouts = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [stats, setStats] = useState<WorkoutStats>({
    totalSessions: 0,
    totalDuration: 0,
    currentStreak: 0,
    weeklyGoal: 4,
    completedThisWeek: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = async () => {
    if (!user) return;

    try {
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (workoutError) throw workoutError;

      const workoutsWithExercises = await Promise.all(
        (workoutData || []).map(async (workout: WorkoutRow) => {
          const { data: exerciseData, error: exerciseError } = await supabase
            .from('exercises')
            .select('*')
            .eq('workout_id', workout.id)
            .order('order_index', { ascending: true });

          if (exerciseError) throw exerciseError;

          const exercises: Exercise[] = (exerciseData || []).map((ex: ExerciseRow) => ({
            id: ex.id,
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            restTime: ex.rest_time,
            videoUrl: ex.video_url || undefined,
            imageUrl: ex.image_url || undefined,
          }));

          return {
            id: workout.id,
            name: workout.name,
            type: workout.type,
            exercises,
            createdAt: new Date(workout.created_at),
            updatedAt: new Date(workout.updated_at),
          } as Workout;
        })
      );

      setWorkouts(workoutsWithExercises);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const fetchSessions = async () => {
    if (!user) return;

    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (sessionError) throw sessionError;

      const sessionsWithDetails = await Promise.all(
        (sessionData || []).map(async (session: SessionRow) => {
          const { data: sessionExercises, error: exerciseError } = await supabase
            .from('session_exercises')
            .select(`*, exercises (*)`)
            .eq('session_id', session.id);

          if (exerciseError) throw exerciseError;

          const { data: sessionPhotos, error: photoError } = await supabase
            .from('session_photos')
            .select('*')
            .eq('session_id', session.id);

          if (photoError) throw photoError;

          const exercises: Exercise[] = (sessionExercises || []).map((se: any) => ({
            id: se.exercises.id,
            name: se.exercises.name,
            sets: se.exercises.sets,
            reps: se.exercises.reps,
            restTime: se.exercises.rest_time,
            videoUrl: se.exercises.video_url || undefined,
            imageUrl: se.exercises.image_url || undefined,
            completed: se.completed,
            weight: se.weight || undefined,
            notes: se.notes || undefined,
          }));

          const photos = (sessionPhotos || []).map((photo: PhotoRow) => photo.photo_url);

          return {
            id: session.id,
            workoutId: session.workout_id,
            date: new Date(session.date),
            duration: session.duration,
            completed: session.completed,
            notes: session.notes || undefined,
            photos: photos.length > 0 ? photos : undefined,
            exercises,
          } as WorkoutSession;
        })
      );

      setSessions(sessionsWithDetails);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const calculateStats = () => {
    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
    const sortedSessions = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let currentStreak = 0;
    let currentDate = new Date();

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.date);
      const diffDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 1) {
        currentStreak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const completedThisWeek = sessions.filter(session => new Date(session.date) >= weekStart).length;

    setStats({
      totalSessions,
      totalDuration,
      currentStreak,
      weeklyGoal: 4,
      completedThisWeek
    });
  };

  const addWorkout = async (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          name: workout.name,
          type: workout.type,
        })
        .select()
        .single();

      if (workoutError) throw workoutError;

      const exercisesWithWorkoutId = workout.exercises.map((exercise, index) => ({
        workout_id: workoutData.id,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        rest_time: exercise.restTime,
        video_url: exercise.videoUrl || null,
        image_url: exercise.imageUrl || null,
        order_index: index,
      }));

      const { error: exerciseError } = await supabase.from('exercises').insert(exercisesWithWorkoutId);

      if (exerciseError) throw exerciseError;
    } catch (error) {
      console.error('Error adding workout:', error);
      throw error;
    }
  };

  const importWorkouts = async (rawData: any) => {
    try {
      const isObjectFormat = typeof rawData === 'object' && !Array.isArray(rawData);
      const workoutsArray = isObjectFormat
        ? Object.entries(rawData).map(([key, value]: [string, any]) => ({
            name: value.name || `Ficha ${key}`,
            type: value.type || key,
            exercises: (value.exercises || []).map((ex: any) => ({
              name: ex.name || ex.exercicio || '',
              sets: Number(ex.sets || ex.series || 0),
              reps: ex.reps || ex.repeticoes || '',
              restTime: ex.restTime || ex.intervalo || '',
            })),
          }))
        : (rawData as any[]).map((w: any, i) => ({
            name: w.name || `Ficha ${i + 1}`,
            type: w.type || `Ficha-${i + 1}`,
            exercises: (w.exercises || []).map((ex: any) => ({
              name: ex.name || ex.exercicio || '',
              sets: Number(ex.sets || ex.series || 0),
              reps: ex.reps || ex.repeticoes || '',
              restTime: ex.restTime || ex.intervalo || '',
            })),
          }));

      for (const workout of workoutsArray) {
        await addWorkout(workout);
      }

      await fetchWorkouts();
    } catch (error) {
      console.error('Erro ao importar fichas:', error);
      throw error;
    }
  };

  const updateWorkout = async (id: string, updates: Partial<Workout>) => {
    if (!user) return;
    try {
      const { error: workoutError } = await supabase
        .from('workouts')
        .update({
          name: updates.name,
          type: updates.type,
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (workoutError) throw workoutError;
      await fetchWorkouts();
    } catch (error) {
      console.error('Error updating workout:', error);
    }
  };

  const deleteWorkout = async (id: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      await fetchWorkouts();
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const addSession = async (session: Omit<WorkoutSession, 'id'>) => {
    if (!user) return;

    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          workout_id: session.workoutId,
          date: session.date.toISOString(),
          duration: session.duration,
          completed: session.completed,
          notes: session.notes || null,
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      const sessionExercises = session.exercises.map((exercise) => ({
        session_id: sessionData.id,
        exercise_id: exercise.id,
        completed: exercise.completed || false,
        weight: exercise.weight || null,
        notes: exercise.notes || null,
      }));

      const { error: exerciseError } = await supabase
        .from('session_exercises')
        .insert(sessionExercises);

      if (exerciseError) throw exerciseError;

      if (session.photos && session.photos.length > 0) {
        const photoInserts = session.photos.map((photoUrl) => ({
          session_id: sessionData.id,
          photo_url: photoUrl,
        }));

        const { error: photoError } = await supabase
          .from('session_photos')
          .insert(photoInserts);

        if (photoError) throw photoError;
      }

      await fetchSessions();
    } catch (error) {
      console.error('Error adding session:', error);
    }
  };

  const exportWorkouts = () => {
    const dataStr = JSON.stringify(workouts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'workouts.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;
    const dataStr = JSON.stringify(session, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `workout-session-${session.date}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  useEffect(() => {
    if (user) {
      Promise.all([fetchWorkouts(), fetchSessions()]).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    calculateStats();
  }, [sessions]);

  return {
    workouts,
    sessions,
    stats,
    loading,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addSession,
    importWorkouts,
    exportWorkouts,
    exportSession,
    refetch: () => Promise.all([fetchWorkouts(), fetchSessions()]),
  };
};
