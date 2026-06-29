import { useEffect } from "react";
import "./App.css";
import { socket } from "./socket";

function App() {
  useEffect(() => {
    socket.connect();
    socket.emit("test", "its work");
    socket.on("test", (res) => {
      console.log(res);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Hide and Seek</h1>
    </div>
  );
}

export default App;
