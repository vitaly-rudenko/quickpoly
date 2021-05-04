export interface Observable {
    on(event: string, listener: (...args: unknown[]) => unknown): void;

    off(event: string, listener: (...args: unknown[]) => unknown): void;
}