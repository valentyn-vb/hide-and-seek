import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

type GameAction = 'up' | 'down' | 'left' | 'right';
type PlayerRole = 'seeker' | 'hider';

interface Game {
  id: string;
  seeker: Player;
  hider?: Player;
  status: 'waiting' | 'running' | 'finished';
  duration: 600000;
  start?: number;
}

interface Player {
  socket: Socket;
  coordinates: [number, number];
}

interface GameActionPayload {
  gameId: string;
  action: GameAction;
  role: PlayerRole;
}

const BOARD_MIN = 1;
const BOARD_MAX = 10;
const currentGames: Game[] = [];

@Injectable()
export class GameService {
  public joinOrCreateGame(player: Socket) {
    const waitingGame = currentGames.find(
      (game) =>
        game.status === 'waiting' && game.seeker.socket.id !== player.id,
    );
    if (waitingGame) {
      waitingGame.hider = {
        socket: player,
        coordinates: [1, 1],
      };
      waitingGame.status = 'running';
      waitingGame.start = Date.now();
      return waitingGame;
    }

    const id = uuidv4();
    const game: Game = {
      id,
      seeker: {
        socket: player,
        coordinates: [10, 10],
      },
      status: 'waiting',
      duration: 600000,
    };
    currentGames.push(game);
    return game;
  }

  public handleGameAction(
    payload: GameActionPayload,
    player: Socket,
  ): Game | null {
    console.log('🚀 ~ GameService ~ handleGameAction ~ payload:', payload);
    const game = currentGames.find(({ id }) => id === payload.gameId);

    if (!game || game.status !== 'running') {
      return null;
    }

    const activePlayer = payload.role === 'seeker' ? game.seeker : game.hider;
    if (!activePlayer || activePlayer.socket.id !== player.id) {
      return null;
    }

    activePlayer.coordinates = this.getNewCoordinates(
      activePlayer.coordinates,
      payload.action,
    );

    return game;
  }

  private clampCoordinate(value: number): number {
    return Math.min(BOARD_MAX, Math.max(BOARD_MIN, value));
  }

  private getNewCoordinates(
    [row, col]: [number, number],
    action: GameAction,
  ): [number, number] {
    switch (action) {
      case 'up':
        return [this.clampCoordinate(row - 1), col];
      case 'down':
        return [this.clampCoordinate(row + 1), col];
      case 'left':
        return [row, this.clampCoordinate(col - 1)];
      case 'right':
        return [row, this.clampCoordinate(col + 1)];
    }
  }
}
