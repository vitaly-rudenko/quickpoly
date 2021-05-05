import { GameServer } from '../../server/GameServer';
import { GameContext } from '../GameContext';
import { TelegramBot } from '../TelegramBot';
import { JoinStateHandler } from './JoinStateHandler';
import { StateHandler } from './StateHandler';

export class ReadyStateHandler implements StateHandler {
    private _gameContext: GameContext;
    private _bot: TelegramBot;
    private _gameServer: GameServer;

    constructor(dependencies: { gameContext: GameContext, bot: TelegramBot, gameServer: GameServer }) {
        this._gameContext = dependencies.gameContext;
        this._bot = dependencies.bot;
        this._gameServer = dependencies.gameServer;
    }

    async enter(): Promise<void> {
        await this._gameContext.next(
            new JoinStateHandler({
                gameContext: this._gameContext,
                bot: this._bot,
                gameServer: this._gameServer,
            })
        );
    }

    async exit(): Promise<void> {
        // empty
    }
}
