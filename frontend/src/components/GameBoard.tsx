import { useEffect, useState } from "react";
import { socket, type GameData } from "../socket";
import "./CameBoard.css";

export default function GameBoard({ gameData }: { gameData: GameData }) {
  const { start, duration, role, gameId } = gameData;
  const coordinates =
    gameData.role === "seeker"
      ? gameData.seeker.coordinates
      : (gameData.hider?.coordinates ?? [0, 0]);

  const [timeLeft, setTimeLeft] = useState(() =>
    calculateTimeLeft(start, duration),
  );

  useEffect(() => {
    const tick = () => {
      setTimeLeft(calculateTimeLeft(start, duration));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [start, duration]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          socket.emit("gameAction", { action: "up", gameId });
          break;
        case "ArrowDown":
          socket.emit("gameAction", { action: "down", gameId });

          break;
        case "ArrowLeft":
          socket.emit("gameAction", { action: "left", gameId });

          break;
        case "ArrowRight":
          socket.emit("gameAction", { action: "right", gameId });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <>
      <p>
        Role: {role} · Time left: {formatTime(timeLeft)}
      </p>
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
    </>
  );
}

const tenIndexArray = Array.from({ length: 10 }, (_, i) => i);
const BOARD = Array.from({ length: 10 }, () => tenIndexArray);

const calculateTimeLeft = (startTime: number, duration: number) =>
  Math.max(0, duration - (Date.now() - startTime));

const formatTime = (ms: number) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
