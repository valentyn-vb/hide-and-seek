export const BOARD_SIZE = 10;

const rowIndices = Array.from({ length: BOARD_SIZE }, (_, i) => i);

export const BOARD = Array.from({ length: BOARD_SIZE }, () => rowIndices);
