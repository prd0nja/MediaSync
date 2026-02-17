import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect
} from "@nestjs/websockets";

import { Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";

import { StateService } from "@/services/state.service";

@WebSocketGateway({
	cors: { origin: [process.env.HOST || "*"] }
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger = new Logger(AppGateway.name);

	@WebSocketServer()
	server: Server;

	constructor(private stateService: StateService) {}

	handleConnection(client: Socket) {
		this.logger.log(`Client connected: ${client.id}`);
		client.emit("video", this.stateService.getCurrentState());
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	broadcast(event: string, data: any) {
		this.server.emit(event, data);
	}
}
