export const CALENDAR_LAYOUT_CONFIG = {
  MIN_EVENT_HEIGHT: 20,
  CELL_HEIGHT: 80,
} as const;

export type CalendarLayoutConfig = typeof CALENDAR_LAYOUT_CONFIG;
