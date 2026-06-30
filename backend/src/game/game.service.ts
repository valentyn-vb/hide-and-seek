import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { getNewCoordinates } from './coordinates.util';
import {
  GAME_DURATION,
  HIDER_START,
  SEEKER_START,
} from './game.constants';
import type { Game, GameActionPayload } from './game.types';

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
        coordinates: HIDER_START,
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
        coordinates: SEEKER_START,
      },
      status: 'waiting',
      duration: GAME_DURATION,
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

    activePlayer.coordinates = getNewCoordinates(
      activePlayer.coordinates,
      payload.action,
    );

    return game;
  }
}
