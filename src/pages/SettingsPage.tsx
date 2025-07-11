import React, { useState } from 'react';
import { Save, Upload, Download, Trash2, Settings as SettingsIcon } from 'lucide-react';
import { useWorkouts } from '../hooks/useWorkouts';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

import { useSettings } from '../contexts/SettingsContext'; // Importar hook

export const SettingsPage: React.FC = () => {
  const { workouts, sessions, exportWorkouts, importWorkouts } = useWorkouts();
  const [showClearModal, setShowClearModal] = useState(false);
  const { settings, setSettings } = useSettings();

  const handleClearAllData = () => {
    localStorage.removeItem('workouts');
    localStorage.removeItem('workoutSessions');
    localStorage.removeItem('userSettings');
    window.location.reload();
  };

  const handleExportData = () => {
    const data = {
      workouts,
      sessions,
      settings,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `fittracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedData = JSON.parse(content);

          if (importedData.workouts) {
            importWorkouts(importedData.workouts);
          }

          if (importedData.settings) {
            setSettings(importedData.settings);
          }

          alert('Dados importados com sucesso!');
        } catch (error) {
          alert('Erro ao importar dados. Verifique o formato do arquivo.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSaveSettings = () => {
    // Como o Context já salva automaticamente, esse botão pode ser só um feedback
    alert('Configurações salvas!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Configurações</h1>
          <p className="text-gray-600 dark:text-white">Gerencie suas preferências e dados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-800">Preferências</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Meta semanal de treinos"
              type="number"
              value={settings.weeklyGoal}
              onChange={(e) => setSettings({ ...settings, weeklyGoal: parseInt(e.target.value) })}
              min={1}
              max={7}
            />

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Som do timer</label>
                <p className="text-sm text-gray-500">Tocar som quando o tempo de descanso acabar</p>
              </div>
              <input
                type="checkbox"
                checked={settings.restTimerSound}
                onChange={(e) => setSettings({ ...settings, restTimerSound: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Avançar automaticamente</label>
                <p className="text-sm text-gray-500">Passar para o próximo exercício automaticamente</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoNextExercise}
                onChange={(e) => setSettings({ ...settings, autoNextExercise: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Modo escuro</label>
                <p className="text-sm text-gray-500">Alternar entre tema claro e escuro</p>
              </div>
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <Button className="w-full" onClick={handleSaveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-800">Backup e Dados</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Estatísticas</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Fichas de treino:</p>
                  <p className="font-medium">{workouts.length}</p>
                </div>
                <div>
                  <p className="text-gray-600">Sessões realizadas:</p>
                  <p className="font-medium">{sessions.length}</p>
                </div>
                <div>
                  <p className="text-gray-600">Treinos completos:</p>
                  <p className="font-medium">{sessions.filter((s) => s.completed).length}</p>
                </div>
                <div>
                  <p className="text-gray-600">Taxa de conclusão:</p>
                  <p className="font-medium">
                    {sessions.length > 0
                      ? Math.round((sessions.filter((s) => s.completed).length / sessions.length) * 100)
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={handleExportData} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Exportar Todos os Dados
              </Button>

              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
                id="import-backup"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('import-backup')?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar Backup
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="destructive"
                onClick={() => setShowClearModal(true)}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Todos os Dados
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Confirmar Limpeza"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Tem certeza de que deseja limpar todos os dados? Esta ação não pode ser desfeita.
          </p>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-700">
              <strong>Atenção:</strong> Todos os seus treinos, sessões e configurações serão perdidos permanentemente.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={handleClearAllData} className="flex-1">
              Sim, Limpar Tudo
            </Button>
            <Button variant="outline" onClick={() => setShowClearModal(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
