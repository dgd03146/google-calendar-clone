import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  HelpCircle,
  Menu,
  Search,
  Settings,
} from 'lucide-react';

import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useRef, useState } from 'react';
import {
  goToNextWeek,
  goToPrevWeek,
  goToToday,
  selectCurrentDate,
  selectViewMode,
  setViewMode,
} from '../store/calendarSlice';

export const CalendarHeader = () => {
  const breakpoint = useBreakpoint();
  const dispatch = useAppDispatch();

  const currentDate = useAppSelector(selectCurrentDate);
  const viewMode = useAppSelector(selectViewMode);

  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handlePrevWeek = () => {
    dispatch(goToPrevWeek());
  };

  const handleNextWeek = () => {
    dispatch(goToNextWeek());
  };

  const handleToday = () => {
    dispatch(goToToday());
  };

  const toggleViewDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsViewDropdownOpen(prev => !prev);
  };

  const handleViewChange = (mode: 'month' | 'week') => {
    dispatch(setViewMode(mode));
    setIsViewDropdownOpen(false);
  };

  const closeDropdown = () => {
    setIsViewDropdownOpen(false);
  };

  useClickOutside(dropdownRef, closeDropdown, isViewDropdownOpen);

  return (
    <header className="flex items-center justify-between py-2 px-4 border-b border-gray-200 bg-white max-h-[64px] min-h-[64px] sticky top-[0px] z-20">
      {!breakpoint.isMobile && (
        <div className="items-center gap-4 w-[256px] pr-[25px] flex">
          <button>
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-sm font-medium">{format(new Date(), 'd')}</span>
            </div>
            <span className="text-xl font-normal text-gray-700">캘린더</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center flex-1">
        <div className="flex items-center gap-4">
          <button
            onClick={handleToday}
            className="text-sm bg-white border border-gray-200 rounded-md px-2 py-2  hover:bg-gray-100 transition-all duration-300"
          >
            오늘
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevWeek}
              className=" hover:bg-gray-100 transition-all duration-300 rounded-full p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextWeek}
              className=" hover:bg-gray-100 transition-all duration-300 rounded-full p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <h1
            className={`font-normal text-gray-700 ${breakpoint.isMobile ? 'text-lg' : 'text-xl'}`}
          >
            {format(currentDate, 'yyyy년 M월', { locale: ko })}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleViewDropdown}
              className="flex items-center border border-gray-200 rounded-md px-3 py-1 text-sm "
            >
              {viewMode === 'month' ? '월' : '주'}
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>

            {isViewDropdownOpen && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md z-50">
                <button
                  onClick={() => handleViewChange('week')}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    viewMode === 'week' ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  주
                </button>
                <button
                  onClick={() => handleViewChange('month')}
                  className={`block w-full text-left px-4 py-2 text-sm  ${
                    viewMode === 'month' ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  월
                </button>
              </div>
            )}
          </div>

          {!breakpoint.isMobile && (
            <div className="items-center gap-4 flex">
              <button>
                <Search className="h-5 w-5" />
              </button>
              <button>
                <HelpCircle className="h-5 w-5" />
              </button>
              <button>
                <Settings className="h-5 w-5" />
              </button>
              <button>
                <Grid3X3 className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
