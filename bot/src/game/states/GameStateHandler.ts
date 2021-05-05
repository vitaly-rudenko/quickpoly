import { InputMedia } from 'telegraf/typings/core/types/typegram';
import { ExtraEditMessageMedia, ExtraEditMessageText, ExtraPhoto, ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { MapRenderer } from '../../rendering/MapRenderer';
import { GameServer } from '../../server/GameServer';
import { GameContext } from '../GameContext';
import { Player } from '../Player';
import { TelegramBot } from '../TelegramBot';
import { StateHandler } from './StateHandler';

export class GameStateHandler implements StateHandler {
    private _gameContext: GameContext;
    private _bot: TelegramBot;
    private _players: Player[];
    private _messageId: number | undefined;
    private _mapRenderer: MapRenderer | undefined;
    private _gameServer: GameServer;
    private _gameId: string | undefined;

    constructor(
        attributes: { players: Player[] },
        dependencies: { gameContext: GameContext, bot: TelegramBot, gameServer: GameServer }
    ) {
        this._players = attributes.players;
        this._gameContext = dependencies.gameContext;
        this._bot = dependencies.bot;
        this._gameServer = dependencies.gameServer;
    }

    async enter(): Promise<void> {
        this._gameId = await this._gameServer.createGame({
            players: this._players.map(player => ({
                id: player.id,
                name: player.name,
            })),
        });

        this._mapRenderer = new MapRenderer({
            gameData: await this._gameServer.getData(),
            fontFamily: 'Roboto',
            fontFamilyBold: 'Roboto Bold',
        });

        await this._updateMessage();
    }

    async exit(): Promise<void> {
        // empty
    }

    private async _updateMessage(): Promise<void> {
        if (!this._mapRenderer || !this._gameId) return;

        const gameState = await this._gameServer.getGameState(this._gameId);
        console.log('gameState:', gameState);
        if (!gameState) return;

        const image = this._mapRenderer.render(gameState);
        const caption = this._generateCaption();

        if (!this._messageId) {
            const message = await this._bot.api.sendPhoto(
                this._gameContext.chatId,
                { source: image },
                { 'caption': caption, 'parse_mode': 'HTML', 'disable_notification': true }
            );
            this._messageId = message['message_id'];
            return;
        }

        await this._bot.api.editMessageMedia(
            this._gameContext.chatId,
            this._messageId,
            undefined,
            { type: 'photo', media: { source: image }, 'caption': caption, 'parse_mode': 'HTML' },
        );
    }

    private _generateCaption(): string {
        return 'Hello world!';
    }
}
