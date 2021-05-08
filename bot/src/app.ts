import path from 'path';
import { promises as fs } from 'fs';

import { Telegraf } from 'telegraf';
import canvas from 'canvas';

import { LogLevel } from './logging/LoggerProvider';
import { WinstonLoggerProvider } from './logging/WinstonLoggerProvider';
import { MapRenderer } from './rendering/MapRenderer';
import { TelegramBot } from './game/TelegramBot';
import { Game } from './game/Game';
import { Player } from './game/Player';
import { Server } from './server/Server';

const loggerProvider = new WinstonLoggerProvider({ logLevel: LogLevel.TRACE });
const logger = loggerProvider.create('app');

const chatId = -516338149;
const caption = `
⏳ *23 seconds left*
👤 *Vladislav*
📍 *Atlantic Avenue ↓*

⤵️ *Latest moves*
19:13 Mikhail paid $350 for the rent
19:14 Anton purchased Atlantic Avenue
19:15 Mikhail paid $350 for the rent
19:17 Anton purchased Atlantic Avenue
*19:17 Mikhail paid $350 for the rent*
`;

async function start() {
    logger.info('Starting the application');

    canvas.registerFont(
        path.join(process.cwd(), 'assets', 'Roboto-Regular.ttf'),
        { family: 'Roboto' }
    );

    canvas.registerFont(
        path.join(process.cwd(), 'assets', 'Roboto-Bold.ttf'),
        { family: 'Roboto Bold' }
    );

    const telegramBotToken = await loadTelegramBotToken();

    const gameServer = new Server({ loggerProvider });
    await gameServer.connect();

    const bot = new TelegramBot(new Telegraf(telegramBotToken));
    await bot.start();

    const game = new Game({
        chatId,
        author: new Player({
            id: 56681133,
            name: 'Vitaly',
        }),
    }, {
        bot,
        gameServer,
    });

    await game.start();

    // const mapRenderer = new MapRenderer();

    // const image = mapRenderer.render({
    //     spaces: [{
    //         index: 1,
    //         ownerId: 2,
    //         houses: 0,
    //         hotel: true,
    //     }, {
    //         index: 3,
    //         ownerId: 2,
    //         houses: 3,
    //         hotel: false,
    //     }, {
    //         index: 4,
    //         ownerId: 2,
    //         houses: 0,
    //         hotel: false,
    //     }, {
    //         index: 15,
    //         ownerId: 3,
    //         houses: 2,
    //         hotel: false,
    //     }, {
    //         index: 16,
    //         ownerId: 3,
    //         houses: 1,
    //         hotel: false,
    //     }, {
    //         index: 17,
    //         ownerId: 4,
    //         houses: 0,
    //         hotel: false,
    //     }, {
    //         index: 18,
    //         ownerId: 3,
    //         houses: 3,
    //         hotel: false,
    //     }, {
    //         index: 19,
    //         ownerId: 3,
    //         houses: 0,
    //         hotel: true,
    //     }, {
    //         index: 27,
    //         ownerId: 6,
    //         houses: 0,
    //         hotel: false,
    //     }, {
    //         index: 29,
    //         ownerId: 6,
    //         houses: 3,
    //         hotel: false,
    //     }, {
    //         index: 30,
    //         ownerId: 6,
    //         houses: 2,
    //         hotel: false,
    //     }, {
    //         index: 31,
    //         ownerId: 6,
    //         houses: 0,
    //         hotel: true,
    //     }, {
    //         index: 34,
    //         ownerId: 8,
    //         houses: 0,
    //         hotel: false,
    //     }, {
    //         index: 40,
    //         ownerId: 8,
    //         houses: 2,
    //         hotel: false,
    //     }, {
    //         index: 41,
    //         ownerId: 8,
    //         houses: 2,
    //         hotel: false,
    //     }, {
    //         index: 42,
    //         ownerId: 8,
    //         houses: 1,
    //         hotel: false,
    //     }, {
    //         index: 44,
    //         ownerId: 8,
    //         houses: 4,
    //         hotel: false,
    //     }],
    //     players: [{
    //         id: 1,
    //         index: 0,
    //         name: 'Vladimir',
    //         space: 0,
    //         money: 150,
    //     }, {
    //         id: 2,
    //         index: 1,
    //         name: 'Anton',
    //         space: 14,
    //         money: 2500,
    //     }, {
    //         id: 3,
    //         index: 2,
    //         name: 'George',
    //         space: 14,
    //         money: 1570,
    //     }, {
    //         id: 4,
    //         index: 3,
    //         name: 'Mikhail',
    //         space: 25,
    //         money: 870,
    //     }, {
    //         id: 5,
    //         index: 4,
    //         name: 'Jon Snow',
    //         space: 3,
    //         money: 450,
    //     }, {
    //         id: 6,
    //         index: 5,
    //         name: 'Nikita',
    //         space: 32,
    //         money: 300,
    //     }, {
    //         id: 7,
    //         index: 6,
    //         name: 'Vladislav',
    //         space: 35,
    //         money: 448,
    //     }, {
    //         id: 8,
    //         index: 7,
    //         name: 'Lofi hip hop radio - beast to relax/study to',
    //         space: 45,
    //         money: 980,
    //     }],
    // });

    // let messageId = null;
    // try {
    //     messageId = await fs.readFile('./message_id', { encoding: 'utf-8' });
    // } catch (err) {
    //     // ignore
    // }

    // if (!messageId) {
    //     const message = await bot.api.sendPhoto(chatId, { source: image },
    //         { caption, parse_mode: 'MarkdownV2', disable_notification: true });
    //     messageId = message.message_id;
    //     fs.writeFile('./message_id', String(messageId), { encoding: 'utf-8' });

    //     setTimeout(async () => {
    //         const diceMessage1 = await bot.api.sendDice(chatId, { disable_notification: true });
    //         const diceMessage2 = await bot.api.sendDice(chatId, { disable_notification: true });
    //         console.log(diceMessage1.dice.value, diceMessage2.dice.value);

    //         setTimeout(async () => {
    //             await bot.api.deleteMessage(chatId, diceMessage1.message_id);
    //             await bot.api.deleteMessage(chatId, diceMessage2.message_id);
    //         }, 7000);
    //     }, 2000);
    // } else {
    //     try {
    //         await bot.api.editMessageMedia(chatId, Number(messageId), undefined,
    //             { type: 'photo', media: { source: image }, caption, parse_mode: 'MarkdownV2' });
    //     } catch (err) {
    //         // ignore
    //     }
    // }
}

async function loadTelegramBotToken() {
    const credentials = JSON.parse(
        await fs.readFile(
            path.join(process.cwd(), 'credentials.json'),
            { encoding: 'utf-8' }
        )
    );

    return credentials.telegramBotToken;
}

start()
    .then(() => logger.info('Application has been started'))
    .catch((error) => {
        logger.error('Could not start the application', error);
        process.exit(1);
    });
