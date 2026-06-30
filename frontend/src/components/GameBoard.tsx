import { memo, useEffect, useState } from "react";
import { BOARD } from "../constants/board";
import { socket, type GameData } from "../socket";
import type { GameActionResponse } from "../types/game";
import "./CameBoard.css";

function GameBoard({ gameData }: { gameData: GameData }) {
  const { role, gameId } = gameData;
  const [seekerCoordinates, setSeekerCoordinates] = useState(
    gameData.seeker.coordinates,
  );
  const [hiderCoordinates, setHiderCoordinates] = useState(
    gameData.hider?.coordinates,
  );
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
    socket.on("gameAction", (res: GameActionResponse) => {
      if (res.role === "seeker") {
        setSeekerCoordinates(res.newCoordinates);
      } else if (res.role === "hider") {
        setHiderCoordinates(res.newCoordinates);
      }
    });
  }, []);

  const getOccupant = (rowIndex: number, colIndex: number) => {
    if (
      seekerCoordinates[0] === rowIndex + 1 &&
      seekerCoordinates[1] === colIndex + 1
    ) {
      return <span>🏃</span>;
    }
    if (
      hiderCoordinates[0] === rowIndex + 1 &&
      hiderCoordinates[1] === colIndex + 1
    ) {
      return <span>🙈</span>;
    }
    return null;
  };

  return (
    <div className="grid grid-cols-10 w-fit">
      {BOARD.map((row, rowIndex) =>
        row.map((_, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            data-y={rowIndex}
            data-x={colIndex}
            className="w-[100px] h-[100px] border border-black flex items-center justify-center"
          >
            {getOccupant(rowIndex, colIndex)}
          </div>
        )),
      )}
    </div>
  );
}

export default memo(GameBoard);
