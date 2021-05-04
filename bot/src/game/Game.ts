import { Markup, Telegraf } from 'telegraf';
import { stripIndents } from 'common-tags';
import { GamePhaseHandler } from './GamePhaseHandler';
import { JoinGamePhaseHandler } from './JoinGamePhaseHandler';
import { CancelledGamePhaseHandler } from './CancelledGamePhaseHandler';
import { ReadyGamePhaseHandler } from './ReadyGamePhaseHandler';

enum GamePhase {
    READY,
    JOIN,
    CANCELLED
}

export class Game {
    private readonly _chatId: string;
    private readonly _bot: Telegraf;
    private _players: Player[] = [];
    private _phase: GamePhase = GamePhase.READY;
    private _phaseHandler: GamePhaseHandler = new ReadyGamePhaseHandler();
    private _messageId: number | null = null;

    constructor(options: {
        chatId: string,
    }, dependencies: {
        bot: Telegraf
    }) {
        this._chatId = options.chatId;
        this._bot = dependencies.bot;
    }

    async start(): Promise<void> {
        this._players = [
            new Player({
                id: 56681133,
                name: 'Vitaly',
            }),
        ];
        this._phase = GamePhase.JOIN;
        this._phaseHandler = new JoinGamePhaseHandler({ bot: this._bot });

        const message = await this._bot.telegram.sendMessage(
            this._chatId,
            'Wait a second...',
            { 'disable_notification': true }
        );
        this._messageId = message['message_id'];

        this._bot.action('joinLeave', (context) => {
            if (!context.from) return;
            const from = context.from;

            const existingPlayerIndex = this._players.findIndex(p => p.id === from.id);
            if (existingPlayerIndex !== -1) {
                this._players.splice(existingPlayerIndex, 1);
                context.answerCbQuery('You have left the game');

                if (this._players.length === 0) {
                    this._phase = GamePhase.CANCELLED;
                    this._phaseHandler = new CancelledGamePhaseHandler({ bot: this._bot });
                }

                this.updateMessage();
                return;
            }

            const player = new Player({
                id: from['id'],
                name: from['first_name'],
            });
            this._players.push(player);
            context.answerCbQuery('You have joined the game');
            this.updateMessage();
        });

        this.updateMessage();
    }

    async updateMessage(): Promise<void> {
        await this._phaseHandler.updateMessage(this);
    }

    get players(): Player[] {
        return this._players;
    }

    get chatId(): string {
        return this._chatId;
    }

    get messageId(): number | null {
        return this._messageId;
    }
}

class Player {
    private _id: number;
    private _name: string;

    constructor(attributes: { id: number, name: string }) {
        this._id = attributes.id;
        this._name = attributes.name;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }
}
