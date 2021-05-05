import WebSocket from 'ws';
import { CommandMessage, CommandHandler } from './CommandHandler';

export class Server {
    private _commandHandlers = new Map<string, VersatileCommandHandler>();

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

    private async _handleMessage(client: WebSocket, message: CommandMessage) {
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

type VersatileCommandHandler<T = any> = CommandHandler<T> | ((input: T) => (Promise<T> | T));
