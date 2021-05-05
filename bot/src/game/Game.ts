import { GameContext } from './GameContext';
import { Player } from './Player';
import { ReadyStateHandler } from './states/ReadyStateHandler';
import { TelegramBot } from './TelegramBot';

export class Game {
    private _gameContext: GameContext;
    private _bot: TelegramBot;

    constructor(
        options: { chatId: number, author: Player },
        dependencies: { bot: TelegramBot }
    ) {
        this._gameContext = new GameContext({
            chatId: options.chatId,
            author: options.author,
        });

        this._bot = dependencies.bot;
    }

    async start(): Promise<void> {
        this._gameContext.next(
            new ReadyStateHandler({
                gameContext: this._gameContext,
                bot: this._bot,
            })
        );
    }
}
