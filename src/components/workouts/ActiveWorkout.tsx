import React, { useState } from 'react';
import { ArrowLeft, Share, Camera } from 'lucide-react';
import { Workout, Exercise, WorkoutSession } from '../../types';
import { Button } from '../ui/Button';
import { Timer } from '../ui/Timer';
import { ExerciseItem } from './ExerciseItem';
import { Input } from '../ui/Input';
import { exportWorkoutToPDF } from '../../utils/pdfUtils';

interface ActiveWorkoutProps {
  workout: Workout;
  onBack: () => void;
  onComplete: (session: WorkoutSession) => void;
}

export const ActiveWorkout: React.FC<ActiveWorkoutProps> = ({
  workout,
  onBack,
  onComplete
}) => {
  const [exercises, setExercises] = useState<Exercise[]>(workout.exercises);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [startTime] = useState(new Date());

  const updateExercise = (updatedExercise: Exercise) => {
    setExercises(prev => 
      prev.map(ex => ex.id === updatedExercise.id ? updatedExercise : ex)
    );
  };

  const toggleExerciseComplete = (exerciseId: string) => {
    setExercises(prev => 
      prev.map(ex => 
        ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
      )
    );
  };

  const completedExercises = exercises.filter(ex => ex.completed).length;
  const progressPercentage = (completedExercises / exercises.length) * 100;

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotos(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleFinishWorkout = (duration: number) => {
    const session: WorkoutSession = {
      id: Date.now().toString(),
      workoutId: workout.id,
      date: new Date(),
      duration,
      completed: completedExercises === exercises.length,
      notes: notes.trim() || undefined,
      photos: photos.length > 0 ? photos : undefined,
      exercises
    };

    onComplete(session);
  };

  const handleExportPDF = () => {
    const session: WorkoutSession = {
      id: Date.now().toString(),
      workoutId: workout.id,
      date: new Date(),
      duration: Math.floor((new Date().getTime() - startTime.getTime()) / 60000),
      completed: completedExercises === exercises.length,
      notes: notes.trim() || undefined,
      photos: photos.length > 0 ? photos : undefined,
      exercises
    };

    exportWorkoutToPDF(session, workout);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{workout.name}</h1>
            <p className="text-sm text-gray-600">
              {completedExercises}/{exercises.length} exercícios concluídos
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <Share className="h-4 w-4" />
          </Button>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
            id="photo-upload"
          />
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('photo-upload')?.click()}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progresso</span>
              <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {exercises.map((exercise) => (
              <ExerciseItem
                key={exercise.id}
                exercise={exercise}
                onUpdate={updateExercise}
                onToggleComplete={toggleExerciseComplete}
                showTimer={true}
              />
            ))}
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <Input
              label="Observações do Treino"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Como foi o treino? Alguma observação sobre os exercícios?"
            />
          </div>

          {photos.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-3">Fotos do Treino</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Timer onStop={handleFinishWorkout} />
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-medium text-gray-800 mb-3">Resumo</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de exercícios:</span>
                <span className="font-medium">{exercises.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Concluídos:</span>
                <span className="font-medium">{completedExercises}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pendentes:</span>
                <span className="font-medium">{exercises.length - completedExercises}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};