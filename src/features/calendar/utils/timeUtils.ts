export const formatHour = (hour: number): string => {
  return hour === 0
    ? ''
    : hour < 12
      ? `오전 ${hour}시`
      : hour === 12
        ? '오후 12시'
        : `오후 ${hour - 12}시`;
};

export const formatTimeWithPeriod = (hour: number, minute: number = 0): string => {
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const minuteStr = minute.toString().padStart(2, '0');
  return `${period} ${displayHour}:${minuteStr}`;
};

export const generateTimeOptions = (): Array<{
  value: string;
  label: string;
  hour: number;
  minute: number;
}> => {
  const options = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const label = formatTimeWithPeriod(hour, minute);
      options.push({ value, label, hour, minute });
    }
  }

  return options;
};

export const parseTime = (timeString: string): { hour: number; minute: number } => {
  const [hourStr, minuteStr] = timeString.split(':');
  return {
    hour: parseInt(hourStr, 10),
    minute: parseInt(minuteStr, 10),
  };
};

export const calculateEndTime = (startTimeValue: string): string => {
  const { hour, minute } = parseTime(startTimeValue);

  let endHour = hour + 1;
  let endMinute = minute;

  if (endHour >= 24) {
    endHour = 23;
    endMinute = 59;
  }

  return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
};
