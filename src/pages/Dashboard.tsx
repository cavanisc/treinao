import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, TrendingUp, Target, Award } from 'lucide-react';
import { useWorkouts } from '../hooks/useWorkouts';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { WorkoutCard } from '../components/workouts/WorkoutCard';
import { WorkoutCalendar } from '../components/calendar/WorkoutCalendar';
import { formatDuration } from '../utils/dateUtils';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { workouts, sessions, stats } = useWorkouts();

  const recentSessions = sessions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const handleStartWorkout = (workout: any) => {
    navigate(`/workout/${workout.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta!</h1>
        <p className="text-blue-100">
          Pronto para mais um treino incrível? Vamos continuar sua jornada fitness!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total de Treinos</p>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
              </div>
              <Target className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Tempo Total</p>
                <p className="text-2xl font-bold">{formatDuration(stats.totalDuration)}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Sequência Atual</p>
                <p className="text-2xl font-bold">{stats.currentStreak}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Esta Semana</p>
                <p className="text-2xl font-bold">{stats.completedThisWeek}/{stats.weeklyGoal}</p>
              </div>
              <Award className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Suas Fichas de Treino</h2>
            <Button variant="outline" onClick={() => navigate('/workouts')}>
              Ver Todas
            </Button>
          </div>
          <div className="space-y-3">
            {workouts.slice(0, 3).map(workout => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onSelect={handleStartWorkout}
                className="hover:shadow-md transition-shadow"
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <WorkoutCalendar sessions={sessions} />
          
          {recentSessions.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-800">Treinos Recentes</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSessions.map(session => {
                    const workout = workouts.find(w => w.id === session.workoutId);
                    return (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{workout?.name}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(session.date).toLocaleDateString()} • {formatDuration(session.duration)}
                          </p>
                        </div>
                        <Badge variant={session.completed ? 'success' : 'warning'}>
                          {session.completed ? 'Concluído' : 'Incompleto'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};