import { format, isToday, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date: Date | string, formatStr: string = 'dd/MM/yyyy') => {
  return format(new Date(date), formatStr, { locale: ptBR });
};

export const isDateToday = (date: Date | string) => {
  return isToday(new Date(date));
};

export const areDatesEqual = (date1: Date | string, date2: Date | string) => {
  return isSameDay(new Date(date1), new Date(date2));
};

export const getWeekDays = (date: Date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  const end = endOfWeek(date, { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
};

export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}min`;
  }
  return `${mins}min`;
};