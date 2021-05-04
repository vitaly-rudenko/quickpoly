import { Game } from './Game';

export interface GamePhaseHandler {
    updateMessage(game: Game): Promise<void>;
}
