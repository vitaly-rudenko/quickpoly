import { Context, Telegraf, Telegram } from 'telegraf';

export class TelegramBot {
    private _actionHandlers: ActionHandler[] = [];
    private _bot: Telegraf;

    constructor(bot: Telegraf) {
        this._bot = bot;
    }

    async start(): Promise<void> {
        this._bot.action(/.*/, (context) => {
            if (!context.chat) return;
            const chatId = context.chat.id;
            const action = context.match[0];

            for (const actionHandler of this._actionHandlers) {
                if (actionHandler.action === action && actionHandler.chatId === chatId) {
                    actionHandler.listener(context);
                }
            }
        });

        await this._bot.launch({
            allowedUpdates: ['callback_query'],
            dropPendingUpdates: true,
        });
    }

    addActionHandler(chatId: number, action: string, listener: ActionListener): void {
        this._actionHandlers.push(new ActionHandler(chatId, action, listener));
    }

    removeActionHandler(chatId: number, action: string, listener: ActionListener): void {
        const index = this._actionHandlers.findIndex(
            handler => handler.chatId === chatId
                && handler.action === action
                && handler.listener === listener
        );

        if (index !== -1) {
            this._actionHandlers.splice(index, 1);
        }
    }

    get api(): Telegram {
        return this._bot.telegram;
    }
}

class ActionHandler {
    private _chatId: number;
    private _action: string;
    private _listener: ActionListener;

    constructor(chatId: number, action: string, listener: ActionListener) {
        this._chatId = chatId;
        this._action = action;
        this._listener = listener;
    }

    get chatId(): number {
        return this._chatId;
    }

    get action(): string {
        return this._action;
    }

    get listener(): ActionListener {
        return this._listener;
    }
}

type ActionListener = (context: Context) => any;
