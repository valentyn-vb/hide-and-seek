import { useEffect } from "react";
import "./App.css";
import { socket } from "./socket";

function App() {
  useEffect(() => {
    socket.connect();
    socket.emit("test", "its work");
    socket.on("joinGame", (res) => {
      console.log(res);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  function joinGame() {
    console.log("join game");
    socket.emit("joinGame", "joining");
  }

  return (
    <div>
      <h1>Join game or start new one</h1>
      <button onClick={() => joinGame()}>Join Game</button>
    </div>
  );
}

export default App;
