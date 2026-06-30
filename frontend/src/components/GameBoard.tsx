import { memo, useEffect } from "react";
import { socket, type GameData } from "../socket";
import "./CameBoard.css";

function GameBoard({ gameData }: { gameData: GameData }) {
  const { role, gameId } = gameData;
  const coordinates =
    gameData.role === "seeker"
      ? gameData.seeker.coordinates
      : (gameData.hider?.coordinates ?? [0, 0]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          socket.emit("gameAction", { action: "up", gameId, role });
          break;
        case "ArrowDown":
          socket.emit("gameAction", { action: "down", gameId, role });
          break;
        case "ArrowLeft":
          socket.emit("gameAction", { action: "left", gameId, role });
          break;
        case "ArrowRight":
          socket.emit("gameAction", { action: "right", gameId, role });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameId, role]);

  useEffect(() => {
    const onGameAction = (res: unknown) => {
      console.log("🚀 ~ onGameAction ~ res:", res);
    };
    socket.on("gameAction", onGameAction);

    return () => {
      socket.off("gameAction", onGameAction);
    };
  }, []);

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

export default memo(GameBoard);

const tenIndexArray = Array.from({ length: 10 }, (_, i) => i);
const BOARD = Array.from({ length: 10 }, () => tenIndexArray);
