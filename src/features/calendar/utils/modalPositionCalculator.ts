import type { BreakpointState } from '@/hooks/useBreakpoint';

export interface ModalPositionParams {
  rect: DOMRect;
  viewport: BreakpointState;
}

export interface ModalPosition {
  x: number;
  y: number;
}

export const calculateModalPosition = ({ rect, viewport }: ModalPositionParams): ModalPosition => {
  const { width, height, isMobile, isTablet } = viewport;

  let modalWidth: number;
  const modalHeight = 500;
  const padding = 10;

  if (isMobile) {
    modalWidth = Math.min(width - 20, 360);
  } else if (isTablet) {
    modalWidth = 400;
  } else {
    modalWidth = 448;
  }

  let x: number;
  let y: number;

  if (isMobile) {
    x = (width - modalWidth) / 2;
    y = Math.max(padding, (height - modalHeight) / 2);
  } else {
    x = rect.left + rect.width + padding;
    y = rect.top;

    if (x + modalWidth > width) {
      x = rect.left - modalWidth - padding;
    }

    if (x < padding) {
      x = padding;
    }

    if (y + modalHeight > height) {
      y = height - modalHeight - padding;
    }

    if (y < padding) {
      y = padding;
    }
  }

  return { x, y };
};
