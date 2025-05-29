import { CalendarHeader } from './CalendarHeader';
import { CalendarMain } from './CalendarMain';
import { CalendarSidebar } from './CalendarSidebar';

export const Calendar = () => {
  return (
    <div className="flex flex-col h-dvh">
      <CalendarHeader />
      <main className="flex flex-1 h-[calc(100dvh-64px)]">
        <CalendarSidebar />
        <CalendarMain />
      </main>
    </div>
  );
};
