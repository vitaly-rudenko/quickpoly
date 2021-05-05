import { GameContext } from '../GameContext';
import { TelegramBot } from '../TelegramBot';
import { JoinStateHandler } from './JoinStateHandler';
import { StateHandler } from './StateHandler';

export class ReadyStateHandler implements StateHandler {
    private _gameContext: GameContext;
    private _bot: TelegramBot;

    constructor(dependencies: { gameContext: GameContext, bot: TelegramBot }) {
        this._gameContext = dependencies.gameContext;
        this._bot = dependencies.bot;
    }

    async enter(): Promise<void> {
        await this._gameContext.next(
            new JoinStateHandler({ gameContext: this._gameContext, bot: this._bot })
        );
    }

    async exit(): Promise<void> {
        // empty
    }
}
