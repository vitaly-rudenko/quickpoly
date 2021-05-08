import { Server } from '../server/Server';
import { GameContext } from './GameContext';
import { Player } from './Player';
import { ReadyStateHandler } from './states/ReadyStateHandler';
import { TelegramBot } from './TelegramBot';

export class Game {
    private _gameContext: GameContext;
    private _bot: TelegramBot;
    private _gameServer: Server;

    constructor(
        attributes: { chatId: number, author: Player },
        dependencies: { bot: TelegramBot, gameServer: Server }
    ) {
        this._gameContext = new GameContext({
            chatId: attributes.chatId,
            author: attributes.author,
        });

        this._bot = dependencies.bot;
        this._gameServer = dependencies.gameServer;
    }

    async start(): Promise<void> {
        this._gameContext.next(
            new ReadyStateHandler({
                gameContext: this._gameContext,
                bot: this._bot,
                gameServer: this._gameServer,
            })
        );
    }
}
