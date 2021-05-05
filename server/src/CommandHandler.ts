export interface CommandHandler<D = unknown, R = unknown> {
    handle(data: D): Promise<R> | R;
}

export interface CommandMessage {
    correlationId: string;
    command: string;
    data?: unknown;
}

export interface CommandResponse {
    correlationId: string;
    result?: unknown;
}
