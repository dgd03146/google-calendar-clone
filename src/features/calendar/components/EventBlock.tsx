import { cn } from '@/lib/utils';
import { EVENT_COLORS } from '../config/eventColors';
import type { CalendarEvent } from '../types/event';

interface EventBlockProps {
  event: CalendarEvent;
  onEventClick?: (event: CalendarEvent) => void;
  colorClass?: string;
}

export const EventBlock = ({ event, onEventClick, colorClass }: EventBlockProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick?.(event);
  };

  const finalColorClass = colorClass || EVENT_COLORS[0];

  return (
    <div
      className={cn(
        'h-full w-full text-white text-xs p-1 rounded shadow-sm overflow-hidden cursor-pointer transition-colors',
        finalColorClass
      )}
      onClick={handleClick}
    >
      <div className="font-medium truncate">{event.title || '(제목 없음)'}</div>
      <div className="text-xs opacity-90">
        {event.startTime} - {event.endTime}
      </div>
    </div>
  );
};
