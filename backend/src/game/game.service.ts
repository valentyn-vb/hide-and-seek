import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
interface Game {
  id: string;
  seeker: Socket;
  hider?: Socket;
  status: 'waiting' | 'inProgress' | 'finished';
}
const currentGames: Game[] = [];

@Injectable()
export class GameService {
  public joinOrCreateGame(player: Socket) {
    const waitingGame = currentGames.find(
      (game) => game.status === 'waiting' && game.seeker.id !== player.id,
    );
    if (waitingGame) {
      waitingGame.hider = player;
      waitingGame.status = 'inProgress';
      return waitingGame;
    }

    const id = uuidv4();
    const game: Game = {
      id,
      seeker: player,
      status: 'waiting',
    };
    currentGames.push(game);

    return game;
  }
}
