import { KeyboardEvent, useEffect, useState, useRef, useCallback } from "react";
import "./styles.scss";
import Board from "./Board";
import { INITIAL, Position, KEYBOARD, MODE } from "./constants";

export default function App() {
  const [board, setBoard] = useState<{ rows: number; cols: number }>(
    INITIAL.BOARD
  );
  const [apple, setApple] = useState<Position[]>(INITIAL.APPLE);
  const [snake, setSnake] = useState<Position[]>(INITIAL.SNAKE);
  const [mode, setMode] = useState<MODE>(MODE.START);
  const [direction, setDirection] = useState<KEYBOARD>(KEYBOARD.ArrowRight);
  const [prevDirection, setPrevDirection] = useState<KEYBOARD>(
    KEYBOARD.ArrowRight
  );
  const gameInterval = useRef<any>();
  const level = Math.floor((snake.length - INITIAL.SNAKE.length) / 3) + 1;
  const speedMS = INITIAL.SPEED - 50 * (level - 1);

  function initialize() {
    setBoard(INITIAL.BOARD);
    setApple(INITIAL.APPLE);
    setSnake(INITIAL.SNAKE);
    setMode(MODE.START);
  }

  const handleKeyDown = useCallback(
    (e: globalThis.KeyboardEvent) => {
      e.preventDefault();
      if (Object.values(KEYBOARD).includes(e.key as KEYBOARD)) {
        // console.log("~~~" + e.key);
        setPrevDirection(direction);
        setDirection(e.key as KEYBOARD);
      }
    },
    [direction]
  );

  const updateFrames = useCallback(() => {
    if (mode === MODE.END) return;
    let newSnake = snake.concat();
    let newSnakeHead = { ...snake[0] };
    let newApple = apple.concat();

    // snake - movement
    // TODO: reverse
    switch (direction) {
      case KEYBOARD.ArrowUp:
      case KEYBOARD.w:
        if ([KEYBOARD.ArrowDown, KEYBOARD.s].some((s) => s === prevDirection)) {
          newSnake.reverse();
        }
        newSnakeHead = {
          ...newSnake[0],
          y: newSnake[0].y - 1
        };
        break;
      case KEYBOARD.ArrowDown:
      case KEYBOARD.s:
        if ([KEYBOARD.ArrowUp, KEYBOARD.w].some((s) => s === prevDirection)) {
          newSnake.reverse();
        }
        newSnakeHead = { ...newSnake[0], y: newSnake[0].y + 1 };
        break;
      case KEYBOARD.ArrowLeft:
      case KEYBOARD.a:
        if (
          [KEYBOARD.ArrowRight, KEYBOARD.d].some((s) => s === prevDirection)
        ) {
          newSnake.reverse();
        }
        newSnakeHead = {
          ...newSnake[0],
          x: newSnake[0].x - 1
        };
        break;
      case KEYBOARD.ArrowRight:
      case KEYBOARD.d:
        if ([KEYBOARD.ArrowLeft, KEYBOARD.a].some((s) => s === prevDirection)) {
          newSnake.reverse();
        }
        newSnakeHead = { ...newSnake[0], x: newSnake[0].x + 1 };
        break;
    }

    if (
      newSnakeHead.x >= board.cols ||
      newSnakeHead.x < 0 ||
      newSnakeHead.y >= board.rows ||
      newSnakeHead.y < 0 ||
      snake.some((s) => s.x === newSnakeHead.x && s.y === newSnakeHead.y)
    ) {
      setMode(MODE.END);
    } else {
      newSnake.unshift(newSnakeHead);

      // apple
      let eatenAppleIndex = newApple.findIndex(
        (f) => f.x === newSnakeHead.x && f.y === newSnakeHead.y
      );
      if (eatenAppleIndex > -1) {
        let randomApple: Position;
        newApple.splice(eatenAppleIndex, 1);
        do {
          randomApple = {
            x: Math.floor(Math.random() * board.cols),
            y: Math.floor(Math.random() * board.rows)
          };
        } while (
          newSnake.some(
            (s) => s.x === randomApple.x && s.y === randomApple.y
          ) ||
          apple.some((s) => s.x === randomApple.x && s.y === randomApple.y)
        );
        newApple.push(randomApple);
      } else {
        newSnake.pop();
      }

      setSnake([...newSnake]);
      setApple([...newApple]);
    }
  }, [direction, mode, snake, apple, board.cols, board.rows, prevDirection]);

  useEffect(() => {
    gameInterval.current = setInterval(
      updateFrames,
      speedMS
      // INITIAL.SPEED - 50 * Math.floor((snake.length - INITIAL.SNAKE.length) / 3)
    );

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(gameInterval.current);
    };
  }, [updateFrames, handleKeyDown, snake.length, speedMS]);

  return (
    <div className="App">
      <div className="info">
        <div>score: {snake.length - INITIAL.SNAKE.length}</div>
        <div>level: {level}</div>
        <div>ms: {speedMS} </div>
      </div>
      <Board
        rows={board.rows}
        cols={board.cols}
        isEnding={mode === MODE.END}
        apple={apple}
        snake={snake}
      />
    </div>
  );
}
