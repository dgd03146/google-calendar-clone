import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import 'react-day-picker/style.css';
import { selectCurrentDate, setCurrentDate } from '../store/calendarSlice';

interface MiniCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

export const MiniCalendar = ({ selectedDate, onDateSelect, className = '' }: MiniCalendarProps) => {
  const dispatch = useAppDispatch();
  const currentDate = useAppSelector(selectCurrentDate);

  const defaultClassNames = getDefaultClassNames();
  const [month, setMonth] = useState<Date>(selectedDate || currentDate);

  useEffect(() => {
    if (!selectedDate) {
      setMonth(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
    }
  }, [currentDate, selectedDate]);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      dispatch(setCurrentDate(date.toISOString()));

      if (onDateSelect) {
        onDateSelect(date);
      }
    }
  };

  const handleMonthChange = (month: Date) => {
    setMonth(month);

    const currentDay = currentDate.getDate();

    const newDate = new Date(month.getFullYear(), month.getMonth(), currentDay);

    if (newDate.getMonth() !== month.getMonth()) {
      const lastDayOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
      const adjustedDate = new Date(month.getFullYear(), month.getMonth(), lastDayOfMonth);
      dispatch(setCurrentDate(adjustedDate.toISOString()));
    } else {
      dispatch(setCurrentDate(newDate.toISOString()));
    }
  };

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const displaySelectedDate = selectedDate || currentDate;

  return (
    <div className={`py-4 ${className}`}>
      <DayPicker
        mode="single"
        selected={displaySelectedDate}
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
          selected: 'text-black  rounded-full font-bold bg-blue-500 text-white',
          today: 'text-black font-bold bg-blue-100 rounded-full hover:text-black',
          focused: 'text-black bg-blue-100 rounded-full',
        }}
      />
    </div>
  );
};
