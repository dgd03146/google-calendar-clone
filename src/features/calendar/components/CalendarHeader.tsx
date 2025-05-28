'use client';

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

import { addWeeks, format, subWeeks } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState } from 'react';

export const CalendarHeader = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('week');
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);

  const handlePrevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const toggleViewDropdown = () => {
    setIsViewDropdownOpen(prev => !prev);
  };

  const handleViewChange = (mode: 'month' | 'week') => {
    setViewMode(mode);
    setIsViewDropdownOpen(false);
  };

  return (
    <header className="flex items-center justify-between p-2 border-b border-gray-200 bg-white h-[64px]">
      <div className="items-center gap-4 w-[256px] pr-[25px] hidden md:flex">
        <button className="cursor-pointer">
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
            <span className="text-white text-sm font-medium">{format(new Date(), 'd')}</span>
          </div>
          <span className="text-xl font-normal text-gray-700">캘린더</span>
        </div>
      </div>

      <div className="flex justify-between items-center flex-1">
        <div className="flex items-center gap-4">
          <button
            onClick={handleToday}
            className="text-sm bg-white border border-gray-200 rounded-md px-2 py-1 cursor-pointer"
          >
            오늘
          </button>

          <div className="flex items-center gap-1">
            <button onClick={handlePrevWeek} className="cursor-pointer">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={handleNextWeek} className="cursor-pointer">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <h1 className="text-xl font-normal text-gray-700">
            {format(currentDate, 'yyyy년 M월', { locale: ko })}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={toggleViewDropdown}
              className="flex items-center border border-gray-200 rounded-md px-3 py-1 text-sm cursor-pointer"
            >
              {viewMode === 'month' ? '월' : '주'}
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>

            {isViewDropdownOpen && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10">
                <button
                  onClick={() => handleViewChange('week')}
                  className={`block w-full text-left px-4 py-2 text-sm cursor-pointer ${
                    viewMode === 'week' ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  주
                </button>
                <button
                  onClick={() => handleViewChange('month')}
                  className={`block w-full text-left px-4 py-2 text-sm cursor-pointer ${
                    viewMode === 'month' ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  월
                </button>
              </div>
            )}
          </div>

          <div className="items-center gap-4 hidden md:flex">
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
        </div>
      </div>
    </header>
  );
};
