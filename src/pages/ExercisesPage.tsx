import React, { useState } from 'react';
import { Play, Search, Filter } from 'lucide-react';
import { useWorkouts } from '../hooks/useWorkouts';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

export const ExercisesPage: React.FC = () => {
  const { workouts } = useWorkouts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');

  // Get all unique exercises from all workouts
  const allExercises = workouts.reduce((acc, workout) => {
    workout.exercises.forEach(exercise => {
      const existingExercise = acc.find(e => e.name === exercise.name);
      if (!existingExercise) {
        acc.push({ ...exercise, workoutType: workout.type, workoutName: workout.name });
      }
    });
    return acc;
  }, [] as any[]);

  const filteredExercises = allExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || exercise.workoutType === selectedType;
    return matchesSearch && matchesType;
  });

  const workoutTypes = ['A', 'B', 'C'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Exercícios</h1>
          <p className="text-gray-600 dark:text-white">Biblioteca completa de exercícios com vídeos explicativos</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar exercícios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedType === '' ? 'primary' : 'outline'}
            onClick={() => setSelectedType('')}
            size="sm"
          >
            Todos
          </Button>
          {workoutTypes.map(type => (
            <Button
              key={type}
              variant={selectedType === type ? 'primary' : 'outline'}
              onClick={() => setSelectedType(type)}
              size="sm"
            >
              Ficha {type}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise, index) => (
          <Card key={`${exercise.name}-${index}`} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-gray-800">{exercise.name}</h3>
                <Badge variant="default">Ficha {exercise.workoutType}</Badge>
              </div>
              <p className="text-sm text-gray-600">{exercise.workoutName}</p>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Séries:</span>
                  <span className="font-medium">{exercise.sets}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Repetições:</span>
                  <span className="font-medium">{exercise.reps}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Descanso:</span>
                  <span className="font-medium">{exercise.restTime}s</span>
                </div>
                
                {exercise.videoUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(exercise.videoUrl, '_blank')}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Assistir Vídeo
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium">Nenhum exercício encontrado</h3>
            <p className="text-sm">Tente ajustar sua pesquisa ou filtros</p>
          </div>
        </div>
      )}
    </div>
  );
};