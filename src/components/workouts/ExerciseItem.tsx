import React, { useState } from 'react';
import { Check, Clock, Edit, Eye, Camera } from 'lucide-react';
import { Exercise } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface ExerciseItemProps {
  exercise: Exercise;
  onUpdate?: (exercise: Exercise) => void;
  onToggleComplete?: (exerciseId: string) => void;
  showTimer?: boolean;
  readOnly?: boolean;
}

export const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  onUpdate,
  onToggleComplete,
  showTimer = true,
  readOnly = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [weight, setWeight] = useState(exercise.weight?.toString() || '');
  const [notes, setNotes] = useState(exercise.notes || '');
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);

  const handleSave = () => {
    onUpdate?.({
      ...exercise,
      weight: weight ? parseFloat(weight) : undefined,
      notes: notes.trim() || undefined
    });
    setIsEditing(false);
  };

  const startRestTimer = () => {
    setIsResting(true);
    setRestTimer(exercise.restTime);
    const interval = setInterval(() => {
      setRestTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`transition-all duration-200 ${exercise.completed ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {!readOnly && (
                <button
                  onClick={() => onToggleComplete?.(exercise.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    exercise.completed 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {exercise.completed && <Check className="h-4 w-4" />}
                </button>
              )}
              <div className="flex-1">
                <h3 className={`font-semibold ${exercise.completed ? 'text-green-800' : 'text-gray-800'}`}>
                  {exercise.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span>{exercise.sets} séries</span>
                  <span>{exercise.reps} repetições</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {exercise.restTime}s
                  </span>
                </div>
              </div>
            </div>

            {(exercise.weight || exercise.notes || isEditing) && (
              <div className="mt-3 space-y-2">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      label="Peso (kg)"
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Ex: 10"
                    />
                    <Input
                      label="Observações"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex: Aumentar carga na próxima sessão"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSave}>
                        Salvar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {exercise.weight && (
                      <div className="flex items-center gap-2">
                        <Badge variant="info" size="sm">
                          {exercise.weight}kg
                        </Badge>
                      </div>
                    )}
                    {exercise.notes && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {exercise.notes}
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 ml-4">
            {!readOnly && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {exercise.videoUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(exercise.videoUrl, '_blank')}
                    className="p-2"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {showTimer && !readOnly && exercise.completed && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {isResting ? (
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-orange-600 mb-2">
                  {formatTime(restTimer)}
                </div>
                <Badge variant="warning">Descansando...</Badge>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={startRestTimer}
                className="w-full"
              >
                Iniciar Descanso ({exercise.restTime}s)
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};