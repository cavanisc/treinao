import React, { useState } from 'react';
import { Calendar, Clock, Target, Download, Filter } from 'lucide-react';
import { useWorkouts } from '../hooks/useWorkouts';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ExerciseItem } from '../components/workouts/ExerciseItem';
import { formatDate, formatDuration } from '../utils/dateUtils';
import { exportWorkoutToPDF } from '../utils/pdfUtils';

export const HistoryPage: React.FC = () => {
  const { workouts, sessions, exportSession } = useWorkouts();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [filterCompleted, setFilterCompleted] = useState<string>('all');

  const filteredSessions = sessions
    .filter(session => {
      if (filterCompleted === 'completed') return session.completed;
      if (filterCompleted === 'incomplete') return !session.completed;
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const selectedSessionData = selectedSession 
    ? sessions.find(s => s.id === selectedSession)
    : null;

  const selectedWorkout = selectedSessionData
    ? workouts.find(w => w.id === selectedSessionData.workoutId)
    : null;

  const handleExportPDF = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    const workout = session ? workouts.find(w => w.id === session.workoutId) : null;
    
    if (session && workout) {
      exportWorkoutToPDF(session, workout);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Histórico de Treinos</h1>
          <p className="text-gray-600 dark:text-white">Acompanhe seu progresso e performance</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterCompleted === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilterCompleted('all')}
            size="sm"
          >
            Todos
          </Button>
          <Button
            variant={filterCompleted === 'completed' ? 'primary' : 'outline'}
            onClick={() => setFilterCompleted('completed')}
            size="sm"
          >
            Completos
          </Button>
          <Button
            variant={filterCompleted === 'incomplete' ? 'primary' : 'outline'}
            onClick={() => setFilterCompleted('incomplete')}
            size="sm"
          >
            Incompletos
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Sessões de Treino</h2>
          {filteredSessions.map(session => {
            const workout = workouts.find(w => w.id === session.workoutId);
            const completedExercises = session.exercises.filter(ex => ex.completed).length;
            
            return (
              <Card 
                key={session.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedSession === session.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedSession(session.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{workout?.name}</h3>
                      <p className="text-sm text-gray-600">{formatDate(session.date)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={session.completed ? 'success' : 'warning'}>
                        {session.completed ? 'Completo' : 'Incompleto'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportPDF(session.id);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{formatDuration(session.duration)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-gray-500" />
                      <span>{completedExercises}/{session.exercises.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Ficha {workout?.type}</span>
                    </div>
                  </div>
                  
                  {session.notes && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                      <p className="text-gray-700">{session.notes}</p>
                    </div>
                  )}
                  
                  {session.photos && session.photos.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Fotos:</p>
                      <div className="flex gap-2 overflow-x-auto">
                        {session.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Foto ${index + 1}`}
                            className="w-12 h-12 object-cover rounded flex-shrink-0"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          
          {filteredSessions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium">Nenhum treino encontrado</h3>
                <p className="text-sm">Comece a treinar para ver seu histórico aqui</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {selectedSessionData && selectedWorkout ? (
            <div id="session-details">
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Detalhes da Sessão
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{formatDate(selectedSessionData.date)}</span>
                    <span>{formatDuration(selectedSessionData.duration)}</span>
                    <Badge variant={selectedSessionData.completed ? 'success' : 'warning'}>
                      {selectedSessionData.completed ? 'Completo' : 'Incompleto'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedSessionData.exercises.map(exercise => (
                      <ExerciseItem
                        key={exercise.id}
                        exercise={exercise}
                        readOnly={true}
                        showTimer={false}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-500">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p>Selecione uma sessão para ver os detalhes</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};