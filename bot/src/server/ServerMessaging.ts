export interface ServerMessaging {
    setEventHandler(gameId: string, event: string, eventHandler: EventHandler): void;
    removeEventHandler(gameId: string, event: string): void;

    emitEvent(gameId: string, event: string, data?: unknown): Promise<void>;
    executeCommand<T>(command: string, data?: unknown): Promise<T>;
}

export type EventHandler = { handle: (data: unknown) => Promise<void> | void }
    | ((data: unknown) => Promise<void> | void);

export interface EventMessage {
    gameId: string;
    event: string;
    data: unknown;
}

export interface CommandMessage {
    correlationId: string;
    command: string;
    data: unknown;
}

export interface CommandResponse<T> {
    correlationId: string;
    result: T;
}
