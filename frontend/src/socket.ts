import { io, type Socket } from "socket.io-client";

interface ServerToClientEvents {
  joinGame: (gameId: string) => void;
}

interface ClientToServerEvents {
  test: (message: string) => void;
  joinGame: (message: string) => void;
}

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  BASE_URL,
  {
    autoConnect: false,
  },
);
