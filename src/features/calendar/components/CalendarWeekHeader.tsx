import { formatDay, formatWeekday, getWeekDays } from '../utils/dateUtils';

interface CalendarWeekHeaderProps {
  currentDate: Date;
}

export const CalendarWeekHeader = ({ currentDate }: CalendarWeekHeaderProps) => {
  const weekDays = getWeekDays(currentDate);

  return (
    <div className=" bg-white border-b border-gray-200 w-full">
      <div className="flex h-16">
        <div className="w-20 border-r border-gray-200 flex-shrink-0"></div>

        <div className="flex-1 grid grid-cols-7">
          {weekDays.map(day => (
            <div
              key={day.toISOString()}
              className="flex flex-col items-center justify-center border-r border-gray-200 last:border-r-0"
            >
              <div className="text-xs text-gray-600 font-medium">{formatWeekday(day)}</div>
              <div
                className={`text-lg font-semibold ${
                  day.toDateString() === new Date().toDateString()
                    ? 'text-blue-600'
                    : 'text-gray-900'
                }`}
              >
                {formatDay(day)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
