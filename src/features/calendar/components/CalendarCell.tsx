interface CalendarCellProps {
  day: Date;
  hour: number;
  onCellClick?: (day: Date, hour: number) => void;
}

export const CalendarCell = ({ day, hour, onCellClick }: CalendarCellProps) => {
  return (
    <div
      className={`h-20 border-b border-gray-100 hover:bg-blue-50 transition-colors ${
        onCellClick ? 'cursor-pointer' : ''
      }`}
      onClick={onCellClick ? () => onCellClick(day, hour) : undefined}
    />
  );
};
