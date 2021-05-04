import { GamePhaseHandler } from './GamePhaseHandler';

export class ReadyGamePhaseHandler implements GamePhaseHandler {
    async updateMessage(): Promise<void> {
        // empty
    }
}
