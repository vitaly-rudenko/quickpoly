import WebSocket from 'ws';
import { Logger, LoggerProvider } from '../logging/LoggerProvider';
import { ServerGameData } from './ServerGameData';
import { ServerGameState } from './ServerGameState';

export class GameServer {
    private _logger: Logger;
    private _client: WebSocket | undefined;
    private _correlationId: bigint;

    constructor(dependencies: { loggerProvider: LoggerProvider }) {
        this._logger = dependencies.loggerProvider.create('ServerSocket');
        this._correlationId = 0n;
    }

    async connect(): Promise<void> {
        await new Promise<void>((resolve) => {
            const socket = new WebSocket('ws://localhost:3000/v0');
            socket.once('open', () => {
                this._client = socket;
                this._logger.info('Connected successfully');

                resolve();
            });
        });
    }

    async getData(): Promise<ServerGameData> {
        if (!this._client) {
            throw new Error('Socket is not opened');
        }

        return this._sendCommand<ServerGameData>('getData');
    }

    async createGame(data: {
        players: {
            id: number,
            name: string
        }[]
    }): Promise<string> {
        if (!this._client) {
            throw new Error('Socket is not opened');
        }

        return this._sendCommand<string>('createGame', data);
    }

    async getGameState(gameId: string): Promise<ServerGameState> {
        if (!this._client) {
            throw new Error('Socket is not opened');
        }

        return this._sendCommand<ServerGameState>('getGameState', gameId);
    }

    private async _sendCommand<T>(command: string, data?: any): Promise<T> {
        return new Promise((resolve, reject) => {
            if (!this._client) {
                reject(new Error('Socket is not opened'));
                return;
            }

            this._correlationId += 1n;
            const correlationId = this._correlationId.toString();

            const messageHandler = (message: WebSocket.Data) => {
                const response = JSON.parse(message.toString('utf-8'));
                if (response.correlationId === correlationId) {
                    cleanup();
                    resolve(response.result);
                }
            };

            const cleanup = () => {
                if (this._client) {
                    this._client.removeListener('message', messageHandler);
                }
            };

            this._client.send(
                Buffer.from(JSON.stringify({ correlationId, command, data }), 'utf-8'),
                (error) => {
                    if (error) {
                        cleanup();
                        reject(error);
                    }
                }
            );

            this._client.on('message', messageHandler);
        });
    }
}
