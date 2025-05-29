import type { CalendarEvent } from '../types/event';
import { get24Hours, getWeekDays } from '../utils/dateUtils';
import { formatHour } from '../utils/timeUtils';
import { DayColumn } from './DayColumn';

interface CalendarTimeGridProps {
  currentDate: Date;
  onCellClick?: (day: Date, hour: number) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export const CalendarTimeGrid = ({
  currentDate,
  onCellClick,
  onEventClick,
}: CalendarTimeGridProps) => {
  const weekDays = getWeekDays(currentDate);
  const hours = get24Hours();

  return (
    <div className="w-full">
      <div className="flex">
        <div className="w-20 border-r border-gray-200 flex-shrink-0 relative">
          {hours.map(hour => (
            <div key={hour} className="h-20 relative">
              <span className="absolute -top-2 right-2 text-xs text-gray-500 bg-white px-1">
                {formatHour(hour)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7">
          {weekDays.map(day => (
            <div key={day.toISOString()} className="border-r border-gray-200 last:border-r-0">
              <DayColumn day={day} onCellClick={onCellClick} onEventClick={onEventClick} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
