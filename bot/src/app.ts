import path from 'path';
import { promises as fs } from 'fs';

import { Telegraf } from 'telegraf';
import canvas from 'canvas';

import { LogLevel } from './logging/LoggerProvider';
import { WinstonLoggerProvider } from './logging/WinstonLoggerProvider';

const loggerProvider = new WinstonLoggerProvider({ logLevel: LogLevel.TRACE });
const logger = loggerProvider.create('app');

async function start() {
    logger.info('Starting the application');

    canvas.registerFont(
        path.join(process.cwd(), 'assets', 'Roboto-Regular.ttf'),
        { family: 'Roboto' }
    );

    const spaces = await loadSpaces();
    logger.debug(spaces);

    const telegramBotToken = await loadTelegramBotToken();

    const bot = new Telegraf(telegramBotToken);
    bot.hears('ping', ctx => ctx.reply('pong 🏓'));
    bot.telegram.sendPhoto('-516338149', { source: drawMap(spaces, 1100, 200, 25) });
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

function drawMap(spaces: any[], size: number, spaceOffset: number, maxFontSize: number): Buffer {
    const mapCanvas = canvas.createCanvas(size, size);
    const context = mapCanvas.getContext('2d');

    context.lineWidth = 5;

    context.strokeRect(0, 0, size, size);
    context.strokeRect(spaceOffset, spaceOffset, size - spaceOffset * 2, size - spaceOffset * 2);

    const spacesPerSide = spaces.length / 4;
    const largeSpaceSize = spaceOffset;
    const smallSpaceSize = (size - spaceOffset * 2) / (spacesPerSide - 1);

    for (let i = 0; i < spaces.length; i++) {
        const space = spaces[i];

        const position = i % spacesPerSide;
        const side = Math.floor(i / spacesPerSide);

        const labels = [space.attributes?.name ?? space.type];
        if (space.attributes?.price) {
            labels.push(`$${space.attributes.price}`);
        }

        let fontSize = maxFontSize;
        while (fontSize > 1) {
            context.font = `${fontSize}px "Roboto"`;

            const metrics = context.measureText(labels[0]);
            if (metrics.width >= (largeSpaceSize * 0.85)) {
                fontSize--;
            } else {
                break;
            }
        }

        const currentSpaceSize = position === 0 ? largeSpaceSize : smallSpaceSize;

        let x: number, y: number;

        if (side === 0) { // top, horizontal, LTR
            x = currentSpaceSize / 2
                + Math.min(1, position) * largeSpaceSize
                + Math.max(0, position - 1) * smallSpaceSize;
            y = (largeSpaceSize) / 2;
        } else if (side === 1) { // right, vertical, TTB
            x = size - largeSpaceSize + (largeSpaceSize) / 2;
            y = currentSpaceSize / 2
                + Math.min(1, position) * largeSpaceSize
                + Math.max(0, position - 1) * smallSpaceSize;
        } else if (side === 2) { // bottom, horizontal, RTL
            x = size - (currentSpaceSize / 2
                + Math.min(1, position) * largeSpaceSize
                + Math.max(0, position - 1) * smallSpaceSize);
            y = size - largeSpaceSize + (largeSpaceSize) / 2;
        } else { // left, vertical, BTT
            x = (largeSpaceSize) / 2;
            y = size - (currentSpaceSize / 2
                + Math.min(1, position) * largeSpaceSize
                + Math.max(0, position - 1) * smallSpaceSize);
        }

        context.save();
        context.translate(x, y);
        context.rotate(side < 3 ? (side - 1) * (Math.PI / 2) : 0);
        context.textAlign = 'center';
        context.fillText(labels[0], 0, 0);
        context.restore();
    }

    return mapCanvas.toBuffer();
}

// function drawSpace(space: any) {

// }

start()
    .then(() => logger.info('Application has been started'))
    .catch((error) => {
        logger.error('Could not start the application', error);
        process.exit(1);
    });
