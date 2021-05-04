import { Telegraf } from 'telegraf';
import { Game } from './Game';
import { GamePhaseHandler } from './GamePhaseHandler';

export class CancelledGamePhaseHandler implements GamePhaseHandler {
    private _bot: Telegraf;

    constructor(dependencies: { bot: Telegraf }) {
        this._bot = dependencies.bot;
    }

    async updateMessage(game: Game): Promise<void> {
        if (!game.messageId) return;

        await this._bot.telegram.editMessageText(
            game.chatId,
            game.messageId,
            undefined,
            'Game has been cancelled 😔'
        );

        setTimeout(async () => {
            if (!game.messageId) return;
            await this._bot.telegram.deleteMessage(game.chatId, game.messageId);
        }, 5000);
    }
}