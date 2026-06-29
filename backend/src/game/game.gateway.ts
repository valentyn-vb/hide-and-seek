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

    await player.join(game.id);
    player.emit('gameJoined', {
      gameId: game.id,
      status: game.status,
    });

    if (game.status === 'waiting') {
      return;
    }

    const payload = {
      gameId: game.id,
      seekerId: game.seeker.id,
      hiderId: game.hider?.id,
    };

    game.seeker.to(game.id).emit('gameStarted', { ...payload, role: 'seeker' });
    if (game.hider)
      game.hider.to(game.id).emit('gameStarted', { ...payload, role: 'hider' });
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
