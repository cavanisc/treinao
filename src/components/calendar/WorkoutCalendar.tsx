import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { WorkoutSession } from '../../types';
import { Badge } from '../ui/Badge';

interface WorkoutCalendarProps {
  sessions: WorkoutSession[];
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

export const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({
  sessions,
  onDateSelect,
  selectedDate
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getSessionsForDate = (date: Date) => {
    return sessions.filter(session => 
      format(new Date(session.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Calendário de Treinos
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-lg font-medium px-4">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const sessionsForDay = getSessionsForDate(day);
          const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
          const isCurrentMonth = isSameMonth(day, currentMonth);
          
          return (
            <div
              key={day.toISOString()}
              className={`p-2 text-center cursor-pointer transition-colors ${
                isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              } ${
                isSelected ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-50'
              }`}
              onClick={() => onDateSelect?.(day)}
            >
              <div className="text-sm font-medium">{format(day, 'd')}</div>
              {sessionsForDay.length > 0 && (
                <div className="flex justify-center mt-1">
                  <Badge 
                    variant={sessionsForDay.some(s => s.completed) ? 'success' : 'warning'}
                    size="sm"
                  >
                    {sessionsForDay.length}
                  </Badge>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};