import type { RepeatType } from '../types/event';

export const EVENT_CONFIG = {
  DEFAULT_TITLE: '(제목 없음)',
  DEFAULT_REPEAT_TYPE: 'none' as RepeatType,
  DEFAULT_DURATION_HOURS: 1,

  REPEAT_OPTIONS: [
    { value: 'none' as const, label: '반복 안함' },
    { value: 'daily' as const, label: '매일' },
    { value: 'weekly' as const, label: '매주' },
    { value: 'monthly' as const, label: '매월' },
  ],
} as const;

export type EventConfig = typeof EVENT_CONFIG;
export type RepeatOption = (typeof EVENT_CONFIG.REPEAT_OPTIONS)[number];
