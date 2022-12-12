import { KeyboardEvent, useEffect, useState, useRef, useCallback } from "react";
import "./styles.scss";
import Board from "./Board";
import { INITIAL, Position, KEYBOARD, MODE } from "./constants";

export default function App() {
  const [level, setLevel] = useState<{ rows: number; cols: number }>(
    INITIAL.BOARD
  );
  const [apple, setApple] = useState<Position[]>(INITIAL.APPLE);
  const [snake, setSnake] = useState<Position[]>(INITIAL.SNAKE);
  const [mode, setMode] = useState<MODE>(MODE.START);
  const [direction, setDirection] = useState<KEYBOARD>(KEYBOARD.ArrowRight);
  const gameInterval = useRef<any>();

  function initialize() {
    setLevel(INITIAL.BOARD);
    setApple(INITIAL.APPLE);
    setSnake(INITIAL.SNAKE);
    setMode(MODE.START);
  }

  const handleKeyDown = useCallback((e: globalThis.KeyboardEvent) => {
    e.preventDefault();
    if (Object.values(KEYBOARD).includes(e.key as KEYBOARD)) {
      // console.log("~~~" + e.key);
      setDirection(e.key as KEYBOARD);
    }
  }, []);

  const collisionDetection = useCallback(
    (direction: "x" | "y", position: Position): boolean => {
      return (
        (direction === "x" && (position.x >= level.cols || position.x < 0)) ||
        (direction === "y" && (position.y >= level.rows || position.y < 0))
      );
    },
    [level.cols, level.rows]
  );

  const updateFrames = useCallback(() => {
    if (mode === MODE.END) return;
    let newSnake = snake.concat();
    let newSnakeHead = { ...snake[0] };
    let newApple = apple.concat();
    let collision = false;
    // console.log("now: " + direction);

    // snake - movement
    switch (direction) {
      case KEYBOARD.ArrowUp:
      case KEYBOARD.w:
        newSnakeHead = { ...newSnakeHead, y: newSnakeHead.y - 1 };
        collision = collisionDetection("y", newSnakeHead);
        // newSnake = newSnake.map((p) => ({ ...p, y: p.y - 1 }));
        break;
      case KEYBOARD.ArrowDown:
      case KEYBOARD.s:
        newSnakeHead = { ...newSnakeHead, y: newSnakeHead.y + 1 };
        collision = collisionDetection("y", newSnakeHead);
        break;
      case KEYBOARD.ArrowLeft:
      case KEYBOARD.a:
        newSnakeHead = { ...newSnakeHead, x: newSnakeHead.x - 1 };
        collision = collisionDetection("x", newSnakeHead);
        break;
      case KEYBOARD.ArrowRight:
      case KEYBOARD.d:
        newSnakeHead = { ...newSnakeHead, x: newSnakeHead.x + 1 };
        collision = collisionDetection("x", newSnakeHead);
        break;
    }

    if (collision) {
      setMode(MODE.END);
    } else {
      newSnake.unshift(newSnakeHead);

      // apple
      let eatenAppleIndex = newApple.findIndex(
        (f) => f.x === newSnakeHead.x && f.y === newSnakeHead.y
      );
      if (eatenAppleIndex > -1) {
        newApple.splice(eatenAppleIndex, 1);
      } else {
        newSnake.pop();
      }

      setSnake([...newSnake]);
      setApple([...newApple]);
    }
  }, [direction, mode, snake, apple, collisionDetection]);

  useEffect(() => {
    gameInterval.current = setInterval(updateFrames, 500);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(gameInterval.current);
    };
  }, [updateFrames, handleKeyDown]);

  return (
    <div className="App">
      <Board
        rows={level.rows}
        cols={level.cols}
        isEnding={mode === MODE.END}
        apple={apple}
        snake={snake}
      />
    </div>
  );
}
