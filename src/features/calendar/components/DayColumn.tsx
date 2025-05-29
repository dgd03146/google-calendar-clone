import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { format } from 'date-fns';
import { EVENT_COLORS } from '../config/eventColors';
import { CALENDAR_LAYOUT_CONFIG } from '../config/layoutConfig';
import { openCreateModal, openEditModal } from '../store/eventsModalSlice';
import { selectAllEvents, selectEventsDayEvents } from '../store/eventsSlice';
import type { CalendarEvent } from '../types/event';
import { get24Hours } from '../utils/dateUtils';
import { calculateOverlapLayout, getEventFullPosition } from '../utils/eventUtils';
import { CalendarCell } from './CalendarCell';
import { EventBlock } from './EventBlock';

interface DayColumnProps {
  day: Date;
}

export const DayColumn = ({ day }: DayColumnProps) => {
  const dispatch = useAppDispatch();
  const allEvents = useAppSelector(selectAllEvents);
  const formattedDay = format(day, 'yyyy-MM-dd');
  const dayEvents = useAppSelector(state => selectEventsDayEvents(state, formattedDay));

  const hours = get24Hours();
  const cellHeight = CALENDAR_LAYOUT_CONFIG.CELL_HEIGHT;

  const handleCellClick = (day: Date, hour: number) => {
    dispatch(
      openCreateModal({
        date: day,
        hour: hour,
        minute: 0,
      })
    );
  };

  const handleEventClick = (event: CalendarEvent) => {
    dispatch(openEditModal(event.id));
  };

  const getEventColor = (event: CalendarEvent) => {
    const index = dayEvents.findIndex(e => e.id === event.id);
    const colorIndex = index % EVENT_COLORS.length;
    return EVENT_COLORS[colorIndex];
  };

  return (
    <div className="relative">
      <div className="grid grid-rows-24">
        {hours.map(hour => (
          <CalendarCell key={hour} day={day} hour={hour} onCellClick={handleCellClick} />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {dayEvents.map(event => {
          const position = getEventFullPosition(event.startTime, event.endTime, cellHeight);
          const colorClass = getEventColor(event);
          const layout = calculateOverlapLayout(allEvents, event);

          return (
            <div
              key={event.id}
              className="absolute pointer-events-auto"
              style={{
                top: `${position.top}px`,
                height: `${position.height}px`,
                left: layout.left,
                right: layout.right,
                width: layout.width,
                zIndex: layout.zIndex,
                paddingLeft: '2px',
                paddingRight: '2px',
              }}
            >
              <EventBlock event={event} onEventClick={handleEventClick} colorClass={colorClass} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
