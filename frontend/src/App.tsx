import { useEffect, useState } from "react";
import "./App.css";
import GameBoard from "./components/GameBoard";
import GameTimer from "./components/GameTimer";
import { socket, type GameData, type PlayerRole } from "./socket";

function App() {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [message, setMessage] = useState("Click Join Game to find a match.");

  useEffect(() => {
    socket.connect();

    const disconnectOnLeave = () => {
      socket.disconnect();
    };
    window.addEventListener("pagehide", disconnectOnLeave);

    socket.on("gameJoined", ({ gameId, status }) => {
      setMessage(
        status === "waiting"
          ? `Created game ${gameId}. Waiting for another player...`
          : `Joined game ${gameId}.`,
      );
    });

    socket.on("gameStarted", (gameInfo) => {
      setGameData(gameInfo);
      setMessage(`Game ${gameInfo.gameId} started! You are ${gameInfo.role}`);
    });

    return () => {
      window.removeEventListener("pagehide", disconnectOnLeave);
      socket.off("gameJoined");
      socket.off("gameStarted");
      socket.disconnect();
    };
  }, []);

  function joinGame() {
    socket.emit("joinGame");
  }

  function onGameFinished(winner: PlayerRole) {
    const message = `finished! ${winner === gameData?.role ? "You" : "Opponent"} won the game`;
    setMessage(`Previous game ${message}`);
    alert(`Game ${message}`);
    setGameData(null);
  }

  return (
    <div>
      <p>{message}</p>
      {gameData ? (
        <>
          <GameTimer
            start={gameData.start}
            duration={gameData.duration}
            role={gameData.role}
          />
          <GameBoard gameData={gameData} onGameFinished={onGameFinished} />
        </>
      ) : (
        <>
          <h1>Join game or start new one</h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 transition-colors"
            onClick={() => joinGame()}
          >
            Join Game
          </button>
        </>
      )}
    </div>
  );
}

export default App;
