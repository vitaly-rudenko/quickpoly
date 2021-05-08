import WebSocket from 'ws';
import { Logger, LoggerProvider } from '../logging/LoggerProvider';
import { ServerGameState } from './ServerGameState';
import { EventHandler } from './ServerMessaging';
import { SocketServerMessaging } from './SocketServerMessaging';

export class Server {
    private _logger: Logger;
    private _messaging: SocketServerMessaging;

    constructor(dependencies: { loggerProvider: LoggerProvider }) {
        this._logger = dependencies.loggerProvider.create('ServerSocket');

        this._messaging = new SocketServerMessaging(dependencies.loggerProvider);
    }

    async connect(): Promise<void> {
        await new Promise<void>((resolve) => {
            const socket = new WebSocket('ws://localhost:3000/v0');

            socket.once('open', () => {
                this._messaging.setSocket(socket);
                this._logger.info('Socket connection opened successfully');

                resolve();
            });
        });
    }

    setEventHandler(gameId: string, event: string, eventHandler: EventHandler): void {
        this._messaging.setEventHandler(gameId, event, eventHandler);
    }

    removeEventHandler(gameId: string, event: string): void {
        this._messaging.removeEventHandler(gameId, event);
    }

    async rollDice(gameId: string, data: { dice: [number, number] }): Promise<void> {
        await this._messaging.emitEvent(gameId, 'rollDice', data);
    }

    async createGame(data: {
        players: {
            id: number,
            name: string
        }[]
    }): Promise<string> {
        return this._messaging.executeCommand<string>('createGame', data);
    }

    async getGameState(gameId: string): Promise<ServerGameState> {
        return this._messaging.executeCommand<ServerGameState>('getGameState', gameId);
    }
}
