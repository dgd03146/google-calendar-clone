import { useState } from 'react';
import { CalendarTimeGrid } from './CalendarTimeGrid';
import { CalendarWeekHeader } from './CalendarWeekHeader';
import { EventModal } from './EventModal';

export const CalendarMain = () => {
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedHour, setSelectedHour] = useState<number>(9);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const handleCellClick = (day: Date, hour: number, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();

    setSelectedDate(day);
    setSelectedHour(hour);
    setModalPosition({
      x: rect.left + rect.width + 10,
      y: rect.top,
    });
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
