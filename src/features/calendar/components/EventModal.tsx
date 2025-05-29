import { ChevronDown, Clock, X } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  selectedHour?: number;
  position?: { x: number; y: number };
}

interface TimeOption {
  value: string;
  label: string;
  hour: number;
  minute: number;
}

export const EventModal = ({
  isOpen,
  onClose,
  selectedDate = new Date(),
  selectedHour = 9,
  position = { x: 0, y: 0 },
}: EventModalProps) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(`${selectedHour.toString().padStart(2, '0')}:00`);
  const [endTime, setEndTime] = useState(`${(selectedHour + 1).toString().padStart(2, '0')}:00`);
  const [showStartTimeDropdown, setShowStartTimeDropdown] = useState(false);
  const [showEndTimeDropdown, setShowEndTimeDropdown] = useState(false);

  const formatTimeWithPeriod = (hour: number, minute: number = 0): string => {
    const period = hour < 12 ? '오전' : '오후';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const minuteStr = minute.toString().padStart(2, '0');
    return `${period} ${displayHour}:${minuteStr}`;
  };

  const generateTimeOptions = (): TimeOption[] => {
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

  const parseTime = (timeString: string): { hour: number; minute: number } => {
    const [hourStr, minuteStr] = timeString.split(':');
    return {
      hour: parseInt(hourStr, 10),
      minute: parseInt(minuteStr, 10),
    };
  };

  const calculateEndTime = (startTimeValue: string): string => {
    const { hour, minute } = parseTime(startTimeValue);
    let endHour = hour + 1;
    let endMinute = minute;

    if (endHour >= 24) {
      endHour = 23;
      endMinute = 59;
    }

    return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
  };

  const timeOptions = generateTimeOptions();

  const handleStartTimeChange = (timeValue: string) => {
    setStartTime(timeValue);
    setEndTime(calculateEndTime(timeValue));
    setShowStartTimeDropdown(false);
  };

  const handleEndTimeChange = (timeValue: string) => {
    setEndTime(timeValue);
    setShowEndTimeDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Event created:', { title, selectedDate, startTime, endTime });
    onClose();
  };

  const handleOverlayClick = () => {
    setShowStartTimeDropdown(false);
    setShowEndTimeDropdown(false);
  };

  if (!isOpen) return null;

  const startTimeParsed = parseTime(startTime);
  const endTimeParsed = parseTime(endTime);

  const modalContent = (
    <>
      <div className="fixed inset-0 z-40 bg-black bg-opacity-25" onClick={handleOverlayClick} />

      <div
        className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 w-96"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className="flex items-center justify-between py-2 px-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">새 이벤트</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <input
              type="text"
              placeholder="제목 추가"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-base font-medium border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div className="flex items-start space-x-3 py-2">
            <Clock className="h-4 w-4 text-gray-500 mt-1" />
            <div className="flex-1">
              <div className="text-sm text-gray-700 mb-2">
                {selectedDate.toLocaleDateString('ko-KR')}
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowStartTimeDropdown(!showStartTimeDropdown);
                      setShowEndTimeDropdown(false);
                    }}
                    className="flex items-center justify-between w-full text-sm text-gray-600 hover:bg-gray-50 p-2 rounded border"
                  >
                    <span>
                      {formatTimeWithPeriod(startTimeParsed.hour, startTimeParsed.minute)}
                    </span>
                    <ChevronDown className="h-3 w-3 text-gray-500" />
                  </button>

                  {showStartTimeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-30 max-h-48 overflow-y-auto">
                      {timeOptions.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleStartTimeChange(option.value)}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-sm text-gray-500">-</span>

                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEndTimeDropdown(!showEndTimeDropdown);
                      setShowStartTimeDropdown(false);
                    }}
                    className="flex items-center justify-between w-full text-sm text-gray-600 hover:bg-gray-50 p-2 rounded border"
                  >
                    <span>{formatTimeWithPeriod(endTimeParsed.hour, endTimeParsed.minute)}</span>
                    <ChevronDown className="h-3 w-3 text-gray-500" />
                  </button>

                  {showEndTimeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-30 max-h-48 overflow-y-auto">
                      {timeOptions.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleEndTimeChange(option.value)}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </>
  );

  return createPortal(modalContent, document.getElementById('modal-root') || document.body);
};
