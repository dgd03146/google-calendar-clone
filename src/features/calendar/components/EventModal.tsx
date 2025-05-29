import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronDown, Clock, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  calculateEndTime,
  formatTimeWithPeriod,
  generateTimeOptions,
  parseTime,
} from '../utils/timeUtils';
import { MiniCalendar } from './MiniCalendar';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  selectedHour?: number;
  position?: { x: number; y: number };
}

export const EventModal = ({
  isOpen,
  onClose,
  selectedDate = new Date(),
  selectedHour = 9,
  position = { x: 0, y: 0 },
}: EventModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState(`${selectedHour.toString().padStart(2, '0')}:00`);
  const [endTime, setEndTime] = useState(`${(selectedHour + 1).toString().padStart(2, '0')}:00`);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimeDropdown, setShowStartTimeDropdown] = useState(false);
  const [showEndTimeDropdown, setShowEndTimeDropdown] = useState(false);

  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const newStartTime = `${selectedHour.toString().padStart(2, '0')}:00`;
    const newEndTime = calculateEndTime(newStartTime);
    setStartTime(newStartTime);
    setEndTime(newEndTime);
  }, [selectedHour]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const timeOptions = generateTimeOptions();

  const handleDateSelect = (newDate: Date) => {
    setDate(newDate);
    setShowDatePicker(false);
  };

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
    console.log('Event created:', { title, date, startTime, endTime });
    onClose();
  };

  if (!isOpen) return null;

  const startTimeParsed = parseTime(startTime);
  const endTimeParsed = parseTime(endTime);

  const modalContent = (
    <div
      ref={modalRef}
      className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 w-96"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="flex items-center justify-between py-2 px-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">새 이벤트</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
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
          <div className="flex-1 space-y-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowDatePicker(!showDatePicker);
                  setShowStartTimeDropdown(false);
                  setShowEndTimeDropdown(false);
                }}
                className="flex items-center justify-between w-full text-sm text-gray-700 hover:bg-gray-50 p-2 rounded border"
              >
                <span>{format(date, 'M월 d일 (E)', { locale: ko })}</span>
                <ChevronDown className="h-3 w-3 text-gray-500" />
              </button>

              {showDatePicker && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-30">
                  <MiniCalendar selectedDate={date} onDateSelect={handleDateSelect} />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowStartTimeDropdown(!showStartTimeDropdown);
                    setShowDatePicker(false);
                    setShowEndTimeDropdown(false);
                  }}
                  className="flex items-center justify-between w-full text-sm text-gray-600 hover:bg-gray-50 p-2 rounded border"
                >
                  <span>{formatTimeWithPeriod(startTimeParsed.hour, startTimeParsed.minute)}</span>
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
                    setShowDatePicker(false);
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
  );

  return createPortal(modalContent, document.getElementById('modal-root') || document.body);
};
