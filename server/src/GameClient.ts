import WebSocket from 'ws';

export class GameClient {
    private _client: WebSocket;

    constructor(dependencies: { client: WebSocket }) {
        this._client = dependencies.client;
    }

    async emitRemoteEvent(event: string, data?: any) {
        await new Promise<void>((resolve, reject) => {
            this._client.send(
                Buffer.from(JSON.stringify(data), 'utf-8'),
                (error) => (error ? reject(error) : resolve())
            );
        });
    }
}
