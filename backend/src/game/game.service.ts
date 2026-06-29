import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
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
}
