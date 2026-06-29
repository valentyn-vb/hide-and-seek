import { useEffect, useState } from "react";
import "./App.css";
import { socket } from "./socket";

function App() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [message, setMessage] = useState("Click Join Game to find a match.");

  useEffect(() => {
    socket.connect();

    socket.on("gameJoined", ({ gameId, role, status }) => {
      setGameId(gameId);
      setMessage(
        status === "waiting"
          ? `Created game ${gameId}. You are the ${role}. Waiting for another player...`
          : `Joined game ${gameId} as the ${role}.`,
      );
    });

    socket.on("gameStarted", ({ gameId }) => {
      setGameId(gameId);
      setMessage(`Game ${gameId} started!`);
    });

    return () => {
      socket.off("gameJoined");
      socket.off("gameStarted");
      socket.disconnect();
    };
  }, []);

  function joinGame() {
    socket.emit("joinGame");
  }

  return (
    <div>
      <h1>Join game or start new one</h1>
      <p>{message}</p>
      {gameId && <p>Game ID: {gameId}</p>}
      <button onClick={() => joinGame()}>Join Game</button>
    </div>
  );
}

export default App;
