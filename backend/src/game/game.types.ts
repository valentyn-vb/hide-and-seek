import { Socket } from 'socket.io';

export type Coordinates = [number, number];
export type GameAction = 'up' | 'down' | 'left' | 'right';
export type PlayerRole = 'seeker' | 'hider';
export type GameStatus = 'waiting' | 'running' | 'finished';

export interface ServerPlayer {
  socket: Socket;
  coordinates: Coordinates;
}

export interface Game {
  id: string;
  seeker: ServerPlayer;
  hider?: ServerPlayer;
  status: GameStatus;
  duration: number;
  start?: number;
  winner?: PlayerRole;
}

export interface GameActionPayload {
  gameId: string;
  action: GameAction;
  role: PlayerRole;
}
