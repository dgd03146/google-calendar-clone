import { Plus } from 'lucide-react';
import { useState } from 'react';
import { MiniCalendar } from './MiniCalendar';

export const CalendarSidebar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  return (
    <aside className="w-[256px] bg-background border-r border-gray-200 flex flex-col py-4 px-4 min-h-[calc(100dvh-64px)]">
      <div className="sticky top-[80px] z-10">
        <button className=" max-w-fit py-4 px-8 mb-6 text-sm text-gray-500 flex items-center gap-2 bg-white border-b border-gray-200 hover:bg-gray-100 cursor-pointer rounded-2xl shadow-lg transition-all duration-300">
          <Plus className="h-4 w-4" />
          <span className="text-md font-medium">만들기</span>
        </button>

        <MiniCalendar selectedDate={currentDate} onDateSelect={handleDateChange} />
      </div>
    </aside>
  );
};
