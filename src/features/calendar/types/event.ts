export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface CalendarEvent {
  id: string;
  title?: string;
  date: string;
  startTime: string;
  endTime: string;
  repeatType?: RepeatType;
  createdAt: string;
}

export type CreateEventData = Omit<CalendarEvent, 'id' | 'createdAt'>;
