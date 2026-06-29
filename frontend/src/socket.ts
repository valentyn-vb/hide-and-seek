import { io, Socket } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const socket: Socket = io(BASE_URL, {
  autoConnect: false,
});
