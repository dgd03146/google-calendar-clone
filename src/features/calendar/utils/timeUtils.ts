export const formatHour = (hour: number): string => {
  return hour === 0
    ? ''
    : hour < 12
      ? `오전 ${hour}시`
      : hour === 12
        ? '오후 12시'
        : `오후 ${hour - 12}시`;
};
