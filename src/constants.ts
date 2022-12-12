export interface Position {
  x: number;
  y: number;
}

export const INITIAL = {
  APPLE: [
    { x: 4, y: 5 },
    { x: 5, y: 8 }
  ],
  SNAKE: [
    { x: 2, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 0 }
  ],
  BOARD: { rows: 10, cols: 10 }
};

export enum MODE {
  START = "START",
  PLAYING = "PLAYING",
  END = "END"
}

export enum KEYBOARD {
  ArrowUp = "ArrowUp",
  ArrowDown = "ArrowDown",
  ArrowLeft = "ArrowLeft",
  ArrowRight = "ArrowRight",
  w = "w",
  a = "a",
  s = "s",
  d = "d"
}
