import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, Download } from 'lucide-react';
import { useWorkouts } from '../hooks/useWorkouts';
import { WorkoutCard } from '../components/workouts/WorkoutCard';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Workout } from '../types';

type ValidationResult = {
  valid: boolean;
  errors: string[];
};

function validateWorkoutJson(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(data)) {
    errors.push('O JSON deve ser um array de fichas de treino.');
    return { valid: false, errors };
  }

  data.forEach((workout, idx) => {
    if (
      typeof workout !== 'object' || workout === null ||
      typeof (workout as any).name !== 'string' ||
      typeof (workout as any).type !== 'string' ||
      !Array.isArray((workout as any).exercises)
    ) {
      errors.push(`Ficha no índice ${idx} está com formato inválido.`);
      return;
    }

    (workout as any).exercises.forEach((ex: any, exIdx: number) => {
      if (
        typeof ex !== 'object' || ex === null ||
        typeof ex.name !== 'string' ||
        (typeof ex.sets !== 'number' && typeof ex.sets !== 'string') ||
        (typeof ex.reps !== 'string' && typeof ex.reps !== 'number' && ex.reps !== undefined) ||
        (typeof ex.restTime !== 'string' && typeof ex.restTime !== 'number' && ex.restTime !== undefined)
      ) {
        errors.push(`Exercício ${exIdx} da ficha ${idx} está inválido.`);
        return;
      }
      // Verifica se sets pode ser convertido para número
      const setsNum = Number(ex.sets);
      if (isNaN(setsNum)) {
        errors.push(`Número inválido de séries no exercício ${exIdx} da ficha ${idx}.`);
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

export const WorkoutsPage: React.FC = () => {
  const navigate = useNavigate();
  const { workouts, exportWorkouts, importWorkouts } = useWorkouts();

  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState('');
  const [importing, setImporting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleStartWorkout = (workout: Workout) => {
    navigate(`/workout/${workout.id}`);
  };

  const handleImport = async () => {
    try {
      const parsed = JSON.parse(importData);
      const { valid, errors } = validateWorkoutJson(parsed);

      if (!valid) {
        setValidationErrors(errors);
        return;
      }

      setValidationErrors([]);
      setImporting(true);
      await importWorkouts(parsed);
      setShowImportModal(false);
      setImportData('');
    } catch (e) {
      setValidationErrors([`Erro ao analisar JSON: ${(e as Error).message}`]);
    } finally {
      setImporting(false);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          const { valid, errors } = validateWorkoutJson(parsed);

          if (!valid) {
            setValidationErrors(errors);
            return;
          }

          setValidationErrors([]);
          setImporting(true);
          await importWorkouts(parsed);
          setShowImportModal(false);
          setImportData('');
        } catch (error) {
          setValidationErrors(['Erro ao importar arquivo. Verifique o formato JSON.']);
        } finally {
          setImporting(false);
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Fichas de Treino</h1>
          <p className="text-gray-600 dark:text-white">Gerencie suas rotinas de exercícios</p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".json"
            onChange={handleFileImport}
            className="hidden"
            id="file-import"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-import')?.click()}
            disabled={importing}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline" onClick={() => setShowImportModal(true)} disabled={importing}>
            <Plus className="h-4 w-4 mr-2" />
            Importar JSON
          </Button>
          <Button variant="outline" onClick={exportWorkouts} disabled={importing}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map(workout => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onSelect={handleStartWorkout}
            onEdit={() => {/* TODO: Implementar edição */}}
          />
        ))}
      </div>

      {workouts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium">Nenhuma ficha de treino encontrada</h3>
            <p className="text-sm">Importe suas fichas ou crie uma nova para começar</p>
          </div>
        </div>
      )}

      <Modal
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          setValidationErrors([]);
          setImportData('');
        }}
        title="Importar Fichas de Treino"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cole o JSON das fichas de treino:
            </label>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="Cole aqui o JSON das fichas de treino..."
              disabled={importing}
            />
            {validationErrors.length > 0 && (
              <div className="mt-2 p-2 border border-red-500 bg-red-100 text-red-700 rounded max-h-48 overflow-auto">
                <strong>Erros encontrados:</strong>
                <ul className="list-disc list-inside">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleImport} disabled={importing}>
              {importing ? 'Importando...' : 'Importar Fichas'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowImportModal(false);
                setValidationErrors([]);
                setImportData('');
              }}
              disabled={importing}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
