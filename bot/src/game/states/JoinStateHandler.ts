import { stripIndents } from 'common-tags';
import { Context as TelegrafContext, Markup } from 'telegraf';
import { ExtraEditMessageText, ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { Bound } from '../../utils/Bound';
import { GameContext } from '../GameContext';
import { Player } from '../Player';
import { TelegramBot } from '../TelegramBot';
import { CancelledStateHandler } from './CancelledStateHandler';
import { GameStateHandler } from './GameStateHandler';
import { StateHandler } from './StateHandler';

enum Action {
    TOGGLE_PARTICIPATION = 'toggleParticipation',
    START = 'start',
}

export class JoinStateHandler implements StateHandler {
    private _gameContext: GameContext;
    private _bot: TelegramBot;
    private _messageId: number | undefined;
    private _players: Player[] = [];

    constructor(dependencies: { gameContext: GameContext, bot: TelegramBot }) {
        this._gameContext = dependencies.gameContext;
        this._bot = dependencies.bot;
    }

    async enter(): Promise<void> {
        this._players = [this._gameContext.author, new Player({ id: 1, name: 'fake' })];
        this._bot.addActionHandler(
            this._gameContext.chatId,
            Action.TOGGLE_PARTICIPATION,
            this._handleToggleParticipationAction
        );

        this._bot.addActionHandler(
            this._gameContext.chatId,
            Action.START,
            this._handleStartAction
        );

        await this._updateMessage();
    }

    async exit(): Promise<void> {
        this._bot.removeActionHandler(
            this._gameContext.chatId,
            Action.TOGGLE_PARTICIPATION,
            this._handleToggleParticipationAction
        );

        this._bot.removeActionHandler(
            this._gameContext.chatId,
            Action.START,
            this._handleStartAction
        );

        if (this._messageId) {
            await this._bot.api.deleteMessage(this._gameContext.chatId, this._messageId);
        }
    }

    private async _updateMessage(): Promise<void> {
        if (!this._messageId) {
            const message = await this._bot.api.sendMessage(
                this._gameContext.chatId,
                ...this._generateMessage()
            );
            this._messageId = message['message_id'];
            return;
        }

        await this._bot.api.editMessageText(
            this._gameContext.chatId,
            this._messageId,
            undefined,
            ...this._generateMessage(),
        );
    }

    private _generateMessage(): [string, ExtraReplyMessage & ExtraEditMessageText] {
        return [stripIndents`
        🎲 Hi, would you like to join the game?
        👥 Players: <b>${this._players.map(p => p.name).join(', ')}</b>`,
        {
            'parse_mode': 'HTML',
            'disable_notification': true,
            ...Markup.inlineKeyboard([
                Markup.button.callback(
                    `Join / ${this._players.length >= 2 ? 'Leave' : 'Cancel'}`,
                    Action.TOGGLE_PARTICIPATION
                ),
                ...this._players.length >= 2
                    ? [Markup.button.callback('Start!', Action.START)]
                    : [],
            ]),
        }];
    }

    @Bound
    private async _handleToggleParticipationAction(telegrafContext: TelegrafContext): Promise<void> {
        if (!telegrafContext.from) return;
        const playerId = telegrafContext.from.id;

        const existingPlayerIndex = this._players.findIndex(p => p.id === playerId);
        if (existingPlayerIndex !== -1) {
            this._players.splice(existingPlayerIndex, 1);

            if (this._players.length === 0) {
                await telegrafContext.answerCbQuery('The game has been cancelled');

                await this._gameContext.next(
                    new CancelledStateHandler({
                        gameContext: this._gameContext,
                        bot: this._bot,
                    })
                );
            } else {
                await telegrafContext.answerCbQuery('You have left the game');
                await this._updateMessage();
            }
        } else {
            const playerName = telegrafContext.from['first_name'];
            this._players.push(new Player({ id: playerId, name: playerName }));

            await telegrafContext.answerCbQuery('You have joined the game');
            await this._updateMessage();
        }
    }

    @Bound
    private async _handleStartAction(): Promise<void> {
        await this._gameContext.next(
            new GameStateHandler({
                players: this._players,
            }, {
                gameContext: this._gameContext,
                bot: this._bot,
            })
        );
    }
}
