export interface StateHandler {
    enter(): Promise<void>;
    exit(): Promise<void>;
}
