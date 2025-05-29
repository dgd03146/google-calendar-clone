import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useState } from 'react';
import { CalendarTimeGrid } from './CalendarTimeGrid';
import { CalendarWeekHeader } from './CalendarWeekHeader';
import { EventModal } from './EventModal';

export const CalendarMain = () => {
  const breakpoint = useBreakpoint();
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedHour, setSelectedHour] = useState<number>(9);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const handleCellClick = (day: Date, hour: number) => {
    const modalWidth = breakpoint.isMobile ? 360 : breakpoint.isTablet ? 400 : 448;
    const modalHeight = 500;

    const x = (window.innerWidth - modalWidth) / 2;
    const y = (window.innerHeight - modalHeight) / 2;

    setSelectedDate(day);
    setSelectedHour(hour);
    setModalPosition({ x, y });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full w-full overflow-x-auto">
      <CalendarWeekHeader currentDate={currentDate} />
      <CalendarTimeGrid currentDate={currentDate} onCellClick={handleCellClick} />

      <EventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        selectedDate={selectedDate}
        selectedHour={selectedHour}
        position={modalPosition}
      />
    </div>
  );
};
