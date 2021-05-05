import { ExtraEditMessageText, ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { GameContext } from '../GameContext';
import { Player } from '../Player';
import { TelegramBot } from '../TelegramBot';
import { StateHandler } from './StateHandler';

export class GameStateHandler implements StateHandler {
    private _gameContext: GameContext;
    private _bot: TelegramBot;
    private _players: Player[];
    private _messageId: number | undefined;

    constructor(
        options: { players: Player[] },
        dependencies: { gameContext: GameContext, bot: TelegramBot }
    ) {
        this._players = options.players;
        this._gameContext = dependencies.gameContext;
        this._bot = dependencies.bot;
    }

    async enter(): Promise<void> {
        await this._updateMessage();

        
    }

    async exit(): Promise<void> {
        // empty
    }

    private async _updateMessage(): Promise<void> {
        // if (!this._messageId) {
        //     const message = await this._bot.api.sendMessage(
        //         this._gameContext.chatId,
        //         ...this._generateMessage()
        //     );
        //     this._messageId = message['message_id'];
        //     return;
        // }

        // await this._bot.api.editMessageText(
        //     this._gameContext.chatId,
        //     this._messageId,
        //     undefined,
        //     ...this._generateMessage(),
        // );
    }

    private _generateMessage(): [string, ExtraReplyMessage & ExtraEditMessageText] {
        return ['Le game', {}];
    }
}
