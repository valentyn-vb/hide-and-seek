import type { GameData } from "../socket";
import "./CameBoard.css";

const tenIndexArray = Array.from({ length: 10 }, (_, i) => i);
const BOARD = Array.from({ length: 10 }, () => tenIndexArray);

export default function GameBoard({ gameData }: { gameData: GameData }) {
  const coordinates = gameData[gameData.role].coordinates;
  return (
    <div className="grid grid-cols-10 w-fit">
      {BOARD.map((row, rowIndex) =>
        row.map((_, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            data-y={rowIndex}
            data-x={colIndex}
            className="w-[100px] h-[100px] border border-black flex items-center justify-center "
          >
            {coordinates[0] === rowIndex + 1 &&
              coordinates[1] === colIndex + 1 &&
              "👨"}
          </div>
        )),
      )}
    </div>
  );
}
