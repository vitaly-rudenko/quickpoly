import path from 'path';
import { promises as fs } from 'fs';

import { Telegraf } from 'telegraf';

import { LogLevel } from './logging/LoggerProvider';
import { WinstonLoggerProvider } from './logging/WinstonLoggerProvider';

const loggerProvider = new WinstonLoggerProvider({ logLevel: LogLevel.TRACE });
const logger = loggerProvider.create('app');

async function start() {
    logger.info('Starting the application');

    const telegramBotToken = await loadTelegramBotToken();

    const bot = new Telegraf(telegramBotToken);
    bot.hears('ping', ctx => ctx.reply('pong 🏓'));
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

start()
    .then(() => logger.info('Application has been started'))
    .catch((error) => {
        logger.error('Could not start the application', error);
        process.exit(1);
    });
