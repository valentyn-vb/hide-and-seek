import { io, type Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./types/socket";

export type { GameData, GameActionPayload, PlayerRole } from "./types/game";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  BASE_URL,
  {
    autoConnect: false,
  },
);
