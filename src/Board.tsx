import { useMemo } from "react";
import { Position } from "./constants";

interface Props {
  isEnding: boolean;
  apple: Position[];
  snake: Position[];
  rows: number;
  cols: number;
}

// const tableArr = new Array(rows).fill(0).map(() => new Array(AREA.COL).fill(0));

function isSamePosition(item: Position[], x: number, y: number): boolean {
  // return item.x === x && item.y === y;
  return item.find((p) => p.x === x && p.y === y) !== undefined;
}

export default function Board({ isEnding, apple, snake, rows, cols }: Props) {
  const tableArr = useMemo(() => {
    return new Array(rows).fill(0).map(() => new Array(cols).fill(0));
  }, [rows, cols]);

  function renderTable() {
    return tableArr.map((row, rowIndex) => {
      return (
        <div className="row" key={rowIndex}>
          {row.map((col, colIndex) => {
            const isApple = isSamePosition(apple, colIndex, rowIndex);
            const isSnake = isSamePosition(snake, colIndex, rowIndex);
            return (
              <div
                className={
                  isApple ? "col apple" : isSnake ? "col snake" : "col"
                }
                key={colIndex}
              />
            );
          })}
        </div>
      );
    });
  }

  return (
    <div className={isEnding ? "board end" : "board"}>{renderTable()}</div>
  );
}
