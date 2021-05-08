import WebSocket from 'ws';
import { CommandMessage, CommandHandler } from './CommandHandler';
import { EventHandler, EventMessage } from './EventHandler';

export class Server {
    private _commandHandlers = new Map<string, VersatileCommandHandler>();
    private _eventHandlers = new Map<string, VersatileEventHandler>();

    async start(): Promise<void> {
        const server = new WebSocket.Server({
            host: 'localhost',
            port: 3000,
        });

        server.on('listening', () => {
            server.on('connection', (client) => {
                client.on('message', async (message) => {
                    await this._handleMessage(client, JSON.parse(message.toString('utf-8')));
                });
            });

            console.log('Server is listening');
        });
    }

    setCommandHandler(command: string, handler: VersatileCommandHandler): void {
        this._commandHandlers.set(command, handler);
    }

    setEventHandler(event: string, handler: VersatileEventHandler): void {
        this._eventHandlers.set(event, handler);
    }

    private async _handleMessage(client: WebSocket, message: CommandMessage | EventMessage) {
        if ('command' in message) {
            const handler = this._commandHandlers.get(message.command);
            if (!handler) {
                throw new Error('Unknown command: ' + message.command);
            }

            let result;
            if (typeof handler === 'function') {
                result = await handler(message.data);
            } else {
                result = await handler.handle(message.data);
            }

            await this._send(client, { correlationId: message.correlationId, result });
        } else {
            const handler = this._eventHandlers.get(message.event);
            if (!handler) {
                throw new Error('Unknown event: ' + message.event);
            }

            if (typeof handler === 'function') {
                await handler(message.data);
            } else {
                await handler.handle(message.data);
            }
        }
    }

    private async _send(client: WebSocket, data: unknown): Promise<void> {
        return new Promise((resolve, reject) => {
            client.send(Buffer.from(JSON.stringify(data), 'utf-8'), (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}

type VersatileCommandHandler<T = any> = CommandHandler<T> | ((data: T) => (Promise<T> | T));
type VersatileEventHandler<T = any> = EventHandler<T> | ((data: T) => (Promise<void> | void));
