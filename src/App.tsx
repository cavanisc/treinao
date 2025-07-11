import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { Dashboard } from './pages/Dashboard';
import { WorkoutsPage } from './pages/WorkoutsPage';
import { WorkoutPage } from './pages/WorkoutPage';
import { ExercisesPage } from './pages/ExercisesPage';
import { HistoryPage } from './pages/HistoryPage';
import { CalendarPage } from './pages/CalendarPage';
import { SettingsPage } from './pages/SettingsPage';

// Importar o provider
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  return (
    <SettingsProvider>
      <Router>
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <div className="flex flex-col md:flex-row">
              <div className="md:w-64 md:min-h-screen order-2 md:order-1">
                <Navigation />
              </div>
              <main className="flex-1 order-1 md:order-2">
                <div className="container mx-auto px-4 py-6">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/workouts" element={<WorkoutsPage />} />
                    <Route path="/workout/:id" element={<WorkoutPage />} />
                    <Route path="/exercises" element={<ExercisesPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Routes>
                </div>
              </main>
            </div>
          </div>
        </ProtectedRoute>
      </Router>
    </SettingsProvider>
  );
}

export default App;
