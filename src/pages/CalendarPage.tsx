import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useWorkouts } from '../hooks/useWorkouts';
import { WorkoutCalendar } from '../components/calendar/WorkoutCalendar';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatDate } from '../utils/dateUtils';

export const CalendarPage: React.FC = () => {
  const { workouts, sessions } = useWorkouts();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const selectedDateSessions = selectedDate 
    ? sessions.filter(session => 
        formatDate(session.date, 'yyyy-MM-dd') === formatDate(selectedDate, 'yyyy-MM-dd')
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Calendário</h1>
          <p className="text-gray-600 dark:text-white">Visualize seus treinos no calendário</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Agendar Treino
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WorkoutCalendar
            sessions={sessions}
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate || undefined}
          />
        </div>

        <div className="space-y-4">
          {selectedDate ? (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-800">
                  {formatDate(selectedDate, 'dd/MM/yyyy')}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedDateSessions.length} treino(s) neste dia
                </p>
              </CardHeader>
              <CardContent>
                {selectedDateSessions.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateSessions.map(session => {
                      const workout = workouts.find(w => w.id === session.workoutId);
                      return (
                        <div key={session.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-800">{workout?.name}</h4>
                            <Badge variant={session.completed ? 'success' : 'warning'}>
                              {session.completed ? 'Completo' : 'Incompleto'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>Duração: {session.duration} minutos</p>
                            <p>Exercícios: {session.exercises.filter(ex => ex.completed).length}/{session.exercises.length}</p>
                          </div>
                          {session.notes && (
                            <p className="text-sm text-gray-700 mt-2 italic">
                              "{session.notes}"
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-gray-500">
                      <p className="text-sm">Nenhum treino realizado neste dia</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-500">
                  <p>Selecione uma data no calendário para ver os treinos</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-800">Estatísticas</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total de treinos:</span>
                  <span className="font-medium">{sessions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Treinos completos:</span>
                  <span className="font-medium">{sessions.filter(s => s.completed).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Taxa de conclusão:</span>
                  <span className="font-medium">
                    {sessions.length > 0 
                      ? Math.round((sessions.filter(s => s.completed).length / sessions.length) * 100)
                      : 0
                    }%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};