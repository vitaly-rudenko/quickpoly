import { GameContext } from '../GameContext';
import { TelegramBot } from '../TelegramBot';
import { StateHandler } from './StateHandler';

export class CancelledStateHandler implements StateHandler {
    private _gameContext: GameContext;
    private _bot: TelegramBot;

    constructor(dependencies: { gameContext: GameContext, bot: TelegramBot }) {
        this._gameContext = dependencies.gameContext;
        this._bot = dependencies.bot;
    }

    async enter(): Promise<void> {
        const message = await this._bot.api.sendMessage(
            this._gameContext.chatId,
            'The game has been cancelled 😔',
            { 'disable_notification': true }
        );

        setTimeout(async () => {
            await this._bot.api.deleteMessage(this._gameContext.chatId, message['message_id']);
        }, 5000);
    }

    async exit(): Promise<void> {
        // empty
    }
}
