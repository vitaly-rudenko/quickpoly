import { Markup, Telegraf } from 'telegraf';
import { stripIndents } from 'common-tags';

import { Game } from './Game';
import { GamePhaseHandler } from './GamePhaseHandler';

export class JoinGamePhaseHandler implements GamePhaseHandler {
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
            stripIndents`
            🎲 Would you like to join the game?
            👥 Players: <b>${game.players.map(p => p.name).join(', ')}</b>`,
            {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    Markup.button.callback('Join / Leave', 'joinLeave'),
                ]),
            }
        );
    }
}