import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { getNewCoordinates } from './coordinates.util';
import { GAME_DURATION, HIDER_START, SEEKER_START } from './game.constants';
import type { Game, GameActionPayload, ServerPlayer } from './game.types';

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

  public startGameCountdown(game: Game) {
    return new Promise<Game>((resolve) => {
      setTimeout(() => {
        game.status = 'finished';
        game.winner = 'hider';
        resolve(game);
      }, game.duration);
    });
  }

  public handlePlayerDisconnect(playerId: string): Game | null {
    const game = currentGames.find(
      (g) => g.seeker.socket.id === playerId || g.hider?.socket.id === playerId,
    );
    if (!game) {
      return null;
    }

    if (game.status === 'running') {
      game.status = 'finished';
      game.winner = game.seeker.socket.id === playerId ? 'hider' : 'seeker';
      return game;
    }

    return null;
  }

  public handleGameAction(
    payload: GameActionPayload,
    player: Socket,
  ): Game | null {
    const game = currentGames.find(({ id }) => id === payload.gameId);

    if (!game || game.status !== 'running') {
      return null;
    }

    const hider = game.hider as ServerPlayer;
    const seeker = game.seeker;
    const activePlayer = payload.role === 'seeker' ? seeker : hider;
    if (!activePlayer || activePlayer.socket.id !== player.id) {
      return null;
    }

    const newCoordinates = getNewCoordinates(
      activePlayer.coordinates,
      payload.action,
    );
    activePlayer.coordinates = newCoordinates;

    if (
      seeker.coordinates[0] === hider.coordinates[0] &&
      seeker.coordinates[1] === hider.coordinates[1]
    ) {
      game.status = 'finished';
      game.winner = 'seeker';
    }

    return game;
  }
}
