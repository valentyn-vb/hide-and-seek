import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import type { Game, GameActionPayload } from './game.types';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('joinGame')
  async handleJoinGame(@ConnectedSocket() player: Socket) {
    const game = this.gameService.joinOrCreateGame(player);
    const { id: gameId, status, seeker, hider, start, duration } = game;

    await player.join(gameId);
    player.emit('gameJoined', { gameId, status });

    if (status === 'waiting') {
      return;
    }

    const basePayload = {
      gameId,
      seeker: { id: seeker.socket.id, coordinates: seeker?.coordinates },
      hider: { id: hider?.socket.id, coordinates: hider?.coordinates },
      start,
      duration,
    };

    seeker.socket.emit('gameStarted', { ...basePayload, role: 'seeker' });
    if (hider) {
      hider.socket.emit('gameStarted', { ...basePayload, role: 'hider' });
    }

    void this.gameService
      .startGameCountdown(game)
      .then((game) => this.endGame(game));
  }

  @SubscribeMessage('gameAction')
  handleGameAction(
    @MessageBody() body: GameActionPayload,
    @ConnectedSocket() player: Socket,
  ) {
    const game = this.gameService.handleGameAction(body, player);

    if (!game) {
      this.server.to(body.gameId).emit('gameAction', 'something went wrong');
      return;
    }

    if (game.status === 'finished') {
      this.endGame(game);
      return;
    }

    this.server.to(body.gameId).emit('gameAction', {
      role: body.role,
      newCoordinates: game[body.role]?.coordinates,
    });
  }

  private endGame(game: Game) {
    this.server.to(game.id).emit('gameFinished', game.winner);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
