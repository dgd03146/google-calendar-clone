import { CalendarHeader } from '@/features/calendar/components/CalendarHeader';
import { CalendarSidebar } from '@/features/calendar/components/CalendarSidebar';
import { CalendarMain } from '@/features/calendar/components/CalendarMain';

function App() {
  return (
    <div className="flex flex-col h-dvh">
      <CalendarHeader />
      <main className="flex flex-1">
        <CalendarSidebar />
        <CalendarMain />
      </main>
    </div>
  );
}

export default App;
