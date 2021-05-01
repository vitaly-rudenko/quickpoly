import path from 'path';
import { promises as fs } from 'fs';

import { Telegraf } from 'telegraf';
import canvas from 'canvas';

import { LogLevel } from './logging/LoggerProvider';
import { WinstonLoggerProvider } from './logging/WinstonLoggerProvider';
import { MapRenderer } from './renderer/MapRenderer';

const loggerProvider = new WinstonLoggerProvider({ logLevel: LogLevel.TRACE });
const logger = loggerProvider.create('app');

async function start() {
    logger.info('Starting the application');

    const spaces = await loadSpaces();

    canvas.registerFont(
        path.join(process.cwd(), 'assets', 'Roboto-Regular.ttf'),
        { family: 'Roboto' }
    );

    const mapRenderer = new MapRenderer(spaces, {
        size: 1108,
        largeSpaceSize: 200,
        fontSize: 18,
        fontFamily: 'Roboto',
    });

    const telegramBotToken = await loadTelegramBotToken();

    const image = mapRenderer.render({
        move: {
            playerId: 'player-3',
        },
        spaces: [{
            index: 1,
            ownerId: 'player-2',
            houses: 0,
            hotel: true,
        }, {
            index: 3,
            ownerId: 'player-2',
            houses: 3,
            hotel: false,
        }, {
            index: 4,
            ownerId: 'player-2',
            houses: 0,
            hotel: false,
        }, {
            index: 15,
            ownerId: 'player-3',
            houses: 2,
            hotel: false,
        }, {
            index: 16,
            ownerId: 'player-3',
            houses: 1,
            hotel: false,
        }, {
            index: 17,
            ownerId: 'player-4',
            houses: 0,
            hotel: false,
        }, {
            index: 18,
            ownerId: 'player-3',
            houses: 3,
            hotel: false,
        }, {
            index: 19,
            ownerId: 'player-3',
            houses: 0,
            hotel: true,
        }, {
            index: 27,
            ownerId: 'player-6',
            houses: 0,
            hotel: false,
        }, {
            index: 29,
            ownerId: 'player-6',
            houses: 3,
            hotel: false,
        }, {
            index: 30,
            ownerId: 'player-6',
            houses: 2,
            hotel: false,
        }, {
            index: 31,
            ownerId: 'player-6',
            houses: 0,
            hotel: true,
        }, {
            index: 34,
            ownerId: 'player-8',
            houses: 0,
            hotel: false,
        }, {
            index: 40,
            ownerId: 'player-8',
            houses: 2,
            hotel: false,
        }, {
            index: 41,
            ownerId: 'player-8',
            houses: 2,
            hotel: false,
        }, {
            index: 42,
            ownerId: 'player-8',
            houses: 1,
            hotel: false,
        }, {
            index: 44,
            ownerId: 'player-8',
            houses: 4,
            hotel: false,
        }],
        players: [{
            id: 'player-1',
            index: 0,
            name: 'Vladimir',
            space: 3,
        }, {
            id: 'player-2',
            index: 1,
            name: 'Anton',
            space: 14,
        }, {
            id: 'player-3',
            index: 2,
            name: 'George',
            space: 14,
        }, {
            id: 'player-4',
            index: 3,
            name: 'Mikhail',
            space: 25,
        }, {
            id: 'player-5',
            index: 4,
            name: 'Jon Snow',
            space: 3,
        }, {
            id: 'player-6',
            index: 5,
            name: 'Nikita',
            space: 32,
        }, {
            id: 'player-7',
            index: 6,
            name: 'Vladislav',
            space: 35,
        }, {
            id: 'player-8',
            index: 7,
            name: 'Lofi hip hop radio - beast to relax/study to',
            space: 35,
        }, {
            id: 'player-9',
            index: 8,
            name: 'Eugene',
            space: 46,
        }, {
            id: 'player-10',
            index: 9,
            name: '1234567890123456',
            space: 46,
        }, {
            id: 'player-11',
            index: 10,
            name: 'Kyle',
            space: 0,
        }, {
            id: 'player-12',
            index: 11,
            name: 'Monopoly Freak',
            space: 0,
        }, {
            id: 'player-13',
            index: 12,
            name: 'Player 13',
            space: 0,
        }, {
            id: 'player-14',
            index: 13,
            name: 'Horny ♥️',
            space: 13,
        }],
    });

    const bot = new Telegraf(telegramBotToken);
    bot.hears('ping', ctx => ctx.reply('pong 🏓'));
    bot.telegram.sendPhoto('-516338149', { source: image });
    bot.launch();
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

async function loadSpaces() {
    return JSON.parse(
        await fs.readFile(
            path.join(process.cwd(), 'spaces-example.json'),
            { encoding: 'utf-8' }
        )
    );
}

start()
    .then(() => logger.info('Application has been started'))
    .catch((error) => {
        logger.error('Could not start the application', error);
        process.exit(1);
    });
