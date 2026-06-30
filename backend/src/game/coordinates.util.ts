import { BOARD_MAX, BOARD_MIN } from './game.constants';
import type { Coordinates, GameAction } from './game.types';

export function clampCoordinate(value: number): number {
  return Math.min(BOARD_MAX, Math.max(BOARD_MIN, value));
}

export function getNewCoordinates(
  [row, col]: Coordinates,
  action: GameAction,
): Coordinates {
  switch (action) {
    case 'up':
      return [clampCoordinate(row - 1), col];
    case 'down':
      return [clampCoordinate(row + 1), col];
    case 'left':
      return [row, clampCoordinate(col - 1)];
    case 'right':
      return [row, clampCoordinate(col + 1)];
  }
}
