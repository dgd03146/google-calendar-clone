import { CalendarTimeGrid } from './CalendarTimeGrid';
import { CalendarWeekHeader } from './CalendarWeekHeader';

export const CalendarMain = () => {
  const currentDate = new Date();

  return (
    <div className="flex flex-col h-full w-full overflow-x-auto">
      <CalendarWeekHeader currentDate={currentDate} />
      <CalendarTimeGrid currentDate={currentDate} />
    </div>
  );
};
