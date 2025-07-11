import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkouts } from '../hooks/useWorkouts';
import { ActiveWorkout } from '../components/workouts/ActiveWorkout';
import { WorkoutSession } from '../types';

export const WorkoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workouts, addSession } = useWorkouts();

  const workout = workouts.find(w => w.id === id);

  if (!workout) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Treino não encontrado</h2>
          <p className="text-gray-600 mb-4">O treino que você está procurando não existe.</p>
          <button
            onClick={() => navigate('/workouts')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Voltar para fichas de treino
          </button>
        </div>
      </div>
    );
  }

  const handleComplete = async (session: WorkoutSession) => {
    try {
      await addSession(session);
      navigate('/history');
    } catch (error) {
      alert('Erro ao salvar a sessão de treino. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <ActiveWorkout
      workout={workout}
      onBack={() => navigate('/workouts')}
      onComplete={handleComplete}
    />
  );
};
