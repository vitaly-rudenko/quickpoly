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
        players: [{
            id: 'player-1',
            name: 'Vladimir',
            space: 3,
        }, {
            id: 'player-2',
            name: 'Anton',
            space: 14,
        }, {
            id: 'player-3',
            name: 'George',
            space: 14,
        }, {
            id: 'player-4',
            name: 'Mikhail',
            space: 25,
        }, {
            id: 'player-5',
            name: 'Jon Snow',
            space: 3,
        }, {
            id: 'player-6',
            name: 'Nikita',
            space: 32,
        }, {
            id: 'player-7',
            name: 'Vladislav',
            space: 35,
        }, {
            id: 'player-8',
            name: 'Lofi hip hop radio - beast to relax/study to',
            space: 35,
        }, {
            id: 'player-9',
            name: 'Eugene',
            space: 46,
        }, {
            id: 'player-10',
            name: 'Bogdan',
            space: 46,
        }, {
            id: 'player-11',
            name: 'Kyle',
            space: 0,
        }, {
            id: 'player-12',
            name: 'Monopoly Freak',
            space: 0,
        }, {
            id: 'player-13',
            name: 'Player 13',
            space: 0,
        }, {
            id: 'player-14',
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
