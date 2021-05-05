import WebSocket from 'ws';
import { Logger, LoggerProvider } from '../logging/LoggerProvider';
import { ServerGameData } from './ServerGameData';

export class ServerSocket {
    private _logger: Logger;
    private _socket: WebSocket | undefined;
    private _commandId: bigint;

    constructor(dependencies: { loggerProvider: LoggerProvider }) {
        this._logger = dependencies.loggerProvider.create('ServerSocket');
        this._commandId = 0n;
    }

    async connect(): Promise<void> {
        await new Promise<void>((resolve) => {
            const socket = new WebSocket('ws://localhost:3000/v0');
            socket.once('open', () => {
                this._socket = socket;
                this._logger.info('Connected successfully');

                resolve();
            });
        });

        this._logger.debug('data:', await this.getData());
    }

    async getData(): Promise<ServerGameData> {
        if (!this._socket) {
            throw new Error('Socket is not opened');
        }

        return this._sendCommand<ServerGameData>({ command: 'getData' });
    }

    private async _sendCommand<T>(data: {
        gameId?: string,
        playerId?: number,
        command: string,
        data?: Record<string, unknown>
    }): Promise<T> {
        return new Promise((resolve, reject) => {
            if (!this._socket) {
                reject(new Error('Socket is not opened'));
                return;
            }

            this._commandId++;
            const commandId = this._commandId;

            const messageHandler = (message: WebSocket.Data) => {
                const response = JSON.parse(message.toString('utf-8'));
                if (response.commandId === commandId.toString()) {
                    cleanup();
                    resolve(response);
                }
            };

            const cleanup = () => {
                if (this._socket) {
                    this._socket.removeListener('message', messageHandler);
                }
            };

            this._socket.send(
                JSON.stringify({
                    commandId: commandId.toString(),
                    gameId: data.gameId,
                    playerId: data.playerId,
                    command: data.command,
                    data: data.data,
                }),
                (error) => {
                    if (error) {
                        cleanup();
                        reject(error);
                    }
                }
            );

            this._socket.on('message', messageHandler);
        });
    }
}
