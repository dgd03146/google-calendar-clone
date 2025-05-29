import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { format, isSameDay, isToday } from 'date-fns';
import { selectCurrentDate, setCurrentDate } from '../store/calendarSlice';
import { getWeekDays } from '../utils/dateUtils';

export const CalendarWeekHeader = () => {
  const currentDate = useAppSelector(selectCurrentDate);
  const weekDays = getWeekDays(currentDate);
  const dispatch = useAppDispatch();

  const handleDayClick = (day: Date) => {
    dispatch(setCurrentDate(day.toISOString()));
  };

  return (
    <div className="flex bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="w-20 border-r border-gray-200 flex-shrink-0"></div>

      <div className="flex-1 grid grid-cols-7">
        {weekDays.map(day => {
          const isCurrentDay = isToday(day);
          const isSelectedDay = isSameDay(day, currentDate);

          return (
            <div
              key={day.toISOString()}
              className={`
                p-2 text-center border-r border-gray-200 last:border-r-0 cursor-pointer
                ${isCurrentDay ? 'bg-blue-100' : ''}
                ${isSelectedDay ? 'text-blue-800 font-bold' : ''}
              `}
              onClick={() => handleDayClick(day)}
            >
              <div className="text-xs text-gray-500 uppercase">{format(day, 'EEE')}</div>
              <div
                className={`
                  text-sm mt-1 font-medium
                  ${isCurrentDay ? 'text-blue-600' : ''}
                  ${isSelectedDay ? 'text-white font-bold bg-accent' : ''}
                `}
              >
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
