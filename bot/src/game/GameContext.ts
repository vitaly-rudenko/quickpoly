import { Player } from './Player';
import { StateHandler } from './states/StateHandler';

export class GameContext {
    private _chatId: number;
    private _author: Player;
    private _stateHandler: StateHandler | undefined;

    constructor(attributes: {
        chatId: number,
        author: Player
    }) {
        this._chatId = attributes.chatId;
        this._author = attributes.author;
    }

    async next(stateHandler: StateHandler): Promise<void> {
        if (this._stateHandler) {
            await this._stateHandler.exit();
        }

        this._stateHandler = stateHandler;
        await this._stateHandler.enter();
    }

    get author(): Player {
        return this._author;
    }

    get chatId(): number {
        return this._chatId;
    }
}
