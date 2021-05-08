export interface EventHandler<D = unknown> {
    handle(data: D): Promise<void> | void;
}

export interface EventMessage {
    event: string;
    data?: unknown;
}
