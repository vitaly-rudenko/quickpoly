import { stripIndents } from 'common-tags';
import { Markup } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { MapSide } from '../../map/MapSide';
import { MapUtils } from '../../map/MapUtils';
import { MapRenderer } from '../../rendering/MapRenderer';
import { Server } from '../../server/Server';
import { ServerGameData } from '../../server/ServerGameData';
import { ServerGameState } from '../../server/ServerGameState';
import { GameContext } from '../GameContext';
import { Player } from '../Player';
import { TelegramBot } from '../TelegramBot';
import { StateHandler } from './StateHandler';

const mapSideToArrow: Record<MapSide, string> = {
    [MapSide.TOP]: '↑',
    [MapSide.RIGHT]: '→',
    [MapSide.BOTTOM]: '↓',
    [MapSide.LEFT]: '←',
};

const CLOCKS = ['🕐', '🕑', '🕒', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚'];

export class GameStateHandler implements StateHandler {
    private _gameContext: GameContext;
    private _bot: TelegramBot;
    private _players: Player[];
    private _messageId: number | undefined;
    private _mapRenderer: MapRenderer | undefined;
    private _gameServer: Server;
    private _gameId: string | undefined;
    private _gameState: ServerGameState | undefined;
    private _fileId: string | undefined;
    private _clockIndex = 0;

    constructor(
        attributes: { players: Player[] },
        dependencies: { gameContext: GameContext, bot: TelegramBot, gameServer: Server }
    ) {
        this._players = attributes.players;
        this._gameContext = dependencies.gameContext;
        this._bot = dependencies.bot;
        this._gameServer = dependencies.gameServer;
    }

    async enter(): Promise<void> {
        this._bot.addActionHandler(this._gameContext.chatId, 'rollDice', async (context) => {
            await this._rollDice();
        });

        this._gameId = await this._gameServer.createGame({
            players: this._players.map(player => ({
                id: player.id,
                name: player.name,
            })),
        });

        this._gameState = await this._gameServer.getGameState(this._gameId);
        this._mapRenderer = new MapRenderer();

        await this._sendMessage();

        const scheduleCaptionUpdate = () => {
            setTimeout(async () => {
                await this._updateCaption();
                scheduleCaptionUpdate();
            }, 5000);
        };

        scheduleCaptionUpdate();
    }

    async exit(): Promise<void> {
        // empty
    }

    private async _rollDice(): Promise<void> {
        const [dice1, dice2] = await Promise.all([
            this._bot.api.sendDice(this._gameContext.chatId),
            this._bot.api.sendDice(this._gameContext.chatId),
        ]);

        setTimeout(async () => {
            await Promise.all([
                this._bot.api.deleteMessage(this._gameContext.chatId, dice1['message_id']),
                this._bot.api.deleteMessage(this._gameContext.chatId, dice2['message_id']),
            ]);

            if (this._gameId) {
                await this._gameServer.rollDice({
                    gameId: this._gameId,
                    dice: [dice1.dice.value, dice2.dice.value],
                });
            }
        }, 5000);
    }

    private async _sendMessage(): Promise<void> {
        if (!this._mapRenderer || !this._gameId || !this._gameState) {
            throw new Error('Could not send message due to missing dependency');
        }

        const image = this._mapRenderer.render(this._gameState);
        const caption = this._generateCaption();
        const replyMarkup = this._generateReplyMarkup();

        const message = await this._bot.api.sendPhoto(
            this._gameContext.chatId,
            { source: image },
            {
                'caption': caption,
                'parse_mode': 'HTML',
                'disable_notification': true,
                'reply_markup': replyMarkup,
            }
        );

        this._messageId = message['message_id'];
        this._fileId = message.photo[0].file_id;
    }

    private async _updateCaption() {
        if (!this._gameId || !this._fileId) return;

        const caption = this._generateCaption();
        const replyMarkup = this._generateReplyMarkup();

        await this._bot.api.editMessageMedia(
            this._gameContext.chatId,
            this._messageId,
            undefined,
            { type: 'photo', media: this._fileId, 'caption': caption, 'parse_mode': 'HTML' },
            { 'reply_markup': replyMarkup }
        );
    }

    private async _updateImage() {
        if (!this._mapRenderer || !this._gameState || !this._gameId) {
            throw new Error('Could not update message due to missing dependency');
        }

        const caption = this._generateCaption();
        const replyMarkup = this._generateReplyMarkup();
        const image = this._mapRenderer.render(this._gameState);

        await this._bot.api.editMessageMedia(
            this._gameContext.chatId,
            this._messageId,
            undefined,
            { type: 'photo', media: { source: image }, 'caption': caption, 'parse_mode': 'HTML' },
            { 'reply_markup': replyMarkup }
        );
    }

    private _generateCaption(): string {
        if (!this._gameState) {
            throw new Error('Game state is not present');
        }

        const playerId = this._gameState.move.playerId;
        const player = this._gameState.players.find(p => p.id === playerId);
        if (!player) {
            throw new Error('Player not found: ' + playerId);
        }

        const space = this._gameState.gameData.spaces[player.space];
        const { side } = MapUtils.getSpacePosition(this._gameState.gameData, player.space);
        const secondsLeft = Math.max(0, Math.round((this._gameState.move.timesOutAt - Date.now()) / 5000) * 5);

        const clock = CLOCKS[this._clockIndex];
        this._clockIndex = (this._clockIndex + 1) % CLOCKS.length;

        return stripIndents`
            ${clock} <b>${secondsLeft} second${secondsLeft !== 1 ? 's' : ''} left</b>
            👤 <b>${player.name}</b>
            📍 <b>${space.name} ${mapSideToArrow[side]}</b>
        `;
    }

    private _generateReplyMarkup(): InlineKeyboardMarkup {
        return {
            'inline_keyboard': [[
                Markup.button.callback('🎲 Roll dice', 'rollDice'),
                Markup.button.callback('✋ Give up', 'giveUp'),
            ]],
        };
    }
}
