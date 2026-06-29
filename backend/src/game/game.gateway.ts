import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

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
    const { id: gameId, status, seeker, hider, start } = game;

    await player.join(gameId);
    player.emit('gameJoined', { gameId, status });

    if (status === 'waiting') {
      return;
    }

    const basePayload = {
      gameId,
      seeker: { id: seeker.socket.id, coordinates: seeker?.coordinates },
      hiderId: { id: hider?.socket.id, coordinates: hider?.coordinates },
      start,
    };

    seeker.socket
      .to(gameId)
      .emit('gameStarted', { ...basePayload, role: 'seeker' });
    if (hider) {
      hider.socket
        .to(gameId)
        .emit('gameStarted', { ...basePayload, role: 'hider' });
    }
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
