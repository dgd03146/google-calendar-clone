import { addDays, format, startOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';

export const getWeekDays = (currentDate: Date): Date[] => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
};

export const get24Hours = (): number[] => {
  return Array.from({ length: 24 }, (_, i) => i);
};

export const formatWeekday = (date: Date): string => {
  return format(date, 'E', { locale: ko });
};

export const formatDay = (date: Date): string => {
  return format(date, 'd');
};
