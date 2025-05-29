import { useState } from 'react';
import type { CalendarEvent } from '../types/event';
import { CalendarTimeGrid } from './CalendarTimeGrid';
import { CalendarWeekHeader } from './CalendarWeekHeader';
import { EventModal } from './EventModal';

export const CalendarMain = () => {
  const currentDate = new Date();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(9);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const handleCellClick = (day: Date, hour: number) => {
    setSelectedDate(day);
    setSelectedHour(hour);
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  return (
    <div className="flex flex-col h-full w-full overflow-x-auto">
      <CalendarWeekHeader currentDate={currentDate} />
      <CalendarTimeGrid
        currentDate={currentDate}
        onCellClick={handleCellClick}
        onEventClick={handleEventClick}
      />

      <EventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        selectedDate={selectedDate}
        selectedHour={selectedHour}
        editingEvent={editingEvent}
      />
    </div>
  );
};
