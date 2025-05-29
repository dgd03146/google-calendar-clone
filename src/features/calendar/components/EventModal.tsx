import { useAppDispatch } from '@/store/hooks';
import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronDown, Clock, Repeat, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { EVENT_CONFIG } from '../config/eventConfig';
import { addEvent, deleteEvent, updateEvent } from '../store/eventsSlice';
import type { CalendarEvent, CreateEventData, RepeatType } from '../types/event';
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
  editingEvent?: CalendarEvent | null;
}

interface EventFormState extends Omit<CreateEventData, 'date'> {
  date: Date;
}

interface DropdownState {
  showDatePicker: boolean;
  showStartTimeDropdown: boolean;
  showEndTimeDropdown: boolean;
  showRepeatDropdown: boolean;
}

export const EventModal = ({
  isOpen,
  onClose,
  selectedDate = new Date(),
  selectedHour = 9,
  editingEvent,
}: EventModalProps) => {
  const dispatch = useAppDispatch();
  const modalRef = useRef<HTMLDivElement>(null);
  const isEditMode = !!editingEvent;

  const [formState, setFormState] = useState<EventFormState>(() => ({
    title: editingEvent?.title || '',
    date: editingEvent ? parse(editingEvent.date, 'yyyy-MM-dd', new Date()) : selectedDate,
    startTime: editingEvent?.startTime || `${selectedHour.toString().padStart(2, '0')}:00`,
    endTime: editingEvent?.endTime || `${(selectedHour + 1).toString().padStart(2, '0')}:00`,
    repeatType: editingEvent?.repeatType || EVENT_CONFIG.DEFAULT_REPEAT_TYPE,
  }));

  const [dropdownState, setDropdownState] = useState<DropdownState>({
    showDatePicker: false,
    showStartTimeDropdown: false,
    showEndTimeDropdown: false,
    showRepeatDropdown: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const updateFormState = (updates: Partial<EventFormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  const updateDropdownState = (updates: Partial<DropdownState>) => {
    setDropdownState(prev => ({ ...prev, ...updates }));
  };

  const closeAllDropdowns = () => {
    setDropdownState({
      showDatePicker: false,
      showStartTimeDropdown: false,
      showEndTimeDropdown: false,
      showRepeatDropdown: false,
    });
  };

  useEffect(() => {
    if (isOpen) {
      setDropdownState({
        showDatePicker: false,
        showStartTimeDropdown: false,
        showEndTimeDropdown: false,
        showRepeatDropdown: false,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingEvent) {
      setFormState({
        title: editingEvent.title || '',
        date: parse(editingEvent.date, 'yyyy-MM-dd', new Date()),
        startTime: editingEvent.startTime,
        endTime: editingEvent.endTime,
        repeatType: editingEvent.repeatType || EVENT_CONFIG.DEFAULT_REPEAT_TYPE,
      });
    } else {
      updateFormState({ date: selectedDate });
    }
  }, [editingEvent, selectedDate]);

  useEffect(() => {
    if (!editingEvent) {
      const newStartTime = `${selectedHour.toString().padStart(2, '0')}:00`;
      const newEndTime = calculateEndTime(newStartTime);
      updateFormState({
        startTime: newStartTime,
        endTime: newEndTime,
      });
    }
  }, [selectedHour, editingEvent]);

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

  const getEndTimeOptions = () => {
    const startTimeMinutes =
      parseTime(formState.startTime).hour * 60 + parseTime(formState.startTime).minute;
    return timeOptions.filter(option => {
      const optionTime = parseTime(option.value);
      const optionMinutes = optionTime.hour * 60 + optionTime.minute;
      return optionMinutes > startTimeMinutes;
    });
  };

  const handleDateSelect = (newDate: Date) => {
    updateFormState({ date: newDate });
    updateDropdownState({ showDatePicker: false });
  };

  const handleStartTimeChange = (timeValue: string) => {
    const updates: Partial<EventFormState> = { startTime: timeValue };

    const newStartMinutes = parseTime(timeValue).hour * 60 + parseTime(timeValue).minute;
    const currentEndMinutes =
      parseTime(formState.endTime).hour * 60 + parseTime(formState.endTime).minute;

    if (currentEndMinutes <= newStartMinutes) {
      updates.endTime = calculateEndTime(timeValue);
    }

    updateFormState(updates);
    updateDropdownState({ showStartTimeDropdown: false });
  };

  const handleEndTimeChange = (timeValue: string) => {
    updateFormState({ endTime: timeValue });
    updateDropdownState({ showEndTimeDropdown: false });
  };

  const handleRepeatChange = (type: RepeatType) => {
    updateFormState({ repeatType: type });
    updateDropdownState({ showRepeatDropdown: false });
  };

  const getRepeatLabel = (type: RepeatType) => {
    const option = EVENT_CONFIG.REPEAT_OPTIONS.find(opt => opt.value === type);
    return option?.label || EVENT_CONFIG.REPEAT_OPTIONS[0].label;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);

    try {
      const eventData: CreateEventData = {
        title: formState.title?.trim() || EVENT_CONFIG.DEFAULT_TITLE,
        date: format(formState.date, 'yyyy-MM-dd'),
        startTime: formState.startTime,
        endTime: formState.endTime,
        repeatType: formState.repeatType || EVENT_CONFIG.DEFAULT_REPEAT_TYPE,
      };

      if (isEditMode && editingEvent) {
        dispatch(updateEvent({ id: editingEvent.id, data: eventData }));
        alert('이벤트가 수정되었습니다!');
      } else {
        dispatch(addEvent(eventData));
        alert('이벤트가 저장되었습니다!');
      }

      if (!isEditMode) {
        updateFormState({ title: '', repeatType: EVENT_CONFIG.DEFAULT_REPEAT_TYPE });
      }

      onClose();
    } catch (error) {
      console.error('Failed to save event:', error);
      alert('이벤트 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingEvent) return;

    if (confirm('이벤트를 삭제하시겠습니까?')) {
      try {
        dispatch(deleteEvent(editingEvent.id));
        alert('이벤트가 삭제되었습니다!');
        onClose();
      } catch (error) {
        console.error('Failed to delete event:', error);
        alert('이벤트 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  if (!isOpen) return null;

  const startTimeParsed = parseTime(formState.startTime);
  const endTimeParsed = parseTime(formState.endTime);

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-md h-auto pointer-events-auto"
      >
        <div className="flex items-center justify-between py-2 px-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">{isEditMode ? '이벤트 수정' : '새 이벤트'}</h2>
          <div className="flex items-center space-x-1">
            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-1 hover:bg-red-100 rounded-full transition-colors"
                title="이벤트 삭제"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <input
              type="text"
              placeholder="제목 추가"
              value={formState.title || ''}
              onChange={e => updateFormState({ title: e.target.value })}
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
                    updateDropdownState({ showDatePicker: !dropdownState.showDatePicker });
                    closeAllDropdowns();
                    updateDropdownState({ showDatePicker: !dropdownState.showDatePicker });
                  }}
                  className="flex items-center justify-between w-full text-sm text-gray-700 hover:bg-gray-50 p-2 rounded border"
                >
                  <span>{format(formState.date, 'M월 d일 (E)', { locale: ko })}</span>
                  <ChevronDown className="h-3 w-3 text-gray-500" />
                </button>

                {dropdownState.showDatePicker && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-30">
                    <MiniCalendar selectedDate={formState.date} onDateSelect={handleDateSelect} />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      closeAllDropdowns();
                      updateDropdownState({
                        showStartTimeDropdown: !dropdownState.showStartTimeDropdown,
                      });
                    }}
                    className="flex items-center justify-between w-full text-sm text-gray-600 hover:bg-gray-50 p-2 rounded border"
                  >
                    <span>
                      {formatTimeWithPeriod(startTimeParsed.hour, startTimeParsed.minute)}
                    </span>
                    <ChevronDown className="h-3 w-3 text-gray-500" />
                  </button>

                  {dropdownState.showStartTimeDropdown && (
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
                      closeAllDropdowns();
                      updateDropdownState({
                        showEndTimeDropdown: !dropdownState.showEndTimeDropdown,
                      });
                    }}
                    className="flex items-center justify-between w-full text-sm text-gray-600 hover:bg-gray-50 p-2 rounded border"
                  >
                    <span>{formatTimeWithPeriod(endTimeParsed.hour, endTimeParsed.minute)}</span>
                    <ChevronDown className="h-3 w-3 text-gray-500" />
                  </button>

                  {dropdownState.showEndTimeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-30 max-h-48 overflow-y-auto">
                      {getEndTimeOptions().length > 0 ? (
                        getEndTimeOptions().map(option => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleEndTimeChange(option.value)}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {option.label}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          선택 가능한 시간이 없습니다
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3 py-2">
            <Repeat className="h-4 w-4 text-gray-500 mt-1" />
            <div className="flex-1">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    closeAllDropdowns();
                    updateDropdownState({ showRepeatDropdown: !dropdownState.showRepeatDropdown });
                  }}
                  className="flex items-center justify-between w-full text-sm text-gray-700 hover:bg-gray-50 p-2 rounded border"
                >
                  <span>
                    {getRepeatLabel(formState.repeatType || EVENT_CONFIG.DEFAULT_REPEAT_TYPE)}
                  </span>
                  <ChevronDown className="h-3 w-3 text-gray-500" />
                </button>

                {dropdownState.showRepeatDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-30">
                    {EVENT_CONFIG.REPEAT_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleRepeatChange(option.value)}
                        className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                          formState.repeatType === option.value
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
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
              disabled={isSaving}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modal-root')!);
};
