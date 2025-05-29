import { format } from 'date-fns';
import { useAppSelector } from '../../../store/hooks';
import { EVENT_COLORS } from '../config/eventColors';
import { CALENDAR_LAYOUT_CONFIG } from '../config/layoutConfig';
import { selectAllEvents, selectEventsDayEvents } from '../store/eventsSlice';
import type { CalendarEvent } from '../types/event';
import { get24Hours } from '../utils/dateUtils';
import { calculateOverlapLayout, getEventFullPosition } from '../utils/eventUtils';
import { CalendarCell } from './CalendarCell';
import { EventBlock } from './EventBlock';

interface DayColumnProps {
  day: Date;
  onCellClick?: (day: Date, hour: number) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export const DayColumn = ({ day, onCellClick, onEventClick }: DayColumnProps) => {
  const allEvents = useAppSelector(selectAllEvents);
  const formattedDay = format(day, 'yyyy-MM-dd');
  const dayEvents = useAppSelector(state => selectEventsDayEvents(state, formattedDay));

  const hours = get24Hours();
  const cellHeight = CALENDAR_LAYOUT_CONFIG.CELL_HEIGHT;

  const getEventColor = (event: CalendarEvent) => {
    const index = dayEvents.findIndex(e => e.id === event.id);
    const colorIndex = index % EVENT_COLORS.length;
    return EVENT_COLORS[colorIndex];
  };

  return (
    <div className="relative">
      <div className="grid grid-rows-24">
        {hours.map(hour => (
          <CalendarCell key={hour} day={day} hour={hour} onCellClick={onCellClick} />
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
              <EventBlock event={event} onEventClick={onEventClick} colorClass={colorClass} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
