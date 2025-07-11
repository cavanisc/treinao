import { Workout } from '../types';

export const sampleWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Treino A - Peito, Ombro e Tríceps',
    type: 'A',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    exercises: [
      {
        id: '1',
        name: 'Supino Reto',
        sets: 4,
        reps: '8-10',
        restTime: 90,
        videoUrl: 'https://www.youtube.com/watch?v=example1'
      },
      {
        id: '2',
        name: 'Supino Inclinado',
        sets: 3,
        reps: '10-12',
        restTime: 90
      },
      {
        id: '3',
        name: 'Crucifixo',
        sets: 3,
        reps: '12-15',
        restTime: 60
      },
      {
        id: '4',
        name: 'Desenvolvimento Militar',
        sets: 4,
        reps: '8-10',
        restTime: 90
      },
      {
        id: '5',
        name: 'Elevação Lateral',
        sets: 3,
        reps: '12-15',
        restTime: 60
      },
      {
        id: '6',
        name: 'Tríceps Pulley',
        sets: 3,
        reps: '10-12',
        restTime: 60
      },
      {
        id: '7',
        name: 'Tríceps Testa',
        sets: 3,
        reps: '10-12',
        restTime: 60
      }
    ]
  },
  {
    id: '2',
    name: 'Treino B - Costas e Bíceps',
    type: 'B',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    exercises: [
      {
        id: '8',
        name: 'Puxada Frente',
        sets: 4,
        reps: '8-10',
        restTime: 90
      },
      {
        id: '9',
        name: 'Remada Curvada',
        sets: 4,
        reps: '8-10',
        restTime: 90
      },
      {
        id: '10',
        name: 'Remada Sentada',
        sets: 3,
        reps: '10-12',
        restTime: 75
      },
      {
        id: '11',
        name: 'Pullover',
        sets: 3,
        reps: '12-15',
        restTime: 60
      },
      {
        id: '12',
        name: 'Rosca Direta',
        sets: 4,
        reps: '10-12',
        restTime: 60
      },
      {
        id: '13',
        name: 'Rosca Martelo',
        sets: 3,
        reps: '10-12',
        restTime: 60
      },
      {
        id: '14',
        name: 'Rosca Concentrada',
        sets: 3,
        reps: '12-15',
        restTime: 45
      }
    ]
  },
  {
    id: '3',
    name: 'Treino C - Pernas e Glúteos',
    type: 'C',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    exercises: [
      {
        id: '15',
        name: 'Agachamento',
        sets: 4,
        reps: '8-10',
        restTime: 120
      },
      {
        id: '16',
        name: 'Leg Press',
        sets: 4,
        reps: '12-15',
        restTime: 90
      },
      {
        id: '17',
        name: 'Extensão de Pernas',
        sets: 3,
        reps: '12-15',
        restTime: 60
      },
      {
        id: '18',
        name: 'Flexão de Pernas',
        sets: 3,
        reps: '12-15',
        restTime: 60
      },
      {
        id: '19',
        name: 'Elevação Pélvica',
        sets: 4,
        reps: '12-15',
        restTime: 60
      },
      {
        id: '20',
        name: 'Panturrilha em Pé',
        sets: 4,
        reps: '15-20',
        restTime: 45
      },
      {
        id: '21',
        name: 'Abdução de Pernas',
        sets: 3,
        reps: '15-20',
        restTime: 45
      }
    ]
  }
];