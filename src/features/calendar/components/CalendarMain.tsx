import { CalendarTimeGrid } from './CalendarTimeGrid';
import { CalendarWeekHeader } from './CalendarWeekHeader';
import { EventModal } from './EventModal';

export const CalendarMain = () => {
  return (
    <div className="flex flex-col h-full w-full overflow-x-auto">
      <CalendarWeekHeader />
      <CalendarTimeGrid />
      <EventModal />
    </div>
  );
};
