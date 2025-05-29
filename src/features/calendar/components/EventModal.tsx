import { X } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

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
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Event created:', { title, selectedDate, selectedHour });
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <>
      <div className="fixed inset-0 z-40 bg-black bg-opacity-25" onClick={onClose} />

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

          <div className="text-sm text-gray-600">
            <p>날짜: {selectedDate.toLocaleDateString('ko-KR')}</p>
            <p>시간: {selectedHour}:00</p>
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
