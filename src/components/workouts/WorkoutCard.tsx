import React from 'react';
import { Calendar, Clock, Target, ChevronRight } from 'lucide-react';
import { Workout } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface WorkoutCardProps {
  workout: Workout;
  onSelect?: (workout: Workout) => void;
  onEdit?: (workout: Workout) => void;
  className?: string;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onSelect,
  onEdit,
  className
}) => {
  const getWorkoutTypeColor = (type: string) => {
    switch (type) {
      case 'A': return 'bg-blue-500';
      case 'B': return 'bg-green-500';
      case 'C': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const totalEstimatedTime = workout.exercises.reduce((total, exercise) => {
    return total + (exercise.sets * exercise.restTime) / 60;
  }, 0);

  return (
    <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg ${getWorkoutTypeColor(workout.type)} flex items-center justify-center text-white font-bold text-lg`}>
              {workout.type}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{workout.name}</h3>
              <p className="text-sm text-gray-500">{workout.exercises.length} exercícios</p>
            </div>
          </div>
          <Badge variant="default">Ficha {workout.type}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>~{Math.round(totalEstimatedTime)} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span>{workout.exercises.length} exercícios</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{workout.updatedAt.toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          {workout.exercises.slice(0, 3).map((exercise, index) => (
            <div key={exercise.id} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{exercise.name}</span>
              <span className="text-gray-500">{exercise.sets}x{exercise.reps}</span>
            </div>
          ))}
          {workout.exercises.length > 3 && (
            <div className="text-sm text-gray-500">+{workout.exercises.length - 3} mais exercícios</div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => onSelect?.(workout)}
            className="flex-1 flex items-center justify-center gap-2"
          >
            Iniciar Treino
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onEdit?.(workout)}
            className="px-4"
          >
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};