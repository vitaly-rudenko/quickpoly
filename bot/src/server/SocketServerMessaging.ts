import WebSocket from 'ws';
import { Logger, LoggerProvider } from '../logging/LoggerProvider';

import {
    EventHandler,
    EventMessage,
    ServerMessaging,
    CommandMessage,
    CommandResponse
} from './ServerMessaging';

export class SocketServerMessaging implements ServerMessaging {
    private _logger: Logger;
    private _socket: WebSocket | undefined;
    private _eventHandlers = new Map<string, EventHandler>();
    private _correlationId = 0n;

    constructor(loggerProvider: LoggerProvider) {
        this._logger = loggerProvider.create('SocketServerMessaging');
    }

    setSocket(socket: WebSocket): void {
        this._socket = socket;
        this._socket.on('message', async (message) => {
            await this._handleMessage(this._deserializeMessage(message));
        });
    }

    setEventHandler(gameId: string, event: string, eventHandler: EventHandler): void {
        this._eventHandlers.set(this._getEventHandlerKey(gameId, event), eventHandler);
    }

    removeEventHandler(gameId: string, event: string): void {
        this._eventHandlers.delete(this._getEventHandlerKey(gameId, event));
    }

    async emitEvent(gameId: string, event: string, data?: unknown): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this._socket) {
                reject(new Error('Socket is not opened'));
                return;
            }

            this._socket.send(
                this._serializeMessage({ gameId, event, data }),
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }

    async executeCommand<T>(command: string, data?: unknown): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if (!this._socket) {
                reject(new Error('Socket is not opened'));
                return;
            }

            this._correlationId += 1n;
            const correlationId = this._correlationId.toString();

            const messageHandler = (message: WebSocket.Data) => {
                const response = this._deserializeCommandResponse<T>(message);

                if (response.correlationId === correlationId) {
                    cleanup();
                    resolve(response.result);
                }
            };

            const cleanup = () => {
                if (this._socket) {
                    this._socket.removeListener('message', messageHandler);
                }
            };

            this._socket.send(
                this._serializeMessage({ correlationId, command, data }),
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

    private async _handleMessage(message: EventMessage): Promise<void> {
        const key = this._getEventHandlerKey(message.gameId, message.event);
        const handler = this._eventHandlers.get(key);

        if (!handler) {
            return;
        }

        if (typeof handler === 'function') {
            await handler(message.data);
        } else {
            await handler.handle(message.data);
        }
    }

    private _getEventHandlerKey(gameId: string, event: string): string {
        return `${gameId}:${event}`;
    }

    private _serializeMessage(message: EventMessage | CommandMessage): Buffer {
        return Buffer.from(JSON.stringify(message), 'utf-8');
    }

    private _deserializeMessage(message: WebSocket.Data): EventMessage {
        return JSON.parse(message.toString('utf-8'));
    }

    private _deserializeCommandResponse<T>(message: WebSocket.Data): CommandResponse<T> {
        return JSON.parse(message.toString('utf-8'));
    }
}
