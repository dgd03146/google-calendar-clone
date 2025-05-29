import { isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState } from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import 'react-day-picker/style.css';

interface MiniCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

export const MiniCalendar = ({
  selectedDate = new Date(),
  onDateSelect,
  className = '',
}: MiniCalendarProps) => {
  const defaultClassNames = getDefaultClassNames();
  const [month, setMonth] = useState<Date>(selectedDate);

  const handleDateChange = (date: Date | undefined) => {
    if (date && onDateSelect) {
      onDateSelect(date);
    }
  };

  const handleMonthChange = (month: Date) => {
    setMonth(month);
  };

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className={`py-4 ${className}`}>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={handleDateChange}
        month={month}
        onMonthChange={handleMonthChange}
        locale={ko}
        weekStartsOn={0}
        showOutsideDays
        modifiers={{
          today: date => isToday(date),
        }}
        formatters={{
          formatWeekdayName: day => {
            return weekDays[day.getDay()];
          },
          formatCaption: date => {
            return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
          },
        }}
        classNames={{
          button_previous: 'p-2 cursor-pointer hover:bg-today-bg rounded-full',
          button_next: 'p-2 cursor-pointer hover:bg-today-bg rounded-full',
          chevron: 'w-4 h-4',
          month_caption: `${defaultClassNames.month_caption} font-bold pl-[10px] flex items-center`,
          caption_label: 'text-[14px]',
          week: 'text-sm text-gray-500',
          day_button: 'w-8 h-8 cursor-pointer rounded-full hover:bg-today-bg',
          day: 'text-[10px]',
          selected: 'text-black  rounded-full font-bold',
          today:
            'text-white font-bold bg-primary font-bold bg-blue-100 rounded-full hover:text-black',
          focused: 'text-black bg-blue-100 rounded-full',
        }}
      />
    </div>
  );
};
