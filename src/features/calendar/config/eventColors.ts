export const EVENT_COLORS = [
  'bg-blue-500 hover:bg-blue-600',
  'bg-green-500 hover:bg-green-600',
  'bg-purple-500 hover:bg-purple-600',
  'bg-orange-500 hover:bg-orange-600',
  'bg-red-500 hover:bg-red-600',
  'bg-indigo-500 hover:bg-indigo-600',
  'bg-pink-500 hover:bg-pink-600',
  'bg-teal-500 hover:bg-teal-600',
] as const;

export type EventColor = (typeof EVENT_COLORS)[number];
