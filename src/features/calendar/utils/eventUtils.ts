import { CALENDAR_LAYOUT_CONFIG } from '../config/layoutConfig';
import type { CalendarEvent } from '../types/event';
import { parseTime } from './timeUtils';

// 이벤트 위치 계산
export const getEventFullPosition = (
  startTime: string,
  endTime: string,
  cellHeight: number = CALENDAR_LAYOUT_CONFIG.CELL_HEIGHT
) => {
  const start = parseTime(startTime);
  const end = parseTime(endTime);

  const startMinutes = start.hour * 60 + start.minute;
  const endMinutes = end.hour * 60 + end.minute;
  const durationMinutes = endMinutes - startMinutes;

  return {
    top: (startMinutes / 60) * cellHeight,
    height: Math.max((durationMinutes / 60) * cellHeight, CALENDAR_LAYOUT_CONFIG.MIN_EVENT_HEIGHT),
  };
};

// 두 이벤트 겹침 확인용
export const eventsOverlap = (event1: CalendarEvent, event2: CalendarEvent): boolean => {
  if (event1.date !== event2.date) return false;

  const getMinutes = (timeString: string) => {
    const { hour, minute } = parseTime(timeString);
    return hour * 60 + minute;
  };

  const start1 = getMinutes(event1.startTime);
  const end1 = getMinutes(event1.endTime);
  const start2 = getMinutes(event2.startTime);
  const end2 = getMinutes(event2.endTime);

  return start1 < end2 && start2 < end1;
};

// 겹침 레이아웃 계산
export const calculateOverlapLayout = (events: CalendarEvent[], targetEvent: CalendarEvent) => {
  // 같은 날짜의 겹치는 이벤트들 찾기
  const sameDay = events.filter(event => event.date === targetEvent.date);
  const overlapping = sameDay.filter(
    event => event.id === targetEvent.id || eventsOverlap(event, targetEvent)
  );

  // 겹치지 않으면 전체 너비
  if (overlapping.length <= 1) {
    return {
      left: '2px',
      right: '2px',
      width: 'calc(100% - 4px)',
      zIndex: 1,
    };
  }

  const targetIndex = overlapping
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .findIndex(event => event.id === targetEvent.id);

  const total = overlapping.length;
  const width = Math.floor(100 / total);
  const left = targetIndex * width;

  return {
    left: `${left}%`,
    right: 'auto',
    width: `${width}%`,
    zIndex: targetIndex + 1,
  };
};
